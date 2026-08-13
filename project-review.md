# 🔍 Đánh giá Code Đa chiều — Dự án "Học Tiếng Nga AI"

> **Phạm vi:** Toàn bộ codebase — 242 files, ~26,880 dòng code
> **Stack:** Next.js 16 + Supabase + Gemini AI + TailwindCSS + Zod + React Hook Form
> **Kiến trúc:** Action → Service → Repository → Supabase (3-layer)

---

## Bối cảnh (Context)

Dự án là một **LMS (Learning Management System)** hỗ trợ dạy & học tiếng Nga, bao gồm:
- **Admin panel:** Quản lý bài học (grammar), đề thi (exam), sinh viên, import đề từ file .docx
- **Student portal:** Học bài, thi cử, chat AI, shadowing, tra từ điển AI, roleplay
- **AI integration:** Gemini API cho chat, chấm bài tự luận, tra từ điển; Edge TTS cho phát âm

---

## Phán quyết Tổng thể

> **Yêu cầu thay đổi (Request Changes)** — Có nhiều issues cần giải quyết, đặc biệt ở trục **Bảo mật** và **Type Safety**.

### Tổng hợp nhanh

| Trục | Đánh giá | Ghi chú |
|------|---------|---------|
| ✅ Tính chính xác | **7/10** — Khá tốt | Logic chấm bài hợp lý, có edge case handling |
| ✅ Khả năng đọc hiểu | **7/10** — Khá | Layered rõ ràng, naming tốt, nhưng vài file quá lớn |
| ⚠️ Kiến trúc | **6/10** — Cần cải thiện | `as any` tràn lan, thiếu type boundaries, `requireAdmin()` trùng lặp |
| 🔴 Bảo mật | **4/10** — Nghiêm trọng | API keys lộ trong `.env.local`, middleware dùng `getSession()` không an toàn, thiếu rate limiting |
| ⚠️ Hiệu năng | **6/10** — Cần soi | DashboardRepository chạy 12 queries song song, TTS API ghi file tạm |

---

## 🔴 Critical — Chặn Merge

### CR-01: API Keys thật đang nằm trong `.env.local` và có thể bị lộ

**File:** [.env.local](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/.env.local)

```
GEMINI_API_KEY=AIzaSyAf6OjY_odovYH-9k2Cl14g9PS06-081q8
GEMINI_API_KEYS=AIzaSyAUk3P7dbBxUazjEny4_...(4 keys)
GROQ_API_KEY=gsk_IPBxmBEwfr8gz9RMbyWA...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> [!CAUTION]
> File `.env.local` chứa **4 Gemini API keys thật**, **1 Groq API key**, và **Supabase anon key** hoàn chỉnh. Mặc dù `.gitignore` đang exclude `.env*` (đã confirm file chưa bị commit vào git), nhưng:
> - Keys nằm trên đĩa cứng không được mã hóa. Nếu máy bị compromised, toàn bộ keys bị lộ.
> - Bất kỳ ai mở file này đều thấy keys.
> - Nếu ai đó thêm `.env.local` vào git nhầm một lần → lộ vĩnh viễn trong history.

**Hành động bắt buộc:**
1. Rotate tất cả API keys ngay lập tức (Gemini, Groq).
2. Thêm `.env.local` vào `.gitignore` (đã có ✅), nhưng cần double-check rằng git history KHÔNG chứa file này (`git log --all --full-history -- .env.local`).
3. Cân nhắc dùng secrets manager (Vercel Environment Variables, Doppler, hoặc `.env.vault`).

---

### CR-02: Middleware dùng `getSession()` thay vì `getUser()` — có thể bị giả mạo JWT

**File:** [middleware.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/supabase/middleware.ts#L50-L54)

```typescript
// TỐI ƯU TỐC ĐỘ: Dùng getSession() thay vì getUser()
// getSession() chỉ giải mã cookie cục bộ (0ms), không gửi request qua mạng
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user
```

> [!CAUTION]
> **Supabase chính thức cảnh báo:** `getSession()` đọc JWT từ cookie **mà KHÔNG xác minh (verify) với Auth server**. Kẻ tấn công có thể tạo JWT giả với `role: "admin"` và bypass toàn bộ middleware protection, bao gồm truy cập admin panel.

Comment trong code nói "TỐI ƯU TỐC ĐỘ" nhưng đây là **trade-off bảo mật nghiêm trọng** — tốc độ middleware KHÔNG quan trọng bằng việc đảm bảo user thật.

**Hành động bắt buộc:** Đổi `getSession()` thành `getUser()` trong middleware. Chi phí ~50ms mỗi request là chấp nhận được so với rủi ro bị bypass auth.

---

### CR-03: Role check trong middleware dùng `user_metadata` từ JWT chưa verify

**File:** [middleware.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/supabase/middleware.ts#L73-L92)

```typescript
const role = user.user_metadata?.role || 'student' // mặc định là student nếu không có role

