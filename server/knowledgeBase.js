/**
 * JoyB.VN Knowledge Base
 * Structured knowledge for RAG retrieval
 * Each entry has: id, category, title, content, keywords
 */

const knowledgeBase = [
  // ============================================================
  // THÔNG TIN CHUNG VỀ JOYB.VN
  // ============================================================
  {
    id: 'general-1',
    category: 'general',
    title: 'Giới thiệu JoyB.VN',
    content: `JoyB.VN là nền tảng bán vé sự kiện trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp dịch vụ mua bán vé cho các sự kiện âm nhạc, thể thao, hội nghị, workshop và nhiều loại sự kiện khác. JoyB.VN cam kết mang đến trải nghiệm mua vé nhanh chóng, an toàn và tiện lợi nhất cho người dùng Việt Nam.`,
    keywords: ['joyb', 'giới thiệu', 'về chúng tôi', 'nền tảng', 'là gì', 'website']
  },
  {
    id: 'general-2',
    category: 'general',
    title: 'Liên hệ hỗ trợ JoyB.VN',
    content: `Bạn có thể liên hệ đội ngũ hỗ trợ JoyB.VN qua:
• Email: support@joyb.vn
• Hotline: 1900-xxxx (8:00 - 22:00 hàng ngày)
• Chat trực tuyến trên website JoyB.VN
• Fanpage Facebook: facebook.com/JoyB.VN
Thời gian phản hồi trung bình: trong vòng 30 phút trong giờ làm việc.`,
    keywords: ['liên hệ', 'hỗ trợ', 'hotline', 'email', 'support', 'điện thoại', 'tổng đài']
  },

  // ============================================================
  // MUA VÉ
  // ============================================================
  {
    id: 'ticket-buy-1',
    category: 'ticket',
    title: 'Hướng dẫn mua vé trên JoyB.VN',
    content: `Để mua vé trên JoyB.VN, bạn thực hiện theo các bước sau:
1. Truy cập website JoyB.VN và tìm sự kiện bạn muốn tham gia.
2. Nhấn vào sự kiện để xem chi tiết (ngày giờ, địa điểm, giá vé).
3. Chọn loại vé và số lượng muốn mua.
4. Nếu sự kiện có seat map (sơ đồ chỗ ngồi), bạn có thể chọn ghế cụ thể.
5. Nhấn "Mua vé" để tiến hành thanh toán.
6. Điền thông tin cá nhân và chọn phương thức thanh toán.
7. Hoàn tất thanh toán → Vé điện tử sẽ được gửi qua email và hiển thị trong mục "Vé của tôi".
Lưu ý: Mỗi giao dịch có thời gian giữ ghế giới hạn (thường 10-15 phút), hãy thanh toán nhanh để không mất ghế!`,
    keywords: ['mua vé', 'cách mua', 'hướng dẫn mua', 'đặt vé', 'book vé', 'mua', 'order']
  },
  {
    id: 'ticket-buy-2',
    category: 'ticket',
    title: 'Giới hạn mua vé',
    content: `Mỗi tài khoản có thể mua tối đa 4-6 vé cho mỗi sự kiện (tùy theo quy định của ban tổ chức). Giới hạn này nhằm đảm bảo sự công bằng cho tất cả người dùng. Nếu bạn cần mua số lượng lớn hơn, vui lòng liên hệ trực tiếp với đội ngũ hỗ trợ.`,
    keywords: ['giới hạn', 'tối đa', 'số lượng', 'bao nhiêu vé', 'mua nhiều']
  },

  // ============================================================
  // VÉ ĐIỆN TỬ
  // ============================================================
  {
    id: 'eticket-1',
    category: 'ticket',
    title: 'Vé điện tử là gì?',
    content: `Vé điện tử (E-ticket) là vé dạng số được gửi đến email và hiển thị trong tài khoản JoyB.VN của bạn. Mỗi vé có một mã QR code duy nhất. Khi đến sự kiện, bạn chỉ cần xuất trình mã QR (trên điện thoại hoặc in ra giấy) để check-in tại cổng. Vé điện tử giúp bạn không cần lo lắng về việc mất vé giấy, và có thể kiểm tra trạng thái vé bất cứ lúc nào trên website.`,
    keywords: ['vé điện tử', 'e-ticket', 'eticket', 'QR code', 'mã QR', 'check-in', 'vé online']
  },
  {
    id: 'eticket-2',
    category: 'ticket',
    title: 'Cách nhận vé điện tử',
    content: `Sau khi thanh toán thành công, vé điện tử sẽ:
• Được gửi đến email đăng ký trong vòng 5-10 phút.
• Hiển thị trong mục "Vé của tôi" trên website JoyB.VN.
• Có mã QR code để check-in tại sự kiện.
Nếu sau 30 phút bạn chưa nhận được vé, hãy kiểm tra thư mục Spam/Junk hoặc liên hệ hỗ trợ.`,
    keywords: ['nhận vé', 'gửi vé', 'vé ở đâu', 'không nhận được vé', 'email vé', 'xem vé']
  },

  // ============================================================
  // HOÀN TIỀN & ĐỔI VÉ
  // ============================================================
  {
    id: 'refund-1',
    category: 'refund',
    title: 'Chính sách hoàn tiền',
    content: `Chính sách hoàn tiền của JoyB.VN:
• Hoàn tiền 100% nếu sự kiện bị hủy bởi ban tổ chức.
• Hoàn tiền 80% nếu yêu cầu hoàn trước sự kiện 7 ngày.
• Hoàn tiền 50% nếu yêu cầu hoàn trước sự kiện 3-7 ngày.
• Không hoàn tiền nếu yêu cầu hoàn trong vòng 3 ngày trước sự kiện.
• Thời gian xử lý hoàn tiền: 5-7 ngày làm việc.
• Hoàn tiền sẽ được chuyển về phương thức thanh toán ban đầu.
Lưu ý: Một số sự kiện có chính sách hoàn tiền riêng do ban tổ chức quy định. Vui lòng kiểm tra điều khoản cụ thể trên trang sự kiện.`,
    keywords: ['hoàn tiền', 'refund', 'hủy vé', 'trả vé', 'lấy lại tiền', 'hoàn lại', 'cancel']
  },
  {
    id: 'refund-2',
    category: 'refund',
    title: 'Cách yêu cầu hoàn tiền',
    content: `Để yêu cầu hoàn tiền:
1. Đăng nhập vào tài khoản JoyB.VN.
2. Vào mục "Vé của tôi".
3. Chọn vé cần hoàn và nhấn "Yêu cầu hoàn tiền".
4. Điền lý do hoàn tiền.
5. Xác nhận yêu cầu.
Đội ngũ JoyB sẽ xử lý yêu cầu trong 1-2 ngày làm việc và thông báo kết quả qua email.`,
    keywords: ['yêu cầu hoàn', 'làm sao hoàn', 'cách hoàn tiền', 'thủ tục hoàn', 'quy trình hoàn']
  },
  {
    id: 'exchange-1',
    category: 'refund',
    title: 'Chính sách đổi vé',
    content: `JoyB.VN hỗ trợ đổi vé trong các trường hợp sau:
• Đổi sang hạng vé cao hơn: Bạn chỉ cần trả thêm phần chênh lệch.
• Đổi ngày tham dự (nếu sự kiện có nhiều ngày): Tùy thuộc vào tình trạng còn chỗ.
• Đổi thông tin người tham dự: Liên hệ hỗ trợ trước sự kiện ít nhất 24 giờ.
Lưu ý: Không hỗ trợ đổi sang hạng vé thấp hơn. Phí đổi vé: miễn phí cho lần đổi đầu tiên, 50.000đ cho các lần đổi tiếp theo.`,
    keywords: ['đổi vé', 'chuyển vé', 'nâng hạng', 'đổi ngày', 'đổi tên', 'exchange']
  },

  // ============================================================
  // SEAT MAP - CHỌN GHẾ
  // ============================================================
  {
    id: 'seatmap-1',
    category: 'seatmap',
    title: 'Hướng dẫn chọn ghế trên Seat Map',
    content: `Seat Map (Sơ đồ chỗ ngồi) giúp bạn chọn vị trí ghế chính xác trong nhà hát/sân vận động:
1. Khi mua vé, nhấn vào khu vực bạn muốn ngồi trên bản đồ.
2. Các ghế có màu sắc khác nhau thể hiện các tier giá khác nhau:
   - 🟣 VIP/Premium: Vị trí tốt nhất, gần sân khấu nhất
   - 🔵 Standard A: Vị trí tốt, tầm nhìn rõ ràng
   - 🟢 Standard B: Vị trí trung bình, giá hợp lý
   - 🟡 Economy: Vị trí xa hơn, giá tiết kiệm nhất
3. Ghế màu xám = đã bán, không thể chọn.
4. Nhấn vào ghế trống để chọn, nhấn lại để bỏ chọn.
5. Bạn có thể chọn nhiều ghế cùng lúc (tối đa theo giới hạn mua vé).`,
    keywords: ['seat map', 'sơ đồ', 'chọn ghế', 'chỗ ngồi', 'ghế', 'vị trí', 'bản đồ', 'khu vực']
  },
  {
    id: 'seatmap-2',
    category: 'seatmap',
    title: 'Tier giá vé trên Seat Map',
    content: `JoyB.VN có các tier giá vé phổ biến:
• VIP/Premium: Giá cao nhất, vị trí gần sân khấu nhất, thường bao gồm các đặc quyền như khu vực riêng, quà tặng.
• Standard A (CAT 1): Vị trí tốt với tầm nhìn rõ ràng.
• Standard B (CAT 2): Vị trí trung bình, phù hợp với ngân sách vừa phải.
• Economy (CAT 3): Giá tiết kiệm nhất, phù hợp cho ai muốn trải nghiệm sự kiện với chi phí thấp.
• Standing/GA (General Admission): Vé đứng, không có ghế cố định, thường dùng cho concert.
Giá cụ thể tùy thuộc vào từng sự kiện và ban tổ chức quy định.`,
    keywords: ['tier', 'hạng vé', 'loại vé', 'VIP', 'standard', 'economy', 'giá vé', 'CAT', 'standing']
  },

  // ============================================================
  // THANH TOÁN
  // ============================================================
  {
    id: 'payment-1',
    category: 'payment',
    title: 'Phương thức thanh toán',
    content: `JoyB.VN hỗ trợ nhiều phương thức thanh toán:
• 💳 Chuyển khoản ngân hàng (Bank Transfer): Hỗ trợ tất cả ngân hàng nội địa Việt Nam. Sau khi chọn vé, bạn sẽ nhận thông tin tài khoản để chuyển khoản. Vé sẽ được xác nhận sau khi nhận được tiền.
• 📱 Ví MoMo: Thanh toán nhanh chóng qua ứng dụng MoMo. Quét mã QR hoặc nhập số điện thoại để thanh toán.
• 💰 VNPay: Hỗ trợ thanh toán qua QR code VNPay, Internet Banking, và thẻ nội địa/quốc tế.
• 💎 Thẻ quốc tế: Visa, Mastercard, JCB (thông qua cổng VNPay).
Tất cả giao dịch đều được bảo mật SSL 256-bit.`,
    keywords: ['thanh toán', 'payment', 'trả tiền', 'chuyển khoản', 'MoMo', 'VNPay', 'visa', 'mastercard', 'ngân hàng', 'bank']
  },
  {
    id: 'payment-2',
    category: 'payment',
    title: 'Thời gian giữ ghế khi thanh toán',
    content: `Khi bạn chọn vé và tiến hành thanh toán, hệ thống sẽ giữ ghế cho bạn trong thời gian giới hạn:
• Thanh toán trực tuyến (MoMo, VNPay): Giữ ghế 10-15 phút.
• Chuyển khoản ngân hàng: Giữ ghế 30 phút.
Nếu quá thời gian mà chưa thanh toán, ghế sẽ được mở lại cho người khác. Hãy chuẩn bị sẵn thông tin thanh toán trước khi bắt đầu đặt vé!`,
    keywords: ['giữ ghế', 'thời gian', 'timeout', 'hết hạn', 'countdown', 'timer', 'pending']
  },
  {
    id: 'payment-3',
    category: 'payment',
    title: 'Lỗi thanh toán thường gặp',
    content: `Nếu gặp lỗi khi thanh toán:
• Kiểm tra số dư tài khoản/ví điện tử.
• Đảm bảo thông tin thẻ/tài khoản chính xác.
• Kiểm tra kết nối internet.
• Thử thanh toán bằng phương thức khác.
• Nếu tiền đã trừ nhưng không nhận được vé, liên hệ hỗ trợ ngay kèm ảnh chụp giao dịch. Chúng tôi sẽ xử lý trong 24 giờ.
Hotline hỗ trợ thanh toán: 1900-xxxx`,
    keywords: ['lỗi thanh toán', 'không thanh toán được', 'thất bại', 'lỗi', 'trừ tiền', 'error', 'fail']
  },

  // ============================================================
  // SỰ KIỆN
  // ============================================================
  {
    id: 'event-1',
    category: 'event',
    title: 'Tìm kiếm sự kiện',
    content: `Bạn có thể tìm kiếm sự kiện trên JoyB.VN bằng nhiều cách:
• Sử dụng thanh tìm kiếm ở đầu trang.
• Lọc theo danh mục: Âm nhạc, Thể thao, Nghệ thuật, Workshop, Hội nghị...
• Lọc theo thời gian: Hôm nay, Tuần này, Tháng này.
• Lọc theo địa điểm: TP.HCM, Hà Nội, Đà Nẵng...
• Xem các sự kiện Hot/Trending trên trang chủ.
Mỗi sự kiện có trang chi tiết với đầy đủ thông tin: mô tả, ngày giờ, địa điểm, giá vé, seat map.`,
    keywords: ['tìm kiếm', 'sự kiện', 'event', 'danh mục', 'lọc', 'tìm', 'search']
  },
  {
    id: 'event-2',
    category: 'event',
    title: 'Thông tin sự kiện cụ thể',
    content: `Để xem thông tin chi tiết về một sự kiện cụ thể (ngày giờ, địa điểm, lineup, giá vé), vui lòng truy cập trang sự kiện trên website JoyB.VN. Chatbot không có thông tin real-time về từng sự kiện riêng lẻ, nhưng trên website luôn cập nhật đầy đủ nhất.
Nếu bạn cần hỗ trợ tìm sự kiện phù hợp, hãy cho tôi biết loại sự kiện, thời gian và địa điểm bạn quan tâm!`,
    keywords: ['sự kiện cụ thể', 'ngày giờ', 'lineup', 'thời gian', 'địa điểm', 'khi nào', 'ở đâu', 'event']
  },

  // ============================================================
  // TÀI KHOẢN
  // ============================================================
  {
    id: 'account-1',
    category: 'account',
    title: 'Đăng ký và đăng nhập',
    content: `Để sử dụng JoyB.VN, bạn cần có tài khoản:
• Đăng ký bằng email hoặc số điện thoại.
• Đăng nhập bằng Google hoặc Facebook cũng được hỗ trợ.
• Sau khi đăng ký, bạn có thể mua vé, theo dõi sự kiện yêu thích và quản lý vé đã mua.
• Tài khoản cũng giúp bạn lưu lịch sử mua vé và nhận thông báo về sự kiện.`,
    keywords: ['đăng ký', 'đăng nhập', 'tài khoản', 'account', 'login', 'register', 'sign up']
  },
  {
    id: 'account-2',
    category: 'account',
    title: 'Quên mật khẩu',
    content: `Nếu bạn quên mật khẩu:
1. Nhấn "Quên mật khẩu" trên trang đăng nhập.
2. Nhập email đăng ký.
3. Kiểm tra email để nhận link đặt lại mật khẩu.
4. Tạo mật khẩu mới và đăng nhập lại.
Link đặt lại mật khẩu có hiệu lực trong 24 giờ. Nếu không nhận được email, kiểm tra thư mục Spam hoặc liên hệ hỗ trợ.`,
    keywords: ['quên mật khẩu', 'đặt lại mật khẩu', 'reset password', 'không đăng nhập được', 'forgot']
  }
];

export default knowledgeBase;
