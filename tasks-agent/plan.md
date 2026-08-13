# Kế hoạch Kiểm toán & Sửa lỗi (Dev Audit & Auto-Fix) - Shadowing AI

Dựa trên quá trình kiểm toán các file liên quan đến tính năng Shadowing AI (`page.tsx`, `useShadowingSession.ts`, `shadowingEvaluator.ts`, `route.ts`), tôi đề xuất kế hoạch nâng cấp và sửa lỗi như sau:

- [x] **Task 1: Sửa lỗi Memory Leak & Biến toàn cục (Global State) của Audio**
  - **Vấn đề:** Hiện tại `page.tsx` đang gán Audio object vào `(window as any).currentAudio`. Điều này vi phạm nghiêm trọng best practices của React, gây ô nhiễm biến toàn cục, có nguy cơ rò rỉ bộ nhớ (memory leak) và khó kiểm soát khi component unmount.
  - **Giải pháp:** Thay thế bằng `useRef<HTMLAudioElement | null>(null)`. Đảm bảo gọi `audioRef.current.pause()` một cách an toàn mỗi khi phát audio mới hoặc khi component unmount. Thêm block `try...catch` đầy đủ cho `audio.play()` để tránh crash trình duyệt do Autoplay Policy.

- [x] **Task 2: Sửa lỗi Type Safety (Loại bỏ `any`)**
  - **Vấn đề:** Trong `page.tsx`, có sử dụng `as any` khi ép kiểu mảng sentences, và `(currentSentence as any).audio_url` vì TypeScript interface không khớp dữ liệu thực tế.
  - **Giải pháp:** Định nghĩa lại interface phụ trợ hoặc ép kiểu chặt chẽ hơn (`ShadowingSentence & { audio_url?: string }`). Loại bỏ hoàn toàn `any` để đảm bảo Type Safety.

- [x] **Task 3: Cải thiện Khả năng tiếp cận (Accessibility - a11y)**
  - **Vấn đề:** Các nút điều khiển chính (Play audio, Mic, Next) hiện tại chỉ dùng thuộc tính `title` thay vì `aria-label` chuẩn, làm giảm trải nghiệm cho trình đọc màn hình.
  - **Giải pháp:** Bổ sung `aria-label` đầy đủ vào các nút này.

- [x] **Task 4: Tối ưu hoá `useEffect` Dependency Array**
  - **Vấn đề:** Có các dòng `// eslint-disable-next-line react-hooks/exhaustive-deps` để bỏ qua cảnh báo về mảng phụ thuộc (dependency) của `useEffect`. Việc này tiềm ẩn rủi ro race-condition về sau.
  - **Giải pháp:** Khai báo đầy đủ các dependencies cần thiết (như `handleEvaluation`, `playAudio`) bằng cách đảm bảo chúng được bọc trong `useCallback` ổn định, sau đó xoá dòng ignore lint.
