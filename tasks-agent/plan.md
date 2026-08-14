# Kế hoạch Tối ưu hiệu năng (Performance Optimization)

Dựa trên các triệu chứng bạn cung cấp, tôi đã phân tích (Profile & Đo lường) và xác định được các điểm nghẽn (bottleneck) sau:

## 1. Tối ưu độ trễ âm thanh chức năng Shadowing [Hoàn tất]
- **Nguyên nhân (Triệu chứng: Mất một lúc mới load và phát ra âm thanh):** 
  - API `/api/tts` (Text-to-Speech) sử dụng phương thức `POST`, do đó trình duyệt không tự động cache lại kết quả. 
  - Mỗi khi chuyển câu hoặc bấm nút "Nghe lại", hệ thống lại gửi request lên server để tạo lại file âm thanh và tải về, gây ra độ trễ (delay) ít nhất 1-2 giây.
- **Giải pháp:**
  1. **Tích hợp Audio Cache (Client-side):** Sử dụng `useRef<Map>` để lưu lại các `Blob URL` đã được tải. Nếu người dùng bấm nghe lại một câu với cùng tốc độ, sẽ lấy ngay từ cache thay vì gọi API.
  2. **Pre-fetch âm thanh (Tải trước âm thanh):** Bổ sung logic tải ngầm âm thanh của **câu tiếp theo** (Next Sentence) trong khi người dùng đang thu âm/nhại lại câu hiện tại. Như vậy khi họ bấm "Câu tiếp theo", âm thanh đã có sẵn và phát ngay lập tức (Zero delay).

## 2. Tối ưu tốc độ Đăng nhập lần đầu [Hoàn tất]
- **Nguyên nhân (Triệu chứng: Đăng nhập lần đầu bị chậm):** 
  - Trong Server Action `login`, sau khi gọi xác thực `signInWithPassword`, hệ thống query bảng `profiles`, và có một đoạn logic kiểm tra: nếu `role` trong JWT (metadata) khác với `role` trong DB, nó sẽ gọi thêm hàm `supabase.auth.updateUser` để đồng bộ. Quá trình này cần thêm một round-trip API đến máy chủ Supabase.
  - Ngoài ra, Component `Header.tsx` đang gọi lại hàm `getAuthUser` (cũng là một roundtrip lên server) thông qua `useEffect` mỗi khi chuyển trang (kể cả ngay sau khi đăng nhập và redirect).
- **Giải pháp:**
  1. **Tránh gọi API thừa ở Header:** Sửa lại logic trong `Header.tsx` để giảm thiểu các lượt `fetchUser` không cần thiết ngay lúc mới đăng nhập (tận dụng Context hoặc local state truyền sẵn). Đã chuyển sang lấy user 1 lần duy nhất trên `RootLayout` (Server Component) với `Zero Client-side Fetching`.


---
Vui lòng gõ **'OK'** để tôi tự động áp dụng các giải pháp này vào mã nguồn (Auto-Fix).
