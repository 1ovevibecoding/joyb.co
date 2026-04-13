# Project Overview – JoyB.VN
*Phiên bản: 2.0 | Cập nhật: 06/04/2026*

---

## 1. Tổng quan dự án

**JoyB.VN** là nền tảng trung gian quản lý và phân phối vé sự kiện End-to-End (concert, music festival, nhạc kịch, workshop, thể thao) hiện đại tại Việt Nam. Hệ thống kết nối trực tiếp **Ban tổ chức (Organizer)** và **Khán giả (Customer)** thông qua công nghệ sơ đồ ghế tương tác thời gian thực, với quy trình kiểm duyệt hai cấp và cơ chế giữ chỗ chống tranh chấp.

### Vấn đề thực tế cần giải quyết

| Vấn đề | Hiện trạng | Giải pháp JoyB.VN |
|---|---|---|
| Seat map kém | Chỉ chọn zone, không chọn ghế cụ thể | True Interactive Seat Map (Seats.io) |
| Organizer gặp khó | Quy trình tạo sự kiện phức tạp, không hướng dẫn | Wizard 4 bước chuẩn hóa |
| Tranh chấp ghế | Không có cơ chế giữ chỗ khi thanh toán | Hold-Seat 600 giây + race condition lock |
| Thiếu kiểm duyệt | Sự kiện fake, nội dung kém chất lượng | Admin Approval Gate 2 cấp |
| UX lỗi thời | Giao diện đơn điệu, không responsive | Motion Aesthetics – Dark Mode + Framer Motion |

---

## 2. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  React.js + Vite │ Tailwind CSS │ Framer Motion          │
│  React Router DOM │ Context API (Auth + Cart)            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST API
┌────────────────────────▼────────────────────────────────┐
│                     API LAYER (Backend)                  │
│  Node.js + TypeScript │ Express.js                       │
│  JWT Auth Middleware │ Regex Validator │ Rate Limiter     │
│  Controller → Service → Repository (Prisma ORM)         │
└──────┬─────────────────┬───────────────┬────────────────┘
       │                 │               │
┌──────▼──────┐  ┌───────▼──────┐  ┌────▼────────────────┐
│   MySQL 8.0 │  │  Seats.io    │  │  Third-party        │
│   (ACID)    │  │  API + SDK   │  │  VNPay / MoMo       │
│   Prisma    │  │  Real-time   │  │  Nodemailer (SMTP)  │
└─────────────┘  └──────────────┘  └─────────────────────┘
```

### Nguyên tắc kiến trúc
- **Separation of Concerns**: Frontend và Backend hoàn toàn độc lập, giao tiếp qua RESTful API
- **Stateless Auth**: JWT – không lưu session trên server
- **Independent Seat Map**: Mỗi sự kiện có `chart_key` và `event_key` riêng trên Seats.io – không sự kiện nào dùng chung sơ đồ
- **ACID Transactions**: Mọi giao dịch tài chính đảm bảo tính toàn vẹn qua MySQL InnoDB

---

## 3. Các vai trò người dùng (Actors)

### 3.1 Khách hàng (Customer)
- Tìm kiếm & lọc sự kiện (thể loại, ngày, địa điểm, giá)
- Xem sơ đồ ghế tương tác 2D, chọn ghế cụ thể
- Checkout với Hold-Seat 10 phút + thanh toán đa phương thức
- Nhận vé điện tử QR Code qua email
- Xem lịch sử đặt vé, yêu cầu hóa đơn VAT
- Tương tác với AI Chatbot hỗ trợ

### 3.2 Ban tổ chức (Organizer)
- Đăng ký tài khoản + xác minh thông tin doanh nghiệp
- Tạo sự kiện theo wizard 4 bước chuẩn hóa
- Quản lý Ticket Tiers (tên, giá, màu sắc, số lượng)
- Thiết lập sơ đồ ghế độc lập qua Seats.io
- Gửi sự kiện chờ duyệt, theo dõi trạng thái
- Xem báo cáo doanh thu & tình trạng bán vé real-time

### 3.3 Quản trị viên (Admin)
- Phê duyệt / từ chối đăng ký Organizer
- Kiểm duyệt & phê duyệt nội dung sự kiện (PENDING → APPROVED)
- Quản lý toàn bộ người dùng, khoá tài khoản vi phạm
- Xem Dashboard tổng quan: doanh thu, giao dịch, tăng trưởng
- Phát hiện gian lận thương mại, xử lý tranh chấp

---

## 4. Workflow chi tiết

### Giai đoạn 1 – Tạo & Kiểm duyệt sự kiện

```
Organizer đăng ký
      │
      ▼