if (path.startsWith(protectedRoutes.admin) && role !== 'admin' && role !== 'ADMIN') {
  // redirect...
}
```

> [!WARNING]
> Kết hợp với CR-02: `user_metadata` đọc từ JWT chưa verify, nên role cũng không đáng tin. Ngoài ra, kiểm tra role bằng cách so sánh string `'admin'` || `'ADMIN'` lặp đi lặp lại ở nhiều nơi — nên tạo helper function `isAdmin(user)`.

---

### CR-04: API Routes thiếu rate limiting

**Files:**
- [/api/chat-ai/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/chat-ai/route.ts)
- [/api/dictionary-lookup/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/dictionary-lookup/route.ts)
- [/api/tts/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/tts/route.ts)
- [/api/grammar-quiz/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/grammar-quiz/route.ts)

> [!WARNING]
> Tất cả API routes gọi Gemini/Edge TTS **không có rate limiting**. Một user đã đăng nhập có thể:
> - Spam `/api/chat-ai` liên tục → exhaust Gemini API quota cho cả hệ thống
> - Spam `/api/tts` → tạo hàng ngàn file tạm trên server → disk exhaustion
> - Spam `/api/dictionary-lookup` → exhaust Gemini quota

**Hành động bắt buộc:** Thêm rate limiting (ví dụ: max 30 requests/phút/user cho AI endpoints). Có thể dùng `upstash/ratelimit` hoặc in-memory Map đơn giản.

---

## Bắt buộc thay đổi (Required)

### RQ-01: `as any` tràn lan — 50+ chỗ không có type boundary

**Files chính:**
- [examSubmissions.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/actions/examSubmissions.ts) — 8 lần `as any`
- Nhiều component admin dùng `(field as any).value` / `(field as any).onChange`
- Shadowing pages dùng `(supabase as any).from('shadowing_topics')`, `(window as any).currentAudio`

> [!IMPORTANT]
> `as any` che đậy invariant không rõ ràng. Đặc biệt:
> - `(supabase as any).from('shadowing_topics')` → bảng `shadowing_topics` chưa có trong Database types. **Cần update types/database.type.ts** khi thêm bảng mới, không phải bypass type system.
> - `q.options as any` trong exam grading → cần khai báo interface `ExamQuestionOptions` thay vì dùng `any`.

**Hành động:** Tạo proper types cho `submission_question_results`, `shadowing_topics`, `shadowing_sentences` và thêm vào `Database` type. Giảm `as any` xuống dưới 10 chỗ (chỉ cho browser APIs như `webkitSpeechRecognition`).

---

### RQ-02: `requireAdmin()` bị duplicate 3 lần

**Files:**
- [src/lib/auth.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/auth.ts#L7-L34) — có fallback check profiles table ✅
- [src/services/ExamService.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/services/ExamService.ts#L6-L19) — chỉ check profiles, KHÔNG check metadata
- [src/services/GrammarService.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/services/GrammarService.ts#L22-L30) — chỉ check profiles, KHÔNG check metadata

3 bản implementation khác nhau, logic khác nhau:
- `lib/auth.ts` check metadata trước, fallback profiles → **tốt nhất**
- `ExamService` và `GrammarService` chỉ check `profiles.role` → **thiếu đồng nhất**

**Hành động:** Xóa 2 bản `requireAdmin()` trùng lặp trong `ExamService.ts` và `GrammarService.ts`. Import từ `@/lib/auth` thống nhất (như `DashboardService` đang làm đúng).

---

### RQ-03: `ExamActions.ts` thiếu auth check — server action không bảo vệ

**File:** [ExamActions.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/actions/ExamActions.ts)

```typescript
export async function getExams(page = 1, pageSize = 10, search = "") {
  const { data, count, error } = await ExamService.getList(page, pageSize, search);
  // ❌ Không check auth — ai cũng gọi được
}

