# Todo — JoyB.VN

> Cập nhật thường xuyên. Trạng thái: ✅ Xong | 🔄 Đang làm | ⏳ Chưa bắt đầu | ❌ Bỏ qua

---

## Phase 1 — Nền tảng & Thiết kế (Tuần 1–2)

- ⏳ Phân tích yêu cầu hệ thống
- ⏳ Thiết kế ERD (Entity Relationship Diagram)
- ⏳ Thiết kế database schema — tất cả bảng
- ⏳ Vẽ wireframe các trang chính (Figma hoặc tay)
- ⏳ Xác định tech stack chính thức
- ⏳ Setup project (repo Git, cấu trúc thư mục)
- ⏳ Cài đặt môi trường dev (Node/Laravel + MySQL)

---

## Phase 2 — Backend API (Tuần 3–5)

### Auth
- ⏳ Đăng ký / Đăng nhập (JWT)
- ⏳ Middleware xác thực token
- ⏳ Phân quyền: customer / organizer / admin
- ⏳ Reset mật khẩu qua email

### Event API
- ⏳ `GET /api/events` — danh sách sự kiện (filter, pagination)
- ⏳ `GET /api/events/:id` — chi tiết sự kiện
- ⏳ `POST /api/events` — tạo sự kiện (organizer)
- ⏳ `PUT /api/events/:id` — cập nhật sự kiện
- ⏳ `DELETE /api/events/:id` — xóa / ẩn sự kiện

### Ticket & Order API
- ⏳ `GET /api/events/:id/seats` — lấy sơ đồ ghế
- ⏳ `POST /api/orders` — đặt vé (lock ghế tạm thời)
- ⏳ `POST /api/orders/:id/confirm` — xác nhận thanh toán
- ⏳ `GET /api/orders` — lịch sử đơn hàng
- ⏳ `DELETE /api/orders/:id` — hủy vé

### Admin API
- ⏳ Quản lý user
- ⏳ Duyệt / từ chối sự kiện
- ⏳ Báo cáo tổng quan

---

## Phase 3 — Frontend cơ bản (Tuần 6–8)

- ⏳ Setup React + routing
- ⏳ Áp dụng design system (CSS variables từ StyleGuide)
- ⏳ Layout chung: Navbar, Footer
- ⏳ Trang chủ — Hero section + danh sách sự kiện nổi bật
- ⏳ Trang danh sách sự kiện + bộ lọc
- ⏳ Trang chi tiết sự kiện
- ⏳ Trang đăng nhập / đăng ký
- ⏳ Trang hồ sơ cá nhân + lịch sử vé

---

## Phase 4 — Seat Map & Thanh toán (Tuần 9–11)

- ⏳ Thiết kế seat map SVG tương tác
- ⏳ Logic chọn ghế: click → selected → lock API
- ⏳ Hiển thị tooltip khi hover ghế
- ⏳ Real-time cập nhật ghế đã bán (polling hoặc WebSocket)
- ⏳ Trang thanh toán — tổng kết đơn hàng
- ⏳ Tích hợp VNPay sandbox
- ⏳ Màn hình xác nhận đặt vé thành công
- ⏳ Gửi email vé (QR code)

---

## Phase 5 — Dashboard (Tuần 12–13)

### Organizer Dashboard
- ⏳ Trang quản lý sự kiện của tôi
- ⏳ Tạo sự kiện + thiết kế seat map
- ⏳ Thống kê: vé đã bán, doanh thu, ghế còn trống
- ⏳ Xuất danh sách người tham dự (CSV)

### Admin Dashboard
- ⏳ Quản lý tài khoản người dùng
- ⏳ Danh sách sự kiện chờ duyệt
- ⏳ Báo cáo tổng quan hệ thống

---

## Phase 6 — Hoàn thiện (Tuần 14–15)

- ⏳ Test toàn bộ flow: đăng ký → đặt vé → nhận vé
- ⏳ Tối ưu performance (lazy load, image optimization)
- ⏳ Responsive test: mobile / tablet / desktop
- ⏳ Xử lý edge case và lỗi
- ⏳ Viết báo cáo chuyên đề
- ⏳ Chuẩn bị slide bảo vệ
- ⏳ Deploy lên server (nếu cần demo thực tế)

---

## Ghi chú

- Khi bắt đầu một task mới, đổi trạng thái → 🔄
- Khi hoàn thành, đổi → ✅ và ghi ngày hoàn thành
- Các task bị block → ghi rõ lý do ở dưới task đó