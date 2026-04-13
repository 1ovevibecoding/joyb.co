# Project Specification & Detailed Overview - JoyB.VN

*Cập nhật lần cuối: 06/04/2026*
*Mục đích tài liệu: Cung cấp bản đặc tả chi tiết toàn cảnh về kiến trúc, luồng nghiệp vụ và công nghệ của nền tảng vé sự kiện JoyB.VN phục vụ cho công tác tổng hợp báo cáo và nghiên cứu chuyên đề.*

---

## 1. Giới thiệu dự án & Ý tưởng chính

### 1.1. Bối cảnh và Vấn đề thực tế
Thị trường giải trí, nghệ thuật và sự kiện đang trên đà bùng nổ, kéo theo nhu cầu mua vé tham gia nhạc hội, sự kiện văn hóa, và thể thao ngày càng lớn. Tuy nhiên, các hệ thống phân phối vé truyền thống và một số nền tảng điện tử hiện tại vẫn tồn tại nhiều hạn chế:
- **Hệ thống sơ đồ ghế thiếu tính tương tác:** Phần lớn chỉ cho phép khách hàng mua vé theo "khu vực" (Zone) mà thiếu tính năng chọn chính xác ghế ngồi trực quan (Interactive Seating).
- **Quy trình phân phối của ban tổ chức (Organizer) rườm rà:** Các đơn vị tổ chức nhỏ lẻ gặp khó khăn trong việc tự tạo sự kiện, thiết lập hạng vé và xuất bản sơ đồ chỗ ngồi phức tạp.
- **Tắc nghẽn hệ thống và thao tác thiếu chính xác:** Thiếu cơ chế giữ chỗ (slot-holding) và hệ thống kiểm duyệt giao dịch (validation) lỏng lẻo dễ dẫn đến thất duyệt dữ liệu.

### 1.2. Mục tiêu của JoyB.VN
**JoyB.VN** ra đời với mục tiêu trở thành **nền tảng trung gian quản lý và phân phối vé sự kiện toàn diện (End-to-End Ticketing Platform)**. Hệ thống được thiết kế để kết nối trực tiếp Nhà tổ chức (Organizer) và Khán giả (Customer) thông qua một nền tảng công nghệ linh hoạt, tập trung vào trải nghiệm đặt vé thời gian thực với mô hình sơ đồ phân phối độc lập cho từng sự kiện. 

---

## 2. Các đối tượng người dùng (Actors)

Hệ thống được thiết kế phân quyền nghiêm ngặt với 3 nhóm đối tượng cốt lõi:

1. **Khách hàng (Customer / Client):**
   - Người tiêu dùng cuối cùng sử dụng nền tảng để tìm kiếm sự kiện, xem thông tin chi tiết, tương tác trực tiếp trên sơ đồ ghế để chọn chỗ, điền thủ tục thanh toán, và nhận/lưu trữ vé điện tử (E-ticket/QR Code).

2. **Ban tổ chức (Organizer / Host):**
   - Đơn vị đứng ra tổ chức sự kiện. Tài khoản của Organizer cần phải khai báo thông tin doanh nghiệp/chủ sở hữu.
   - Có toàn quyền kiểm soát vòng đời của sự kiện do mình tổ chức, khởi tạo danh sách hạng vé (Ticket Tiers), kết nối sơ đồ ghế (Seats.io), và theo dõi báo cáo doanh thu theo thời gian thực.

3. **Quản trị viên hệ thống (System Administrator):**
   - Người giám sát toàn bộ hoạt động của nền tảng JoyB.VN.
   - **Nhiệm vụ:** Kiểm duyệt Organizer (phê duyệt hoặc từ chối), hậu kiểm và xét duyệt nội dung các sự kiện tước khi chúng được hiển thị trên hệ thống (publish), phòng chống biểu hiện gian lận thương mại và thống kê số liệu của toàn nền tảng.

---

## 3. Workflow tổng thể của hệ thống

Luồng nghiệp vụ cốt lõi của JoyB.VN tuân thủ quy trình liên kết chặt chẽ từ khi hạt giống ý tưởng sự kiện bắt đầu cho đến khi vé được bán ra:

**Giai đoạn 1: Onboarding và Khởi tạo sự kiện**
1. Doanh nghiệp đăng kí tài khoản `Organizer` trên JoyB.VN.
2. `Organizer` sử dụng module **Tạo sự kiện (Event Creation)** để cập nhật hình ảnh, thông tin và phân khu hạng vé. Điểm cuối quy trình, họ gắn hoặc tạo một bản thiết kế **Sơ đồ đồ hoạ** cho sự kiện.
3. Thông tin sự kiện được chuyển trạng thái sang **Pending (Chờ duyệt)**.

**Giai đoạn 2: Kiểm duyệt và Public mạng lưới**
1. `Admin` tiếp nhận yêu cầu, kiểm tra tính hợp lệ của pháp lý và nội dung mô tả.
2. `Admin` duyệt (Approve) sự kiện. Event chính thức chuyển trạng thái sang **Published** và hiện diện trên trang dành cho khách hàng.