export async function getExamDetail(id: string) {
  // ❌ Không check auth
}

export async function getExamQuestions(examId: string) {
  // ❌ Không check auth — lộ đáp án đề thi
}
```

> [!WARNING]
> `getExamQuestions()` trả về **toàn bộ `options` field bao gồm `correct_indexes`** (đáp án đúng) mà KHÔNG kiểm tra user có phải admin hay không. Bất kỳ ai gọi được server action này đều thấy đáp án.

**Hành động:** Phân quyền chặt:
- `getExams()` / `getExamDetail()` → public OK (danh sách đề thi).
- `getExamQuestions()` → **admin only** cho trả về full options, hoặc strip `correct_indexes` nếu gọi bởi student.

---

### RQ-04: `examSubmissions.ts` quá lớn — 525 dòng với quá nhiều trách nhiệm

**File:** [examSubmissions.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/actions/examSubmissions.ts) — **525 dòng**

File này chứa:
- Types (interfaces)
- Helper functions (`parseOptions`, `normalizeWords`, `stripQ`)
- 5 grader functions (`gradeMultipleChoice`, `gradeWordArrangement`, `gradeErrorCorrection`, `gradeFillInBlank`, `gradeEssayWithAI`)
- Orchestrator (`evaluateQuestionAnswer`)
- 2 server actions (`getSubmissionDetail`, `submitExam`)

**Hành động:** Tách thành:
- `src/lib/graders/` — chứa 5 grader functions + `evaluateQuestionAnswer`
- `src/actions/examSubmissions.ts` — chỉ giữ `getSubmissionDetail` + `submitExam`

---

### RQ-05: Thiếu input validation cho `word` param trong dictionary API

**File:** [dictionary-lookup/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/dictionary-lookup/route.ts#L18-L25)

```typescript
const { word } = body;
if (!word || !word.trim()) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
const trimmedWord = word.trim();
// ❌ Không giới hạn độ dài — user có thể gửi string 100KB vào prompt
```

**Hành động:** Thêm `if (trimmedWord.length > 100) return ...` — giới hạn input gửi vào AI prompt để tránh prompt injection và token waste.

Tương tự cho `/api/chat-ai` — field `messages` không validate kích thước.

---

### RQ-06: TTS API ghi file tạm (sync I/O) — không scale và có rủi ro

**File:** [tts/route.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/api/tts/route.ts#L23-L32)

```typescript
const tmpPath = path.join(os.tmpdir(), `tts-${Date.now()}-...`);
await tts.ttsPromise(text, tmpPath);
const audioBuffer = fs.readFileSync(tmpPath);  // ❌ Sync I/O block event loop
fs.unlinkSync(tmpPath);                         // ❌ Sync I/O
```

**Hành động:**
1. Dùng `fs.promises.readFile()` và `fs.promises.unlink()` thay vì sync variants.
2. Wrap trong `try/finally` để đảm bảo cleanup ngay cả khi `readFile` fail.
3. Nếu `node-edge-tts` hỗ trợ stream → dùng stream thay vì ghi file.

---

### RQ-07: Client-side TTS lib bị memory leak (Object URL không được revoke)

**File:** [src/lib/tts.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/tts.ts#L43-L45)

```typescript
const url = URL.createObjectURL(blob);
currentAudio = new Audio(url);
await currentAudio.play();
// ❌ url không bao giờ được revoke → memory leak
```

**Hành động:** Thêm `currentAudio.onended = () => URL.revokeObjectURL(url)` hoặc revoke URL trong `cancelSpeech()`.

---

## Nit — Không bắt buộc

### N-01: Comment thừa "Thêm dòng này" trong layout

**File:** [layout.tsx](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/layout.tsx#L31)

```tsx
<Toaster position="top-center" richColors /> {/* <-- Thêm dòng này */}
```

Comment `{/* <-- Thêm dòng này */}` là dấu vết từ lúc dev, nên xóa đi.

---

### N-02: Thư viện trùng lặp: `@google/genai` VÀ `@google/generative-ai`

**File:** [package.json](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/package.json#L12-L13)

```json
"@google/genai": "^1.43.0",
"@google/generative-ai": "^0.24.1",
```

`@google/genai` là phiên bản mới thay thế `@google/generative-ai`. Codebase đang dùng `@google/genai` — xóa `@google/generative-ai` để giảm bundle size.

---

### N-03: File test rác ở root

**Files:**
- `test-mammoth.js` (3456 bytes)
- `test-zod.mjs` (1732 bytes)
- `tsc_output.txt` (2964 bytes)
- `supabase_roleplay_history.sql` (778 bytes)

Đây là file test/scratch — nên di chuyển vào `scripts/` hoặc xóa bỏ.

---

### N-04: `geistSans` và `geistMono` khai báo nhưng chưa dùng trong layout

**File:** [layout.tsx](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/layout.tsx#L9-L17)

```typescript
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// ❌ Không thấy được apply vào className nào
```

---

### N-05: `createClient()` không import `Database` type trong middleware

**File:** [middleware.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/supabase/middleware.ts#L22)

```typescript
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ❌ Không dùng generic <Database> → mất type safety
```

---

## Optional / Consider

### OPT-01: DashboardRepository chạy 12 queries đồng thời

**File:** [DashboardRepository.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/repositories/DashboardRepository.ts#L7-L33)

12 lần `Promise.all()` gọi Supabase cùng lúc. Mỗi query là `count: exact` + `head: true` nên nhẹ, nhưng:
- Nếu Supabase rate limit hoặc connection pool cạn → fail cả 12.
- **Consider:** Gom thành 1 RPC (stored procedure) trả về tất cả counts.

---

### OPT-02: Gemini key rotation không thread-safe

**File:** [gemini.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/gemini.ts#L15-L19)

```typescript
let currentKeyIndex = Math.floor(Math.random() * Math.max(1, API_KEYS.length));

function getNextApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}
```

Trong Node.js single-thread, điều này OK. Nhưng nếu deploy Edge Runtime (Next.js middleware) hoặc serverless (mỗi instance có state riêng), round-robin sẽ không phân phối đều.

**Consider:** Dùng random selection thay vì round-robin nếu deploy serverless.

---

### OPT-03: `examSubmissions.ts` — Missing auth check cho `submitExam()`

**File:** [examSubmissions.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/actions/examSubmissions.ts#L362-L369)

`submitExam()` có check `if (!user) return { success: false, error: 'Unauthorized' }` ✅, nhưng KHÔNG kiểm tra:
- User có phải student không (admin có thể submit bài?)
- Exam có đang `published` không (student submit đề `draft`?)
- User đã submit bài này chưa (re-submission?)

**Consider:** Thêm business rules validation.

---

### OPT-04: `GrammarActions.ts` trả `error` field không nhất quán

**File:** [GrammarActions.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/actions/GrammarActions.ts#L9-L16)

```typescript
export async function getGrammars(...) {
  if (error) {
    return { data: [], count: 0, error: error.message };
  }
  return { data, count, error }; // ❌ error ở đây là Supabase PostgrestError, không phải string
}
```

Kiểu trả về không nhất quán: nhánh lỗi trả `error: string`, nhánh thành công trả `error: PostgrestError | null`. Nên chuẩn hóa thành `error: string | null`.

---

## FYI — Thông tin tham khảo

### FYI-01: Không có test nào trong toàn bộ dự án

Tìm kiếm `*.test.*`, `*.spec.*`, `__tests__` → **0 kết quả**.

242 files, ~26,880 dòng code mà không có bất kỳ automated test nào. Đặc biệt nguy hiểm cho:
- Logic chấm bài (`gradeMultipleChoice`, `gradeErrorCorrection`, v.v.) — sai logic = sai điểm thi
- Exam import parser (`examImportParser.ts`) — regex-heavy, dễ regression
- Shadowing evaluator (`shadowingEvaluator.ts`) — WER algorithm

---

### FYI-02: Cấu trúc project có layered architecture tốt

```
Actions (Server Actions) → Services (Business Logic) → Repositories (Data Access)
```

Đây là pattern tốt, duy trì rõ ràng. `DashboardService.ts` là ví dụ mẫu: gọn, rõ ràng, dùng canonical `requireAdmin()`.

---

### FYI-03: Zod schemas well-structured

[exam.ts](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/lib/schemas/exam.ts) sử dụng `z.discriminatedUnion("question_type", [...])` — đây là best practice cho union types. 10 question types được khai báo rõ ràng.

---

### FYI-04: `suppressHydrationWarning` trong `<body>` tag

**File:** [layout.tsx](file:///Users/qa-quangnt/Desktop/Project/russian%20learning/App-Com/src/app/layout.tsx#L28)

Đây có thể là workaround cho browser extensions gây hydration mismatch. Nếu không cần thiết, nên xóa.

---

## Checklist Xác minh

```markdown
## Đánh giá (Review): Toàn bộ dự án "Học Tiếng Nga AI"