Admin duyệt tài khoản Organizer
      │
      ▼
Organizer tạo sự kiện (4 bước)
  Bước 1: Basic Info  →  Tên, thể loại, banner, mô tả
  Bước 2: Time & Venue →  Ngày giờ, địa điểm, sức chứa
  Bước 3: Ticket Tiers →  Hạng vé, giá, màu, số lượng
  Bước 4: Seat Map     →  Clone chart từ Seats.io → chart_key độc lập
      │
      ▼
Event.status = PENDING
      │
      ▼
Admin kiểm duyệt nội dung & pháp lý
      │
   ┌──┴──┐
APPROVED  REJECTED
   │          │
Published  Thông báo lý do từ chối
```

### Giai đoạn 2 – Mua vé (Customer Flow)

```
Customer lướt trang chủ / tìm kiếm
      │
      ▼
Vào trang Event Detail
  └── Seats.io render sơ đồ ghế 2D
  └── Hiển thị: Available / Reserved / Sold (real-time)
      │
Customer chọn ghế → Click ghế trên sơ đồ
      │
      ▼
Nhấn "Tiến hành thanh toán"
      │
      ▼  ← Gọi API: POST /orders/hold
Backend gọi Seats.io API → Hold ghế (600s)
      │
      ▼
Trang Checkout (Countdown Timer: 10:00)
  ├── Điền: Họ tên, Email (Regex), SĐT (Regex)
  ├── Tùy chọn: Thông tin hóa đơn VAT
  └── Chọn: VNPay / MoMo / Chuyển khoản
      │
      ▼
Thanh toán thành công
      │
      ▼
  ┌───┴───────────────────────────────┐
  │  Backend xử lý đồng thời:         │
  │  • Seats.io: Mark ghế → SOLD      │
  │  • DB: Tạo Order + OrderItems     │
  │  • Generate QR Code cho mỗi vé    │
  │  • Gửi email: Vé điện tử + PDF   │
  └───────────────────────────────────┘

