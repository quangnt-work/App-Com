# Kế hoạch Kiểm toán và Tối ưu (Audit & Fix)

Dựa trên kết quả rà soát mã nguồn toàn diện của dự án, tôi đã phát hiện một số điểm nghẽn về hiệu năng (UX không mượt mà do thiếu Loading UI), vi phạm Best Practice của Next.js (dùng thẻ `<img>` thay vì `next/image`), và lỗi ép kiểu TypeScript. Dưới đây là kế hoạch chi tiết để tối ưu dự án:

## Vấn đề phát hiện (Bước 1: Audit)
1. **Trải nghiệm người dùng (UX) bị block (Không mượt mà):** Các trang quan trọng của học viên (`/student/lessons`, `/student/ai`, v.v.) hiện tại lấy dữ liệu trên Server (SSR) nhưng **thiếu file `loading.tsx`**. Điều này khiến trình duyệt bị "đơ" (blocking) trong lúc chờ fetch data, người dùng không thấy phản hồi ngay lập tức.
2. **Hiệu năng ảnh chưa tối ưu:** Một số component (`VideoLessonCard.tsx`, `StudentDetailHeader.tsx`, `VideoTable.tsx`) dùng thẻ `<img />` nguyên thủy thay vì `<Image />` của Next.js. Điều này làm mất đi khả năng lazy-load và tối ưu kích thước ảnh, gây lãng phí băng thông.
3. **Lỗi TypeScript / Bug tiềm ẩn:** Trang `src/app/(admin)/admin/exams/[id]/page.tsx` có lỗi TypeScript (`TS2322`) do gán sai kiểu chuỗi cho hằng số Literal Type của `exam_type`.

## Kế hoạch thực thi (Bước 2: Plan)
Để nâng cấp trải nghiệm mượt mà và fix lỗi, hệ thống sẽ thực hiện các bước sau:

1. **Khắc phục Blocking UI (Thêm Skeleton Loaders):**
   - Tạo file `src/app/(student)/student/loading.tsx` với giao diện Skeleton (khung xám nhấp nháy) để hiển thị tức thì khi người dùng bấm chuyển trang.
2. **Tối ưu hóa hiệu năng ảnh:**
   - Refactor các component đang dùng `<img />` sang `import Image from 'next/image'`. 
   - Thêm thuộc tính `width`, `height` (hoặc `fill`) để Next.js tự động tối ưu hóa ảnh.
3. **Sửa lỗi Build TypeScript:**
   - Ép kiểu (Type Assertion) an toàn cho biến `exam_type` và `level` tại `page.tsx` trong module Admin Exams.
