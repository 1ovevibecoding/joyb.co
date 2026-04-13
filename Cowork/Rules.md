# Rules — Quy tắc làm việc dự án JoyB.VN

> Tất cả output của Claude phải tuân thủ các quy tắc này xuyên suốt dự án.

---

## 1. Quy tắc code

### Chung
- Luôn dùng `const` / `let`, **không dùng** `var`
- Arrow function cho callback và utility: `const fn = () => {}`
- Tên biến, hàm phải **có ý nghĩa**, không viết tắt mơ hồ (`data`, `x`, `tmp` → không dùng)
- Mỗi hàm chỉ làm **một việc** (Single Responsibility)
- Không để code thừa, không có `console.log` debug khi nộp

### Comment
- Comment tiếng Việt, rõ ràng, **đặt trước hàm hoặc đoạn logic quan trọng**
- Không comment quá rõ những thứ hiển nhiên
- Mỗi file bắt đầu bằng block comment mô tả mục đích file

```js
/**
 * eventService.js
 * Xử lý các logic liên quan đến sự kiện: tạo, cập nhật, lấy danh sách
 */
```

### Cấu trúc thư mục (Frontend)
```
src/
  components/     # UI components tái sử dụng
  pages/          # Các trang chính
  services/       # Gọi API
  hooks/          # Custom React hooks
  utils/          # Hàm tiện ích
  styles/         # CSS / SCSS global
  assets/         # Hình ảnh, icon
```

### Cấu trúc thư mục (Backend)
```
src/
  routes/         # Định nghĩa endpoint
  controllers/    # Xử lý request
  services/       # Business logic
  models/         # Database models
  middleware/     # Auth, validation, error handler
  utils/          # Helper functions
```

---

## 2. Quy tắc API

- REST API, endpoint dạng: `GET /api/events`, `POST /api/tickets`
- Response luôn có cấu trúc chuẩn:
```json
{
  "success": true,
  "data": {},
  "message": "Thành công"
}
```
- Lỗi phải trả về HTTP status code đúng (400, 401, 403, 404, 500)
- Không trả raw error của server ra client

---

## 3. Quy tắc database

- Tên bảng: số nhiều, snake_case (`events`, `ticket_orders`, `seat_maps`)
- Khóa ngoại rõ ràng, có index trên cột tìm kiếm thường xuyên
- Mỗi bảng có: `created_at`, `updated_at`
- Soft delete nếu dữ liệu quan trọng (thêm cột `deleted_at`)

---

## 4. Quy tắc giao diện

- Responsive mobile-first — test trên 375px, 768px, 1280px
- Mọi button/link phải có hover state rõ ràng
- Loading state cho mọi action gọi API
- Empty state cho danh sách rỗng
- Error state hiển thị thông báo thân thiện (không để lỗi kỹ thuật hiện ra)

---

## 5. Quy tắc với Antigravity

- Nếu yêu cầu không rõ → hỏi lại trước khi code
- Mỗi đoạn code dài hơn 30 dòng phải có giải thích ngắn
- Khi có nhiều cách giải quyết → trình bày 2–3 phương án và nêu lý do chọn
- Không rút gọn code bằng `// ... rest of code` — luôn viết đầy đủ
- Giữ nhất quán với code đã viết trước trong cùng dự án