[Timeout 10 phút] → API tự động Release Hold → Ghế về Available
```

---

## 5. Tính năng chi tiết

### 5.1 Interactive Seat Map (Seats.io)
- Render mặt bằng 2D phức tạp: hàng ghế thẳng, cong, khu vực GA (đứng)
- Trạng thái ghế real-time: `available` / `held` / `reserved` / `sold`
- Mỗi sự kiện có `seats_io_chart_key` + `seats_io_event_key` riêng biệt
- Màu sắc ghế theo Ticket Tier (VD: đỏ = VVIP, vàng = VIP, xanh = GA)
- Tooltip khi hover: tên ghế, hạng vé, giá tiền

### 5.2 Hold-Seat Mechanism
- Khi Customer vào Checkout: Backend gọi `POST /seats/hold` tới Seats.io
- Ghế chuyển trạng thái `held` – không ai khác có thể chọn
- Timer đếm ngược 600 giây hiển thị trực quan trên UI
- Nếu hết giờ: `POST /seats/release` → ghế về `available`
- Nếu thanh toán thành công: `POST /seats/book` → ghế về `sold`
- **Race condition protection**: MySQL row-level locking (InnoDB) ngăn 2 request đồng thời hold cùng ghế

### 5.3 Module Tạo sự kiện 4 bước (Organizer Wizard)
| Bước | Tên | Nội dung |
|---|---|---|
| 1 | Basic Info | Tên sự kiện, thể loại (Enum), upload banner, mô tả rich text |
| 2 | Time & Venue | DateTime picker, địa chỉ autocomplete, múi giờ UTC+7 |
| 3 | Ticket Tiers | Thêm/sửa/xóa hạng vé: tên, giá (VNĐ), màu hex, tổng số lượng |
| 4 | Seat Map | Tự động clone base chart Seats.io → sinh `chart_key` độc lập |

Progress bar wizard + validation từng bước trước khi cho phép chuyển tiếp.

### 5.4 Admin Approval Gate
- Event list với filter theo trạng thái: `DRAFT` / `PENDING` / `APPROVED` / `REJECTED`
- Review panel: xem đầy đủ nội dung, preview sơ đồ ghế, thông tin Organizer
- Double-confirm dialog trước khi Approve/Reject
- Gửi notification email tới Organizer sau mỗi quyết định

### 5.5 Strict Data Validation (Checkout)
```
Email:    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
SĐT VN:  /^(0[3|5|7|8|9])+([0-9]{8})$/   ← Đúng đầu số mạng VN, 10 ký tự
Họ tên:  Tối thiểu 2 từ, không chứa số/ký tự đặc biệt
MST:     /^[0-9]{10}(-[0-9]{3})?$/        ← Chuẩn mã số thuế VN
```
Real-time inline validation – hiển thị lỗi ngay khi user blur khỏi field.

### 5.6 Hóa đơn VAT tích hợp
- Tùy chọn tại bước Checkout: toggle "Xuất hóa đơn VAT"
- Khai báo: Tên công ty, Mã số thuế, Địa chỉ, Email nhận hóa đơn
- Dữ liệu lưu dưới dạng JSON trong cột `invoice_info` của bảng `Order`
- Organizer có thể export danh sách hóa đơn ra Excel/PDF

### 5.7 AI Chatbot hỗ trợ (Client-side NLP)
10 kịch bản hỗ trợ được lập trình sẵn, xử lý offline hoàn toàn:

| # | Kịch bản | Ví dụ câu hỏi |
|---|---|---|
| 1 | Hướng dẫn mua vé | "Làm sao mua vé?", "Cách đặt chỗ" |
| 2 | Cổng thanh toán | "Thanh toán bằng gì?", "Có MoMo không?" |
| 3 | Nhận vé | "Vé gửi về đâu?", "Chưa nhận được vé" |
| 4 | Hoàn/huỷ vé | "Hủy vé được không?", "Chính sách hoàn tiền" |
| 5 | Lỗi thanh toán | "Bị lỗi khi thanh toán", "Tiền bị trừ nhưng không có vé" |
| 6 | Đăng ký Organizer | "Muốn bán vé sự kiện của mình" |
| 7 | Thông tin ghế | "Ghế A1 là ghế nào?", "Khu VIP ở đâu?" |
| 8 | Hóa đơn VAT | "Xuất hóa đơn đỏ được không?" |
| 9 | Tài khoản | "Quên mật khẩu", "Đổi email" |
| 10 | Liên hệ BTC | "Liên hệ ban tổ chức" |

Matching theo keyword + Levenshtein distance → fallback "Liên hệ hỗ trợ" nếu không khớp.

### 5.8 ✨ Tính năng bổ sung (Nâng cấp v2.0)

#### Personalized Event Carousel
- Thuật toán gợi ý dựa trên: thể loại đã xem, lịch sử mua vé, khu vực địa lý
- Carousel "Dành riêng cho bạn" trên trang chủ
- Phân loại thêm: Sự kiện sắp diễn ra, Đang hot, Gần bạn

#### Waitlist System (Danh sách chờ)
- Khi sự kiện sold-out, Customer có thể đăng ký Waitlist
- Khi có vé bị hoàn/huỷ: tự động notify email theo thứ tự đăng ký
- Waitlist slot có timeout 30 phút để Customer quyết định mua

#### Multi-date Event Support
- Hỗ trợ sự kiện diễn ra nhiều ngày (VD: Festival 3 ngày)
- Customer chọn ngày cụ thể muốn tham dự
- Seat map và ticket inventory độc lập theo từng ngày/suất diễn

#### Organizer Analytics Dashboard
- Biểu đồ doanh thu realtime theo ngày/tuần/tháng (Recharts)
- Heatmap tỷ lệ lấp đầy ghế theo khu vực
- Funnel chuyển đổi: Lượt xem → Chọn ghế → Checkout → Hoàn tất
- Export báo cáo PDF/Excel cho kế toán

#### QR Code Gate Scanner
- App web PWA dành cho nhân viên soát vé tại cửa
- Quét QR bằng camera điện thoại → xác minh tính hợp lệ tức thì
- Đánh dấu vé đã sử dụng (status: `USED`) → ngăn dùng lại
- Hoạt động offline với sync khi có mạng

---

## 6. Thiết kế Cơ sở Dữ liệu

### Schema chi tiết

#### Bảng `users`
```sql
id            INT           PK AUTO_INCREMENT
name          VARCHAR(100)  NOT NULL
email         VARCHAR(150)  UNIQUE NOT NULL
password_hash VARCHAR(255)  NOT NULL  -- Bcrypt
role          ENUM('CUSTOMER','ORGANIZER','ADMIN')  DEFAULT 'CUSTOMER'
status        ENUM('ACTIVE','SUSPENDED')  DEFAULT 'ACTIVE'
avatar_url    VARCHAR(500)
coins         DECIMAL(15,2) DEFAULT 0
created_at    TIMESTAMP     DEFAULT NOW()
updated_at    TIMESTAMP     ON UPDATE NOW()
```

#### Bảng `events`
```sql
id                   INT           PK AUTO_INCREMENT
organizer_id         INT           FK → users.id
ten_show             VARCHAR(255)  NOT NULL
the_loai             ENUM('CONCERT','FESTIVAL','MUSICAL','WORKSHOP','SPORT','OTHER')
mo_ta                TEXT
ngay_gio_bat_dau     DATETIME      NOT NULL
ngay_gio_ket_thuc    DATETIME      NOT NULL
dia_diem             VARCHAR(300)  NOT NULL
suc_chua             INT           -- Tổng sức chứa
anh_banner           VARCHAR(500)
trang_thai           ENUM('DRAFT','PENDING','APPROVED','REJECTED')  DEFAULT 'DRAFT'
seats_io_chart_key   VARCHAR(100)  UNIQUE
seats_io_event_key   VARCHAR(100)  UNIQUE
admin_note           TEXT          -- Ghi chú của Admin khi reject
published_at         TIMESTAMP
created_at           TIMESTAMP     DEFAULT NOW()
```

#### Bảng `ticket_tiers`
```sql
id            INT            PK AUTO_INCREMENT
event_id      INT            FK → events.id
name          VARCHAR(100)   NOT NULL  -- VVIP, VIP, GA
price         DECIMAL(15,2)  NOT NULL
color         VARCHAR(10)    NOT NULL  -- Hex color #RRGGBB
total_amount  INT            NOT NULL
sold_amount   INT            DEFAULT 0
held_amount   INT            DEFAULT 0  -- Đang trong trạng thái held
description   TEXT
```

#### Bảng `orders`
```sql
id              INT            PK AUTO_INCREMENT
user_id         INT            FK → users.id
event_id        INT            FK → events.id
total_amount    DECIMAL(15,2)  NOT NULL
status          ENUM('PENDING','PAID','CANCELLED','REFUNDED')
payment_method  ENUM('VNPAY','MOMO','BANK_TRANSFER','CREDIT_CARD')
payment_ref     VARCHAR(200)   -- Mã giao dịch từ cổng thanh toán
invoice_info    JSON           -- {company, tax_code, address, email}
hold_expires_at TIMESTAMP      -- Thời điểm hết hạn giữ chỗ
paid_at         TIMESTAMP
created_at      TIMESTAMP      DEFAULT NOW()
```

#### Bảng `order_items`
```sql
id               INT            PK AUTO_INCREMENT
order_id         INT            FK → orders.id
ticket_tier_id   INT            FK → ticket_tiers.id
seat_id_string   VARCHAR(50)    NOT NULL  -- "SEC-A-ROW1-5"
price            DECIMAL(15,2)  NOT NULL  -- Snapshot giá tại thời điểm mua
qr_code_data     TEXT           -- Dữ liệu QR (JWT signed)
status           ENUM('ACTIVE','USED','CANCELLED')  DEFAULT 'ACTIVE'
used_at          TIMESTAMP      -- Thời điểm soát vé
```

#### Bảng `waitlists` *(Tính năng mới)*
```sql
id          INT        PK AUTO_INCREMENT
user_id     INT        FK → users.id
event_id    INT        FK → events.id
tier_id     INT        FK → ticket_tiers.id
position    INT        NOT NULL  -- Vị trí trong hàng đợi
status      ENUM('WAITING','NOTIFIED','EXPIRED','CONVERTED')
notified_at TIMESTAMP
expires_at  TIMESTAMP
created_at  TIMESTAMP  DEFAULT NOW()
```

### Sơ đồ quan hệ (tóm tắt)
```
users ──< events          (1 Organizer tạo nhiều Event)
users ──< orders          (1 Customer có nhiều Order)
events ──< ticket_tiers   (1 Event có nhiều Tier)
events ──< orders         (1 Event có nhiều Order)
orders ──< order_items    (1 Order có nhiều Item)
ticket_tiers ──< order_items
events ──< waitlists      (1 Event có Waitlist)
users ──< waitlists
```

---

## 7. API Endpoints chính

### Auth
```
POST   /api/auth/register          Đăng ký tài khoản
POST   /api/auth/login             Đăng nhập → trả JWT
POST   /api/auth/refresh           Refresh access token
GET    /api/auth/me                Lấy thông tin user hiện tại
```

### Events (Public)
```
GET    /api/events                 Danh sách sự kiện (filter, sort, paginate)
GET    /api/events/:id             Chi tiết sự kiện
GET    /api/events/:id/seat-map    Lấy seats.io event key để render map
```

### Events (Organizer)
```
POST   /api/organizer/events                   Tạo sự kiện mới
PUT    /api/organizer/events/:id               Cập nhật sự kiện
POST   /api/organizer/events/:id/submit        Gửi duyệt (DRAFT → PENDING)
GET    /api/organizer/events/:id/analytics     Báo cáo doanh thu
POST   /api/organizer/events/:id/ticket-tiers  Tạo hạng vé
```

### Orders (Customer)
```
POST   /api/orders/hold            Giữ chỗ + tạo order PENDING
POST   /api/orders/:id/pay         Xác nhận thanh toán
POST   /api/orders/:id/cancel      Huỷ order → release hold
GET    /api/orders/my              Lịch sử đặt vé của tôi
GET    /api/orders/:id/tickets     Lấy vé điện tử (QR)
```

### Admin
```
GET    /api/admin/events/pending   Danh sách sự kiện chờ duyệt
POST   /api/admin/events/:id/approve
POST   /api/admin/events/:id/reject
GET    /api/admin/users            Quản lý người dùng
POST   /api/admin/users/:id/suspend
GET    /api/admin/stats/overview   Thống kê tổng quan
```

### Waitlist *(Tính năng mới)*
```
POST   /api/events/:id/waitlist    Đăng ký chờ vé
DELETE /api/events/:id/waitlist    Huỷ đăng ký chờ
GET    /api/events/:id/waitlist/position  Xem vị trí trong hàng đợi
```

---

## 8. Stack công nghệ

### Frontend
| Công nghệ | Mục đích |
|---|---|
| React.js 18 + Vite | UI framework + build tool (HMR cực nhanh) |
| TypeScript | Type safety toàn bộ frontend |
| Tailwind CSS | Utility-first styling, Dark Mode |
| Framer Motion | Page transitions, micro-interactions |
| React Router DOM v6 | Client-side routing (SPA) |
| Context API + useReducer | Global state (Auth, Cart) |
| @seatsio/seatsio-react | React SDK render sơ đồ ghế |
| Recharts | Biểu đồ analytics Organizer |
| React Hook Form + Zod | Form validation schema-based |

### Backend
| Công nghệ | Mục đích |
|---|---|
| Node.js 20 + TypeScript | Runtime + type safety |
| Express.js | HTTP framework, routing |
| Prisma ORM 5 | Type-safe database access, migrations |
| MySQL 8.0 (InnoDB) | Relational DB, ACID transactions |
| JWT (jsonwebtoken) | Stateless authentication |
| Bcrypt | Password hashing (cost factor 12) |
| Nodemailer | Gửi email vé điện tử, thông báo |
| node-cron | Scheduled job: tự động release expired holds |
| Multer + Cloudinary | Upload & lưu trữ ảnh banner |

### Third-party Services
| Dịch vụ | Mục đích |
|---|---|
| **Seats.io** | Interactive seat map engine |
| **VNPay / MoMo** | Cổng thanh toán nội địa |
| **Cloudinary** | CDN lưu trữ ảnh |
| **SMTP (Gmail / SendGrid)** | Gửi email tự động |

---

## 9. Bảo mật hệ thống

| Lớp bảo mật | Giải pháp |
|---|---|
| Mật khẩu | Bcrypt hash (cost 12) – không lưu plaintext |
| Xác thực | JWT Access Token (15 phút) + Refresh Token (7 ngày) |
| Phân quyền | Role-based middleware: CUSTOMER / ORGANIZER / ADMIN |
| Dữ liệu đầu vào | Zod schema validation + Regex kiểm tra format |
| SQL Injection | Prisma parameterized queries – không raw SQL |
| Rate Limiting | express-rate-limit: 100 req/15 phút per IP |
| HTTPS | TLS/SSL bắt buộc toàn bộ endpoint |
| QR Code | Mỗi vé là JWT signed với secret riêng – không thể giả mạo |

---

## 10. Trạng thái hệ thống (State Machine)

### Event States
```
DRAFT ──(submit)──→ PENDING ──(approve)──→ APPROVED
                        │
                    (reject)
                        │
                        ▼
                    REJECTED ──(resubmit)──→ PENDING
