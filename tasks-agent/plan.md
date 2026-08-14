# Kế hoạch Tự động Đánh giá & Tối ưu: Chức năng Nghe (Audio Module)

Qua quá trình kiểm toán toàn diện (Audit & Review) chức năng nghe `student/lessons/audios`, tôi đã phát hiện 2 vấn đề lớn liên quan đến Trải nghiệm người dùng (UX), Trợ năng (A11y) và Lỗi chức năng nghiêm trọng (Functional Bug).

## 1. Tối ưu Trình phát nhạc - AudioPlayer (UX & A11y)
- **Vấn đề:** Thanh tua thời gian (Progress bar) hiện tại đang được code bằng thẻ `<div>` thuần túy bắt sự kiện `onClick`. Việc này dẫn đến việc người dùng không thể sử dụng bàn phím (Tab, mũi tên trái/phải) để tua bài nghe, và các trình đọc màn hình cũng không nhận diện được thanh này.
- **Giải pháp:** 
  - [x] Chuyển đổi kiến trúc thanh tua thời gian sang sử dụng thẻ `<input type="range">` để được trình duyệt hỗ trợ mặc định về trợ năng (Accessible Slider). 
  - [x] Đồng bộ phong cách thiết kế (CSS) cũ bằng kỹ thuật tạo overlay (track & thumb).
  - [x] Bổ sung các nhãn `aria-label` cho thanh tua.

## 2. Sửa lỗi Ghi chú bị mất - NotesSection (Bug & A11y)
- **Vấn đề (Data Loss Bug):** Tính năng "Ghi chú của bạn" hiện tại chỉ là lớp vỏ giao diện (UI). Khi người dùng gõ ghi chú và vô tình làm mới (F5) trang hoặc quay lại sau, toàn bộ ghi chú sẽ "bay màu" vì không được lưu trữ. Ngoài ra, vùng gõ chữ (contentEditable) không được hệ thống đọc màn hình nhận diện là hộp văn bản.
- **Giải pháp:**
  - [x] Cài đặt cơ chế **Tự động lưu (Auto-save)** ghi chú xuống `localStorage` của trình duyệt theo từng ID bài học (ví dụ: `audio-note-abc123`).
  - [x] Khi người dùng truy cập lại bài nghe, tự động khôi phục (hydrate) nội dung ghi chú cũ.
  - [x] Thêm các thuộc tính trợ năng: `role="textbox"`, `aria-multiline="true"`, và `aria-label` cho trình soạn thảo.

## 3. Bổ sung Phân trang (Pagination) cho danh sách Bài Nghe
- **Vấn đề:** Bỏ quên phân trang dẫn đến không hiển thị bài tiếp theo.
- **Giải pháp:**
  - [x] Thêm phân trang vào route `/student/lessons/audios/page.tsx`.
  - [x] Xử lý số thứ tự thẻ (Card) chuẩn xác dựa trên `currentPage`.
