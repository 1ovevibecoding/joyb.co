# 🏗️ Sơ đồ Phân rã Chức năng (Functional Decomposition)

Dựa vào sơ đồ phân rã theo dạng cây (WBS) mẫu của bạn lấy từ website bán quần áo, dưới đây là mã PlantUML (**chuẩn "nano banana"** 🍌😎) vẽ sơ đồ phân rã chức năng tương tự, nhưng được thiết kế riêng biệt cho nền tảng bán vé sự kiện JoyB!

Bạn có thể copy dán vào VSCode (với extension PlantUML) hoặc Web PlantUML Viewer để render ra ảnh hộp khối cây (Tree Box) tương tự.

```plantuml
@startwbs
<style>
wbsDiagram {
  // Colors perfectly matched for professional look
  BackgroundColor white
  node {
    BackgroundColor white
    LineColor #1f4f82
    FontColor black
    LineThickness 1.5
    Padding 8
    Margin 15
  }
  arrow {
    LineColor #1f4f82
    LineThickness 1.5
  }
}
</style>

* HỆ THỐNG ĐẶT VÉ SỰ KIỆN JOYB
** Quản lý tài\nkhoản hệ thống
*** Thêm/ xóa/ sửa\ntài khoản
*** Phân quyền\nUser/Org/Admin
*** Khóa/ mở\ntài khoản
** Quản lý sự kiện\n& hạng vé
*** Quản lý hình\nảnh/banner
*** Quản lý sơ đồ\nkhu vực & ghế
*** Cập nhật\ntrạng thái duyệt
** Quản lý giao dịch\nđặt vé
*** Xem danh sách\nđơn hàng
*** Cập nhật trạng\nthái thanh toán
*** Gửi vé QR\nđiện tử
** Quản lý Người dùng\n& Đối tác
*** Xác minh hồ sơ\nBan tổ chức
*** Xem lịch sử\nmua vé/tổ chức
*** Quản lý thông\ntin thành viên
** Báo cáo - \nThống kê
*** Doanh thu theo\nngày/tháng/năm
*** Top sự kiện\nbán chạy
*** Số lượng vé\ntồn/đã bán
@endwbs
```

### 💡 Ghi chú: 
* Sơ đồ sử dụng cú pháp `@startwbs` (Work Breakdown Structure) được thiết kế chuyên dụng trong PlantUML cho việc vẽ biểu đồ phân rã chức năng, các node sẽ tự động tạo thành hình khối kết nối với nhau như ảnh gốc.
* Tôi thêm `\n` vào một số text để ngắt dòng cho hộp node khi xuất ra không bị chiều dài quá dài, giống hệt với các hộp chữ nhật gọn gàng trong hình mẫu!