**Giai đoạn 3: Phân phối và Bán lẻ vé (Customer flow)**
1. `Khách hàng` lướt màn hình trang chủ (khám phá qua Carousel "Dành riêng cho bạn" hoặc Tìm kiếm).
2. Khi ấn vào trang **Chi tiết Sự kiện (Event Detail)**, khách hàng có thể đọc thông tin và lựa chọn chỗ ngồi *trực tiếp trên mặt bằng 2D của sơ đồ*.
3. Khách hàng xem Tóm tắt đơn giá (Tier Color, Số tiền) -> Chuyển hướng tới mục **Thanh toán (Checkout)**.
4. Tại bước Checkout: 
   - Kích hoạt **Count-down Timer** (Đếm ngược 10 phút giữ chỗ).
   - Điền thông tin cá nhân (Email, SĐT có Validation Regex cực kỳ khắt khe nhằm tránh rác dữ liệu).
   - Yêu cầu cấp Hóa đơn VAT (Tùy chọn).
5. Khách hàng Thanh toán nội bộ (Bank transfer, Credit, MoMo...).
6. Hệ thống tạo hóa đơn, chuyển ghế về trạng thái **Sold**, gửi E-ticket qua mail. Hoàn tất vòng đời sinh thái phân phối.

---

## 4. Các tính năng chính và Giải pháp kỹ thuật nổi bật

### 4.1. Module Dành cho Organizer: Khởi tạo Sự kiện 4 bước chuẩn hóa
Quy trình được chia thành luồng hướng dẫn từng bước nhằm tránh sai sót:
- **Bước 1 (Basic Info):** Tên show, phân loại sự kiện (Nhạc hội, Nhạc kịch, Workshop...), Upload Banner minh hoạ.
- **Bước 2 (Time & Venue):** Xác lập ngày, giờ bắt đầu và bế mạc sự kiện, Khai báo địa chỉ chính xác.
- **Bước 3 (Ticket Tiers):** Khai báo các loại vé (Ví dụ: VVIP, VIP, GA). Mỗi Tier sẽ yêu cầu giá trị tiền, Số lượng tổng và Tùy chỉnh màu sắc riêng (Color code) định hướng cho sơ đồ.
- **Bước 4 (Khởi tạo Seat Map):** Tách biệt cấu trúc sơ đồ độc lập cho từng sự kiện thông qua mạng lưới tạo Chart tự động. Đứt đoạn hoàn toàn với cơ chế dùng chung sơ đồ (tránh tình trạng các show chung 1 chart).

### 4.2. Tích hợp Sơ đồ ghế tương tác (Interactive Seat Map) với Seats.io
Đây là "trái tim" thao tác hệ thống:
- Sử dụng công nghệ từ **Seats.io** cho phép render mặt sàn sự kiện theo không gian 2D phức tạp (với hình khối đa góc, hàng ghế cong, khu vực đứng (GA)...).
- Hệ thống JoyB backend gọi API tự động sinh trích thẻ đồ hoạ độc quyền (sao chép base chart và cấp `seats_io_chart_key` duy nhất mỗi phiên) đảm bảo **Không sự kiện nào bị dẫm đạp sơ đồ lên nhau**.
- Tích hợp Engine API trả về trạng thái ghế (Available, Selected, Reserved, Sold) thời gian thực. (Xóa bỏ cơ chế Fallback tĩnh DotGrid lạc hậu).

### 4.3. Phê duyệt kiểm soát mạnh (Admin Dashboard Gate)
- Workflow xét duyệt an toàn: Đảm bảo thông tin sạch. Admin bao quát Dashboard: Overview tổng lượng Giao dịch, Hệ thống Users, Tổ chức và phân tích tổng quan qua giao diện Dark Mode Minimalist sang trọng.

### 4.4. Module Check-Out & Xác thực Khắt khe
- **Hold-Seat Mechanism:** Khóa ghế với chu kỳ vòng đời 600 giây (10 phút) tránh việc 2 khách hàng tranh chấp thanh toán cùng 1 chỗ.
- **Strict Data Validation:** Sử dụng Regex cứng để ép buộc Email chuẩn định dạng. Số điện thoại phải đúng tiêu chuẩn mạng (Bắt đầu bằng số 0, đạt độ dài 10 ký tự số chuẩn).
- **Hệ thống hỗ trợ hóa đơn đỏ (VAT):** Cấp quyền cho doanh nghiệp kê khai thông tin Công ty, MST, Địa chỉ trực tiếp tại form.

