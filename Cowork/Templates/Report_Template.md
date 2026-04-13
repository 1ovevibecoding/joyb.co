# Report Template — Chuyên đề tốt nghiệp JoyB.VN

> Template viết báo cáo chuyên đề, đảm bảo đúng cấu trúc học thuật  
> Giọng văn: trang trọng, rõ ràng, tiếng Việt chuẩn  

---

# [TÊN CHUYÊN ĐỀ]
## XÂY DỰNG HỆ THỐNG QUẢN LÝ VÀ BÁN VÉ SỰ KIỆN TRỰC TUYẾN JOYNB.VN

---

**Sinh viên thực hiện:** Huỳnh Anh Tuấn  
**MSSV:** [Mã số sinh viên]  
**Lớp:** [Tên lớp]  
**Giảng viên hướng dẫn:** [Tên GVHD]  
**Trường:** Đại học Văn Hiến — Khoa Công nghệ Thông tin  
**Năm học:** 2024–2025  

---

## MỤC LỤC

1. Mở đầu
2. Tổng quan hệ thống
3. Phân tích yêu cầu
4. Thiết kế hệ thống
5. Cài đặt & Triển khai
6. Kiểm thử
7. Kết luận & Hướng phát triển
8. Tài liệu tham khảo

---

## CHƯƠNG 1: MỞ ĐẦU

### 1.1 Lý do chọn đề tài

[Mô tả bối cảnh, vấn đề thực tế, lý do thực hiện dự án này]

Thị trường sự kiện và giải trí tại Việt Nam đang có sự tăng trưởng mạnh mẽ trong những năm gần đây. Tuy nhiên, các nền tảng bán vé hiện tại vẫn còn nhiều hạn chế về trải nghiệm người dùng, đặc biệt là thiếu tính năng chọn chỗ ngồi trực quan và giao diện hiện đại. Từ thực tế đó, đề tài "Xây dựng hệ thống quản lý và bán vé sự kiện trực tuyến JoyB.VN" được thực hiện nhằm giải quyết những hạn chế còn tồn tại.

### 1.2 Mục tiêu đề tài

- Xây dựng hệ thống bán vé sự kiện trực tuyến hoàn chỉnh, có thể triển khai thực tế
- Phát triển tính năng seat map tương tác cho phép người dùng chọn chỗ ngồi trực quan
- Thiết kế giao diện hiện đại, thân thiện với người dùng trên đa nền tảng
- Ứng dụng các kiến thức lập trình web đã học vào sản phẩm thực tế

### 1.3 Phạm vi nghiên cứu

**Phạm vi về nội dung:**
- Xây dựng các module: Quản lý sự kiện, Đặt vé, Thanh toán, Quản trị hệ thống
- Phát triển tính năng seat map SVG tương tác
- Tích hợp thanh toán trực tuyến (VNPay sandbox)

**Phạm vi về người dùng:**
- Khách hàng (mua vé)
- Ban tổ chức sự kiện (Organizer)
- Quản trị viên hệ thống (Admin)

### 1.4 Phương pháp nghiên cứu

- Nghiên cứu tài liệu: tìm hiểu các hệ thống bán vé hiện có
- Phân tích yêu cầu: xác định nghiệp vụ cần giải quyết
- Thiết kế hệ thống: ERD, kiến trúc phần mềm, giao diện
- Lập trình và kiểm thử: phát triển theo từng giai đoạn, kiểm thử từng module

---

## CHƯƠNG 2: TỔNG QUAN HỆ THỐNG

### 2.1 Giới thiệu hệ thống

[Mô tả tổng quan JoyB.VN là gì, làm được gì]

### 2.2 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| [Tên] | [Version] | [Dùng để làm gì] |
| | | |

### 2.3 Kiến trúc hệ thống

[Mô tả kiến trúc — kèm sơ đồ nếu có]

**Sơ đồ kiến trúc:**
```
[Dán sơ đồ kiến trúc vào đây]
```

---

## CHƯƠNG 3: PHÂN TÍCH YÊU CẦU

### 3.1 Yêu cầu chức năng

#### 3.1.1 Nhóm chức năng dành cho khách hàng
- [Liệt kê use case]

#### 3.1.2 Nhóm chức năng dành cho ban tổ chức
- [Liệt kê use case]

#### 3.1.3 Nhóm chức năng dành cho admin
- [Liệt kê use case]

### 3.2 Yêu cầu phi chức năng