### Bối cảnh (Context)
- [x] Tôi hiểu thay đổi này làm gì và tại sao cần làm

### Tính chính xác (Correctness)
- [x] Logic chấm bài hợp lý, xử lý nhiều question types
- [ ] Edge cases: thiếu test cho grading functions
- [x] Error paths được xử lý với try/catch

### Khả năng đọc hiểu (Readability)
- [x] Đặt tên rõ ràng và nhất quán
- [x] Code tổ chức logic theo layers
- [ ] `examSubmissions.ts` quá lớn (525 dòng)

### Kiến trúc (Architecture)
- [x] 3-layer pattern nhất quán
- [ ] `requireAdmin()` trùng lặp 3 chỗ
- [ ] 50+ `as any` phá vỡ type boundaries
- [ ] Bảng DB mới không được update vào Database type

### Bảo mật (Security)
- [ ] ❌ Middleware dùng `getSession()` — có thể bypass auth
- [ ] ❌ API routes thiếu rate limiting
- [ ] ❌ `getExamQuestions()` lộ đáp án cho mọi user
- [ ] ❌ Input validation thiếu cho AI endpoints
- [x] Secrets không bị commit vào git

### Hiệu năng (Performance)
- [ ] TTS API dùng sync I/O
- [ ] Memory leak ở client TTS (ObjectURL)
- [x] DashboardRepository dùng `head: true` tiết kiệm

### Xác minh (Verification)
- [ ] ❌ Không có test nào
- [ ] ❌ Không có CI/CD pipeline
- [ ] Build status chưa verify

### Phán quyết cuối cùng (Verdict)
- [ ] Approve
- [x] **Yêu cầu thay đổi (Request changes)** — Phải giải quyết CR-01→04 và RQ-01→07
```

---

## Tóm tắt Hành động theo Thứ tự Ưu tiên

| # | Severity | Mô tả | File |
|---|----------|-------|------|
| CR-01 | 🔴 Critical | Rotate API keys, kiểm tra git history | `.env.local` |
| CR-02 | 🔴 Critical | Đổi `getSession()` → `getUser()` trong middleware | `lib/supabase/middleware.ts` |
| CR-03 | 🔴 Critical | Chuẩn hóa role check, tạo `isAdmin()` helper | `lib/supabase/middleware.ts` |
| CR-04 | 🔴 Critical | Thêm rate limiting cho AI API routes | `api/*/route.ts` |
| RQ-01 | ⚠️ Required | Giảm `as any`, update Database types | Nhiều files |
| RQ-02 | ⚠️ Required | Gom `requireAdmin()` về 1 chỗ | Services |
| RQ-03 | ⚠️ Required | Auth + strip answers cho `getExamQuestions()` | `ExamActions.ts` |
| RQ-04 | ⚠️ Required | Tách `examSubmissions.ts` thành modules nhỏ | `actions/` |
| RQ-05 | ⚠️ Required | Validate input length cho AI endpoints | `api/*/route.ts` |
| RQ-06 | ⚠️ Required | Async I/O + cleanup cho TTS API | `api/tts/route.ts` |
| RQ-07 | ⚠️ Required | Revoke Object URLs trong TTS client | `lib/tts.ts` |