### 4.5. Phản hồi thông minh AI Chatbot (Offline Fallback)
- Trợ lý vé thông minh nội tuyến với kịch bản phản hồi xử lý tự nhiên: Hỗ trợ cung cấp 10 danh mục tình huống túc trực cho khách: Từ hướng dẫn Mua vé, Cổng thanh toán, Nhận vé, Hoàn huỷ.
- Tái cấu trúc cơ học loại bỏ máy chủ AI ảo, chuyển hướng sang module tĩnh xử lý NLP siêu việt bên trong Client.

---

## 5. Kiến trúc Công nghệ sử dụng

Sự kết hợp công nghệ theo cấu trúc ứng dụng đa lớp (N-Tiered Architecture):

- **Frontend Application:** 
  - **Framework:** `React.js` khởi tạo qua `Vite` nhằm tối ưu cực đại tốc độ đóng gói (HMR).
  - **Styling:** thuần túy `Tailwind CSS`, bổ trợ giao diện Animation động bằng `Framer Motion`. Khai thác Dark Mode chuyên sâu và hiệu ứng Glassmorphism.
  - **Routing & State:** `React Router DOM` quản lý page, `Context API` quản lý Reducer Auth/Coins.
- **Backend Application:**
  - **Runtime & Ngôn ngữ:** `Node.js` + `TypeScript` tạo bộ RESTful API cực kỳ an toàn về kiểu dữ liệu (strongly-typed).
  - **Database ORM:** Sử dụng `Prisma` giúp khai phá ánh xạ cơ sở dữ liệu nhanh, chống SQL Injection tự nhiên.
- **Database System:**
  - `MySQL` - Thiết kế cơ sở dữ liệu quan hệ, bám chặt tính ràng buộc toàn vẹn (ACID) tài chính.
- **Third-Party Services Ecosystem:**
  - `Seats.io` Ecosystem: API và React SDK để render sơ đồ đa chiều thời gian thực.
  - Xử lý mã hóa: `Bcrypt` (nhúng mã hóa cực bộ hàm băm mật khẩu), `JSON Web Token (JWT)`.

---

## 6. Mô hình Cơ sở Dữ liệu chính (Core Database Schemas)

Hệ thống lưu giữ các lược đồ chính được cấu hình và quan hệ (Relationship):

1. **`User` Table:** Lưu `id`, `name`, `email`, `password_hash`, `role` (CUSTOMER, ADMIN, ORGANIZER), `coins`.
2. **`Event` Table:** Lưu `id`, `ten_show`, `ngay_gio`, `dia_diem`, `anh_banner`, `trang_thai` (Enum: DRAFT, PENDING, APPROVED), `seats_io_chart_key`, `seats_io_event_key`, `organizer_id` (Khóa ngoại).
3. **`TicketTier` Table:** Quản lý chia cấp hạng phòng vé: `id`, `event_id`, `name` (VD: VIP, GA), `price`, `color`, `total_amount`. Móc nối với từng cụm danh mục bên trong Seats.io.
4. **`Order` Table:** Lưu `id`, `event_id`, `user_id`, `total_amount`, `status`, và cột JSON phức hợp `invoice_info` (Nắm giữ Company Name, Tax Code,...).
5. **`OrderItem` Table:** Bản ghi phân li chi tiết lưu lại `id`, `order_id`, `seat_id_string` (VD: "SEC-A-1-5"), `price` thời điểm mua vé.

---

## 7. Ưu điểm Cốt Lõi và Lợi thế Cạnh Tranh (Key Highlights)

1. **Kiến trúc Sơ đồ Vị trí Nâng cao & Duy nhất (True Absolute Mapping):** Giải quyết dứt điểm vấn nạn mua vé "phân khu chung chung" của các nền tảng nhỏ. Mọi vé được ấn định vào một chỗ vật lý riêng biệt với API map sinh ra tự động riêng kết hợp Seats.io; không dùng các component tĩnh thô sơ (như DotGrid).
2. **Tính bảo mật Giao dịch cực cao:** Validate thông tin phía Local (Email, Phone length) và Hold Slot trên API bảo vệ khán giả khỏi bực tức khi giỏ trống bất chợt do cạnh tranh, kết hợp mô hình hoàn/trả slot khi Timeout Timer tự giải phóng.
3. **Thiết kế tập trung Thẩm mỹ Động (Motion Aesthetics):** Ứng dụng Framer Motion và thư viện giao diện chuẩn quốc tế, giúp UI của JoyB.VN mượt mà khác biệt hẳn các website đồ án thông thường (Animation page transitions, hovers, loaders). Lọc các khuyến nghị sự kiện theo mô-tuýp Carousel.
4. **Kiến trúc linh hoạt để Tự động Hóa đơn Thuế (Automated Invoice Pipeline):** Cho phép tích hợp thông tin Tax ngay tại Checkout, sẵn sàng xuất Excel/PDF cho kê khai kiểm toán nội bộ của Organizer với dữ liệu từ JSON CSDL.

***
*Đây là biên bản đặc tả hệ thống toàn trình dành riêng cho hoạt động tái cấu trúc tài liệu đồ án/chuyên đề phần mềm JoyB.VN.*