```

### Order States
```
PENDING ──(pay success)──→ PAID ──(gate scan)──→ [USED per ticket]
   │
(cancel / timeout)
   │
   ▼
CANCELLED
   │
(refund processed)
   │
   ▼
REFUNDED
```

### Seat States (Seats.io)
```
available ──(hold)──→ held ──(book)──→ reserved/sold
              │
          (release / timeout)
              │
              ▼
          available
```

---

## 11. Điểm khác biệt cạnh tranh (USP)

1. **True Absolute Seat Mapping**: Không bán vé "khu vực" – mọi vé gắn với ghế vật lý cụ thể, chart_key độc lập mỗi sự kiện
2. **Zero Race Condition**: Hold-Seat + MySQL row-level lock ngăn hoàn toàn tình trạng 2 người mua cùng ghế
3. **Organizer Self-Service**: Wizard 4 bước cho phép Organizer nhỏ tự tạo sự kiện chuyên nghiệp mà không cần hỗ trợ kỹ thuật
4. **Motion-First UX**: Framer Motion animation xuyên suốt – trải nghiệm ngang tầm app thương mại toàn cầu
5. **VAT-Ready Pipeline**: Hóa đơn đỏ tích hợp ngay trong Checkout – sẵn sàng cho doanh nghiệp B2B

---

*Tài liệu này được dùng làm nền tảng cho báo cáo chuyên đề và tài liệu kỹ thuật của dự án JoyB.VN.*
