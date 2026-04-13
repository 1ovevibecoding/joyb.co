# 🧩 Sơ đồ Lớp (Class Diagram) - Kiến trúc Backend Phân Lớp

Đây là Sơ đồ Lớp cập nhật mới nhất, phản ánh chính xác **kiến trúc Backend phân lớp (Layered Architecture)** của dự án JoyB Platform. Bao gồm luồng gọi xử lý từ HTTP Request đi qua Controller, xuống Service xử lý nghiệp vụ, giao tiếp cơ sở dữ liệu qua Repository (Prisma) và gửi trả DTO.

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam roundcorner 5

' --- STYLING MACROS ---
skinparam package {
    BackgroundColor transparent
    BorderColor #1f4f82
    FontColor #1f4f82
    FontSize 14
    FontStyle bold
}

skinparam class {
    BackgroundColor white
    ArrowColor #2b6cb0
    BorderColor #2b6cb0
}

' =========================================
' 1. LAYER: CONTROLLERS
' =========================================
package "Lớp Controller (API HTTP/Routes Layer)" {
  class AuthController {
    + register(req, res)
    + login(req, res)
    + verifyToken(req, res)
  }
  
  class EventController {
    + getEvents(req, res)
    + getEventDetail(req, res)
    + createEvent(req, res)
  }
  
  class TicketController {
    + getTickets(req, res)
    + checkInQR(req, res)
  }
  
  class OrderController {
    + createOrder(req, res)
    + processPaymentWebhook(req, res)
  }
  
  class AdminController {
    + approveEvent(req, res)
    + getDashboardStats(req, res)
  }
}

' =========================================
' 2. LAYER: SERVICES (Business Logic)
' =========================================
package "Lớp Service (Domain Logic Layer)" {
  class AuthService {
    + validateUser(credentials): JWT
    + handleRegistration(data): void
  }
  
  class EventService {
    + publishEvent(eventId): EventDTO
    + integrateSeatsIO(mapData): void
  }
  
  class OrderService {
    + createTransaction(userId, eventId): OrderDTO
    + holdWaitSeats(seatIds): boolean
    + confirmSuccessPayment(orderId): void
  }
  
  class EmailService {
    + sendBookingConfirm(email, orderId): void
    + sendETicketQR(email, ticketData): void
  }
}

' =========================================
' 3. LAYER: REPOSITORIES (Data Access)
' =========================================
package "Lớp Repository (Data Access via Prisma)" {
  class PrismaClient <<ORM>> {
    + models
    + $transaction()
    + $queryRaw()
  }
  
  class UserRepository {
    + findByEmail(email)
    + createRecord(data)
  }
  
  class EventRepository {
    + findAllActive()
    + saveDraft(data)
    + updateStatus(id, status)
  }
  
  class OrderRepository {
    + saveTransaction(data)
    + updatePaymentState(id, state)
  }
}

' =========================================
' 4. LAYER: DTOs & MODELS
' =========================================
package "Lớp DTO & Models (Type-Safe Data Exchange)" {
  class UserDTO <<DTO>> {
    + id: String
    + email: String
    + role: Enum
    ' Chú thích: Ẩn password_hash
  }
  
  class EventDTO <<DTO>> {
    + id: String
    + title: String
    + status: String
    + banner: String
  }
  
  class OrderDTO <<DTO>> {
    + id: String
    + totalAmt: Float
    + paymentStatus: String
  }
}

' =========================================
' DEPENDENCIES & FLOW (Mối quan hệ)
' =========================================

' Controller --> Service
AuthController ---> AuthService : "ủy quyền xử lý"
EventController ---> EventService : "ủy quyền xử lý"
OrderController ---> OrderService : "ủy quyền xử lý"
TicketController ---> OrderService : "ủy quyền xử lý"
AdminController ---> EventService : "ủy quyền duyệt"

' Service --> Service (Cross-service integration)
OrderService --> EmailService : "kích hoạt gửi vé"
EventService .> OrderService : "kiểm tra vé khả dụng"

' Service --> Repository
AuthService ---> UserRepository : "gọi CRUD"
EventService ---> EventRepository : "gọi CRUD"
OrderService ---> OrderRepository : "gọi CRUD"

' Repository --> ORM
UserRepository --> PrismaClient : "truy vấn DB"
EventRepository --> PrismaClient : "truy vấn DB"
OrderRepository --> PrismaClient : "truy vấn DB"

' Service --> DTOs (Returns clean data)
AuthService ..> UserDTO : "trả về"
EventService ..> EventDTO : "trả về"
OrderService ..> OrderDTO : "trả về"

@enduml
```

### 💡 Diễn giải cấu trúc

* **Luồng đi (Flow)**: Dữ liệu chảy từ trên `Controller` (nhận Http) → Gọi xuống `Service` (chạy logic chức năng, giữ chỗ, thanh toán) → Xuống `Repository` để lưu vào CSDL qua `Prisma ORM`.
* **Giấu dữ liệu nhạy cảm**: Tại Service, trước khi đẩy data ngược lên Controller để Response cho Client, lớp Service sẽ map với `Lớp DTO` (Data Transfer Objects). Ví dụ trả ra `UserDTO` sẽ không bao giờ có chứa `password_hash`.
* **Mối quan hệ phân lớp**: Đảm bảo Single Responsibility Principle. Controller không gọi thẳng Prisma, mà bắt buộc phải qua Service để validate nghiệp vụ. Mọi giao tiếp với tầng CSDL phụ thuộc vào PrismaClient.
