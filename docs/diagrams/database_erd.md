# 🗄️ Mô Hình Dữ Liệu ERD - Dự án JoyB Platform

Dựa vào sơ đồ database mẫu, đây là **Mô Hình Dữ Liệu ERD (Entity Relationship Diagram)** được viết lại hoàn toàn bằng mã **PlantUML**. Mã này sẽ render ra các hộp Entity chia vạch rõ ràng giữa Primary Keys, Foreign Keys và các trường dữ liệu phụ giống hệt với nét vẽ của phần mềm database chuyên nghiệp!

```plantuml
@startuml
hide circle
skinparam linetype ortho
skinparam roundCorner 5

' --- STYLING MACROS ---
skinparam entity {
    BackgroundColor white
    BorderColor #1f4f82
    HeaderBackgroundColor #f0f4f8
    FontColor black
}

' =================================
' ENTITIES DEFINITION
' =================================

entity "VAITRO" {
  * **MA_VAITRO** : string <<PK>>
  --
  TEN_VAITRO : string
}

entity "TAIKHOAN" {
  * **MA_TAIKHOAN** : string <<PK>>
  --
  EMAIL : string
  MATKHAU : string
  ~ MA_VAITRO : string <<FK>>
  TRANG_THAI : string
  NGAY_TAO : datetime
}

entity "NGUOIDUNG" {
  * **MA_NGUOIDUNG** : string <<PK>>
  --
  HOTEN : string
  SODIENTHOAI : string
  HINH_ANH : string
  ~ MA_TAIKHOAN : string <<FK>>
}

entity "BANTOCHUC" {
  * **MA_BTC** : string <<PK>>
  --
  TEN_CONGTY : string
  THONGTIN_LIENHE : string
  TRANGTHAI_XACMINH : string
  ~ MA_TAIKHOAN : string <<FK>>
}

entity "SUKIEN" {
  * **MA_SUKIEN** : string <<PK>>
  --
  TEN_SUKIEN : string
  THOI_GIAN : datetime
  DIA_DIEM : string
  TRANG_THAI : string
  ~ MA_BTC : string <<FK>>
}

entity "HANGVE" {
  * **MA_HANGVE** : string <<PK>>
  --
  TEN_HANGVE : string
  GIA_VE : float
  TONG_SO_VE : int
  ~ MA_SUKIEN : string <<FK>>
}

entity "KHUVUC_GHE" {
  * **MA_KHUVUC** : string <<PK>>
  --
  TEN_KHUVUC : string
  SO_HANG : int
  SOGHE_MOIHANG : int
  ~ MA_SUKIEN : string <<FK>>
  ~ MA_HANGVE : string <<FK>>
}

entity "GHE" {
  * **MA_GHE** : string <<PK>>
  --
  HANG : string
  COT : int
  TRANG_THAI : string (Available/Locked/Sold)
  ~ MA_KHUVUC : string <<FK>>
}

entity "DONHANG" {
  * **MA_DONHANG** : string <<PK>>
  --
  NGAY_DAT : datetime
  TONG_TIEN : float
  TRANG_THAI : string
  ~ MA_TAIKHOAN : string <<FK>>
  ~ MA_PTTT : string <<FK>>
  ~ MA_GIAMGIA : string <<FK>>
}

entity "VE_CHITIET" {
  * **MA_VE** : string <<PK>>
  --
  GIA_MUA : float
  TRANGTHAI_CHECKIN : boolean
  ~ MA_DONHANG : string <<FK>>
  ~ MA_HANGVE : string <<FK>>
  ~ MA_GHE : string <<FK>>
}

entity "PHUONGTHUC_TT" {
  * **MA_PTTT** : string <<PK>>
  --
  TEN_PHUONGTHUC : string
}

entity "MAGIAMGIA" {
  * **MA_GIAMGIA** : string <<PK>>
  --
  MA_CODE : string
  GIATRI : float
  HSD : datetime
}

entity "GIOHANG_GIUGHE" {
  * **MA_GIUGHE** : string <<PK>>
  --
  THOIGIAN_HETHAN : datetime
  ~ MA_TAIKHOAN : string <<FK>>
}

entity "CHITIET_GIUGHE" {
  * **MA_GHE** : string <<PK/FK>>
  * **MA_GIUGHE** : string <<PK/FK>>
}

' =================================
' RELATIONSHIPS & CARDINALITY
' =================================

VAITRO ||--o{ TAIKHOAN : "1 có nhiều >"
TAIKHOAN ||--|| NGUOIDUNG : "1 có 1 >"
TAIKHOAN ||--o| BANTOCHUC : "1 có 1 hoặc 0 >"

BANTOCHUC ||--o{ SUKIEN : "1 tổ chức nhiều >"
SUKIEN ||--|{ HANGVE : "1 có >"
SUKIEN ||--o{ KHUVUC_GHE : "1 chia thành >"
HANGVE ||--o{ KHUVUC_GHE : "1 cấp phát >"
KHUVUC_GHE ||--|{ GHE : "1 chứa nhiều >"

TAIKHOAN ||--o{ DONHANG : "1 đặt nhiều >"
DONHANG ||--|{ VE_CHITIET : "1 gồm nhiều >"
HANGVE ||--o{ VE_CHITIET : "tham chiếu tới >"
GHE ||--o| VE_CHITIET : "1 ghế trên 1 vé >"

PHUONGTHUC_TT ||--o{ DONHANG : "thanh toán cho >"
MAGIAMGIA |o--o{ DONHANG : "áp dụng cho >"

TAIKHOAN ||--o{ GIOHANG_GIUGHE : "1 tạo nhiều >"
GIOHANG_GIUGHE ||--|{ CHITIET_GIUGHE : "1 chứa nhiều >"
GHE ||--o{ CHITIET_GIUGHE : "khóa bởi >"

@enduml
```

### 💡 Ghi chú ký hiệu:
* Ký hiệu `*`: Thể hiện trường bắt buộc (Not Null).
* Ký hiệu `<<PK>>`: Primary Key (Khóa chính).
* Ký hiệu `<<FK>>`: Foreign Key (Khóa ngoại). `~` chỉ tính chất Protected/Internal trong biểu diễn lớp, thường dùng ám chỉ field tham chiếu.
* Nửa trên của hộp chứa Khóa chính, nửa dưới ngăn cách bằng rạch ngang `--` chứa các data phụ.
* Layout lưới trực giao (`linetype ortho`) giúp các đường mũi tên liên kết vuông vắn nhất.