- **Hiệu năng:** Hệ thống phải phản hồi trong vòng 2 giây với 95% request
- **Bảo mật:** Xác thực JWT, mã hóa mật khẩu (bcrypt), chống SQL injection
- **Khả dụng:** Uptime tối thiểu 99% trong giờ cao điểm
- **Tính mở rộng:** Kiến trúc cho phép thêm tính năng mới không ảnh hưởng module cũ
- **Giao diện:** Responsive, hoạt động tốt trên thiết bị di động

### 3.3 Sơ đồ Use Case

[Chèn sơ đồ use case vào đây]

---

## CHƯƠNG 4: THIẾT KẾ HỆ THỐNG

### 4.1 Thiết kế cơ sở dữ liệu

#### 4.1.1 Sơ đồ ERD

[Chèn ERD vào đây]

#### 4.1.2 Mô tả các bảng chính

**Bảng `users`**
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INT PK | Khóa chính |
| email | VARCHAR(255) | Email đăng nhập |
| password | VARCHAR(255) | Mật khẩu đã mã hóa |
| role | ENUM | customer / organizer / admin |
| created_at | TIMESTAMP | Thời điểm tạo |

**Bảng `events`**
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INT PK | Khóa chính |
| organizer_id | INT FK | Khóa ngoại → users |
| title | VARCHAR(255) | Tên sự kiện |
| description | TEXT | Mô tả |
| date_start | DATETIME | Thời gian bắt đầu |
| venue | VARCHAR(255) | Địa điểm |
| status | ENUM | draft / pending / published / cancelled |
| created_at | TIMESTAMP | |

[Thêm các bảng khác...]

### 4.2 Thiết kế API

[Mô tả các endpoint chính, phương thức, request/response mẫu]

### 4.3 Thiết kế giao diện

[Mô tả các màn hình chính, kèm screenshot hoặc wireframe]

---

## CHƯƠNG 5: CÀI ĐẶT & TRIỂN KHAI

### 5.1 Môi trường phát triển

| Phần mềm | Phiên bản |
|---|---|
| Node.js | v20.x |
| MySQL | 8.0 |
| [Khác] | |

### 5.2 Hướng dẫn cài đặt

```bash
# Clone project
git clone [repo-url]

# Cài đặt dependencies
npm install

# Cấu hình biến môi trường
cp .env.example .env
# Điền thông tin vào .env

# Khởi tạo database
npm run db:migrate
npm run db:seed

# Chạy server
npm run dev
```

### 5.3 Cấu hình hệ thống

[Mô tả file .env, các biến cấu hình quan trọng]

### 5.4 Một số chức năng cài đặt tiêu biểu

[Giải thích đoạn code quan trọng — thuật toán, logic phức tạp]

---

## CHƯƠNG 6: KIỂM THỬ

### 6.1 Phương pháp kiểm thử

[Mô tả cách kiểm thử: unit test, integration test, manual test]

### 6.2 Kết quả kiểm thử

| Chức năng | Test case | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|
| Đăng ký | Email hợp lệ | Tài khoản được tạo | Tài khoản được tạo | ✅ Pass |
| Đăng ký | Email đã tồn tại | Thông báo lỗi | Thông báo lỗi | ✅ Pass |
| [Khác] | | | | |

### 6.3 Đánh giá kết quả

[Tổng hợp kết quả kiểm thử, những vấn đề phát sinh và cách xử lý]

---

## CHƯƠNG 7: KẾT LUẬN & HƯỚNG PHÁT TRIỂN

### 7.1 Kết quả đạt được

- [Liệt kê các chức năng đã hoàn thành]
- [Điểm nổi bật của sản phẩm]

### 7.2 Hạn chế

- [Những gì chưa làm được hoặc chưa hoàn thiện]
- [Nguyên nhân]

### 7.3 Hướng phát triển

- [Tính năng có thể thêm trong tương lai]
- [Cải tiến kỹ thuật]

---

## TÀI LIỆU THAM KHẢO

[1] [Tên tài liệu], [Tác giả], [Năm], [Link/NXB]  
[2] [Tên tài liệu], [Tác giả], [Năm], [Link/NXB]  
[3] ...

---

## PHỤ LỤC

### Phụ lục A: Hướng dẫn sử dụng hệ thống

[Hướng dẫn cho từng nhóm người dùng]

### Phụ lục B: Danh sách API

[Liệt kê toàn bộ endpoint]

### Phụ lục C: Script tạo database

```sql
-- Script tạo toàn bộ bảng
[Paste SQL script vào đây]
```