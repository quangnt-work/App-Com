# Kế hoạch Kiểm toán & Sửa lỗi (Dev Audit & Auto-Fix) - Chức năng Quản lý Admin (Lessons)

Sau khi kiểm toán chuyên sâu mã nguồn các chức năng quản lý bài học (Admin Lessons: Grammar, Video, Audio), tôi phát hiện ra một nhóm lỗi lặp lại (anti-pattern) liên quan nghiêm trọng đến Khả năng tiếp cận (Accessibility - a11y) và Trải nghiệm người dùng (UX) trên bàn phím. Dưới đây là kế hoạch sửa chữa:

- [x] **Task 1: Bổ sung khả năng điều hướng bàn phím cho các vùng Upload Dropzone**
  - **Vấn đề:** Trong `GrammarForm.tsx`, `VideoForm.tsx`, và `AudioForm.tsx`, các vùng kéo thả/chọn file (Dropzone) được thiết kế bằng thẻ `<div>` chỉ có sự kiện `onClick`. Người dùng bàn phím (không dùng chuột) hoặc người dùng công cụ đọc màn hình sẽ không thể focus hay nhấn Enter/Space để mở hộp thoại chọn file.
  - **Giải pháp:** Bổ sung `role="button"`, `tabIndex={0}`, `aria-label` và bắt sự kiện `onKeyDown` (phím Enter/Space) cho các thẻ `<div>` này ở cả 3 form.

- [x] **Task 2: Thêm nhãn (aria-label) cho các nút Hủy/Xóa file trong Form**
  - **Vấn đề:** Nút xóa file đã chọn (chứa icon `X`) trong các form upload không có nhãn văn bản. Trình đọc màn hình sẽ chỉ đọc là "Button", không rõ mục đích.
  - **Giải pháp:** Bổ sung `aria-label="Xóa file"` hoặc nhãn tương ứng cho các nút bấm này.

- [x] **Task 3: Thêm nhãn (aria-label) cho các nút thao tác trong Table**
  - **Vấn đề:** Các nút Xem trước (Eye), Chỉnh sửa (Edit) trong `GrammarTable.tsx` và nút Xóa (Trash) trong `DeleteGrammarButton.tsx` chỉ dùng Icon mà không có `aria-label`, gây khó hiểu cho người khiếm thị.
  - **Giải pháp:** Bổ sung `aria-label` (VD: "Xem trước bài học", "Chỉnh sửa bài học", "Xóa bài học") cho tất cả các nút icon-only này.
