# Stakeholder Interview Report: Cải tiến Trải nghiệm & Bài học App-Com

**Project:** App-Com (Russian Learning)  
**Issue Key:** APP-COM-01  
**Interview Period:** 2026-08-18  
**Total Stakeholders:** 3 (PO, Học viên, Tech Lead)  
**Author:** BA/PO Agent  
**Status:** Completed

---

## Executive Summary

- **Mục tiêu cốt lõi:** Nâng cấp trải nghiệm tự học độc đáo, liền mạch và thúc đẩy động lực cho học viên, thay thế thiết kế cũ (PDF nhàm chán).
- **Rào cản lớn nhất:** Chi phí vận hành và phát triển phải bằng 0 (hoặc tối thiểu), ưu tiên các giải pháp Free.
- **Điểm sáng:** Tận dụng tính năng AI đang được yêu thích để tích hợp sâu vào bài học.

---

## Stakeholder Matrix

| Stakeholder | Role | Key Needs (Nhu cầu chính) | Constraints (Rào cản) | Priority (Ưu tiên cao) | Concerns / Risks (Rủi ro) |
|---|---|---|---|---|---|
| **Sponsor** | PO / Business | Tăng trải nghiệm tự học, có tính năng độc đáo so với đối thủ. | Ưu tiên triển khai Free (không tốn phí API/vận hành). | Cải tiến module Bài học (Lessons). | App hiện tại quá đơn giản, khó giữ chân user lâu dài. |
| **Học viên** | End User | Lộ trình cá nhân hóa (Du lịch, Ôn thi, Giao tiếp), bài học sinh động. | Quỹ thời gian tự học có hạn, dễ nản chí. | Không muốn đọc PDF; Cần có động lực (gamification). | Đọc PDF tĩnh gây buồn ngủ, không biết phải học gì tiếp theo. |
| **Tech Lead** | Technical (BA giả định) | Dễ triển khai, code maintainable, tận dụng tài nguyên có sẵn. | Giới hạn Free Tier của Supabase, Vercel và các AI API (Groq/Gemini). | Tối ưu logic lưu trữ, không call AI API real-time bừa bãi. | Cá nhân hóa bằng AI real-time có thể dính rate-limit hoặc tốn tiền. |

---

## Consolidated Requirements (Yêu cầu tổng hợp)

Từ các góc nhìn trên, tôi đề xuất **4 Yêu cầu Tính năng (Features)** đáp ứng tiêu chí "Độc đáo - Liền mạch - Miễn phí":

### 1. Lộ trình học Cá nhân hóa (Personalized Roadmap)
- **Mô tả:** Khi đăng ký, học viên chọn Mục tiêu (Giao tiếp / Ôn thi / Du lịch) và Trình độ (A1, A2...). Hệ thống sinh ra một bản đồ (Roadmap) dạng node (tương tự Duolingo).
- **Giải quyết:** Giúp học viên biết chính xác "hôm nay học gì, ngày mai học gì".
- **Tech / Cost:** Hoàn toàn miễn phí. Admin tạo sẵn các Lesson và gán tag (Du lịch, Ngữ pháp...). Khi user chọn mục tiêu, hệ thống query DB hiển thị cây lộ trình tương ứng.

### 2. Bài học Tương tác Micro-learning (Thay thế PDF)
- **Mô tả:** Xé nhỏ file PDF thành các Card kiến thức ngắn. Mỗi Card học xong có 1-2 câu hỏi trắc nghiệm nhỏ hoặc điền từ (Mini-quiz) để test luôn. 
- **Giải quyết:** Loại bỏ sự nhàm chán của việc cuộn đọc PDF tĩnh, tạo trải nghiệm "liền mạch" giữa học và hành.
- **Tech / Cost:** Miễn phí. Lưu data dưới dạng JSON trong Supabase thay vì file PDF.

### 3. Tích hợp "AI Tutor" nhúng trực tiếp vào Bài học (Contextual AI)
- **Mô tả:** Thay vì AI chỉ nằm ở một trang riêng, thêm nút "Hỏi AI Tutor" ngay dưới mỗi Card bài học. AI sẽ được nạp sẵn prompt chứa nội dung Card đó để giải thích ngữ pháp nếu học viên không hiểu.
- **Giải quyết:** Tính năng độc đáo. Tận dụng thế mạnh AI hiện có.
- **Tech / Cost:** Dùng Gemini Free Tier hoặc Groq Free. Cần tối ưu System Prompt ngắn gọn để không vượt giới hạn token miễn phí.

### 4. Hệ thống Động lực học (Gamification cơ bản)
- **Mô tả:** Hiển thị Chuỗi ngày học liên tục (Streak 🔥) và Điểm kinh nghiệm (XP) sau khi hoàn thành mỗi bài học/chặng.
- **Giải quyết:** Thúc đẩy động lực, giữ chân học viên (Retention rate).
- **Tech / Cost:** Rất dễ Dev (thêm trường `current_streak`, `last_study_date`, `xp` vào bảng `profiles` trong Supabase).

---

## Giải quyết Xung đột (Conflict Resolution)
- **Xung đột:** Trải nghiệm "Cá nhân hóa" và "AI Tutor" thường tiêu tốn rất nhiều tiền API (LLM calls). Nhưng PO yêu cầu "Free".
- **Giải pháp:** 
  - Không dùng AI để generate bài học real-time cho từng user. 
  - Thay vào đó, **Admin dùng AI ở hậu trường (Offline)** để chuyển đổi (convert) các file PDF thành dữ liệu JSON (Bài học tương tác). User chỉ query JSON từ Database (miễn phí hoàn toàn).
  - AI chỉ được gọi real-time khi học viên chủ động bấm nút "Giảng lại phần này cho tôi".

---

## Next Steps
1. Xác nhận các Đề xuất Tính năng trên có phù hợp với tầm nhìn của PO không?
2. Nếu PO đồng ý (Sign-off), BA sẽ tiến hành viết **Tech-Spec chi tiết** (hoặc Business-Spec) để Dev triển khai phần Lộ trình & Bài học tương tác.
