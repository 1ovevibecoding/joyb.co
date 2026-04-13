# ✨ Sơ đồ Use Case hệ thống JoyB Platform 

Dưới đây là phiên bản **Sơ đồ Use Case** được viết bằng mã **PlantUML** chuẩn, hỗ trợ vẽ chính xác vòng elip (oval) Use case cùng nét đứt `<<include>>`, `<<extend>>` tương tự như Astah/phần mềm mà bạn chụp.

Bạn có thể render đoạn mã `plantuml` này thông qua các plugin trên VSCode hoặc dán vào trình dịch PlantUML Online để xem biểu đồ siêu chuẩn!

---

### 1. Sơ đồ Use Case Tổng Quát Hệ Thống

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Khách hàng" as USER
actor "Ban tổ chức" as ORG
actor "Quản trị viên" as ADMIN

rectangle "JoyB Platform" {
  usecase "Đăng nhập & Đăng ký" as UC_AUTH
  usecase "Tìm kiếm & Xem Sự Kiện" as UC_SEARCH
  usecase "Đặt Vé & Chọn Ghế" as UC_BUY
  usecase "Tạo & Quản Lý Sự Kiện" as UC_MG_EVENT
  usecase "Quản Trị Hệ Thống" as UC_SYS
  usecase "Báo Cáo Thống Kê" as UC_REPORT
}

USER --> UC_SEARCH
USER --> UC_AUTH
USER --> UC_BUY

ORG --> UC_AUTH
ORG --> UC_MG_EVENT
ORG --> UC_REPORT

ADMIN --> UC_AUTH
ADMIN --> UC_SYS
ADMIN --> UC_REPORT
@enduml
```

---

### 2. Sơ đồ Use Case Phân rã Quản trị viên (Admin)

```plantuml
@startuml
left to right direction

actor "Quản trị viên" as ADMIN

usecase "Quản lý Tài Khoản" as UC_QLTK
usecase "Kiểm duyệt Sự Kiện" as UC_QLSK
usecase "Quản lý Giao Dịch/Đơn hàng" as UC_QLDH
usecase "Báo cáo Thống Kê" as UC_REPORT
usecase "Quản lý Voucher Hệ Thống" as UC_VOUCHER

usecase "Khóa/Mở tài khoản" as UC_BAN
usecase "Duyệt / Từ chối Sự Kiện" as UC_APPROVE
usecase "Thống kê Doanh Thu" as UC_REV

ADMIN --> UC_QLTK
ADMIN --> UC_QLSK
ADMIN --> UC_QLDH
ADMIN --> UC_REPORT
ADMIN --> UC_VOUCHER

UC_QLTK ..> UC_BAN : <<include>>
UC_QLSK ..> UC_APPROVE : <<include>>
UC_REPORT ..> UC_REV : <<include>>
@enduml
```

---

### 3. Sơ đồ Use Case Phân rã Ban tổ chức (Organizer)

```plantuml
@startuml
left to right direction

actor "Ban tổ chức" as ORG

usecase "Tạo Sự kiện Mới" as UC_TAO_SK
usecase "Quản lý Sự Kiện" as UC_EDIT_SK
usecase "Quản lý Sơ đồ Ghế" as UC_SEATMAP
usecase "Check-in Khán Giả" as UC_CHECKIN
usecase "Xem Thống Kê Lượt Bán" as UC_ORG_REPORT
usecase "Quản lý Mã Giảm Giá" as UC_VOUCHER_SK

usecase "Thêm Hạng Vé" as UC_ADD_TIER
usecase "Quét QR Code Vé" as UC_SCAN_QR

ORG --> UC_TAO_SK
ORG --> UC_EDIT_SK
ORG --> UC_SEATMAP
ORG --> UC_CHECKIN
ORG --> UC_ORG_REPORT
ORG --> UC_VOUCHER_SK

UC_EDIT_SK ..> UC_ADD_TIER : <<include>>
UC_CHECKIN ..> UC_SCAN_QR : <<include>>
@enduml
```

---

### 4. Sơ đồ Use Case Phân rã Khách hàng (Customer)

```plantuml
@startuml
left to right direction

actor "Khách hàng" as USER

usecase "Quản lý Thông Tin Cá Nhân" as UC_PROFILE
usecase "Xem Chi Tiết Sự Kiện" as UC_VIEW
usecase "Thao Tác Đặt Vé" as UC_BOOK
usecase "Xem Lịch Sử Đơn Hàng" as UC_HISTORY
usecase "Quản Lý Vé Điện Tử" as UC_E_TICKET

usecase "Cập nhật Profile" as UC_EDIT_INFO
usecase "Chọn Ghế Tương Tác" as UC_SELECT_SEAT
usecase "Thanh toán Đơn Hàng" as UC_CHECKOUT
usecase "Áp dụng Voucher" as UC_APPLY_VOUCHER

USER --> UC_PROFILE
USER --> UC_VIEW
USER --> UC_BOOK
USER --> UC_HISTORY
USER --> UC_E_TICKET

UC_PROFILE ..> UC_EDIT_INFO : <<include>>

UC_BOOK ..> UC_SELECT_SEAT : <<include>>
UC_BOOK ..> UC_CHECKOUT : <<include>>
UC_CHECKOUT <.. UC_APPLY_VOUCHER : <<extend>>
@enduml
```
