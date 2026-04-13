import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';

// All page content data
const pages = {
  // ========== LEGAL ==========
  'terms-of-service': {
    title: 'Terms of Service',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Giới thiệu',
        content: 'Chào mừng bạn đến với JoyB.VN — nền tảng mua bán vé sự kiện trực tuyến được vận hành bởi Goloco Company Limited ("Công ty", "chúng tôi"). Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.'
      },
      {
        heading: '2. Tài khoản người dùng',
        content: 'Khi đăng ký tài khoản trên JoyB.VN, bạn cam kết cung cấp thông tin chính xác, đầy đủ và cập nhật. Mỗi cá nhân chỉ được sở hữu một tài khoản. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của mình. JoyB.VN có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm điều khoản sử dụng.'
      },
      {
        heading: '3. Mua vé và thanh toán',
        content: 'Tất cả giao dịch mua vé trên JoyB.VN đều được xử lý qua các cổng thanh toán an toàn. Giá vé đã bao gồm thuế VAT (nếu có). Vé đã mua thành công sẽ được gửi qua email đăng ký và hiển thị trong mục "Vé của tôi". Vé điện tử có mã QR duy nhất và không được sao chép, chuyển nhượng trái phép.'
      },
      {
        heading: '4. Chính sách hoàn vé',
        content: 'Vé đã mua có thể được hoàn trả trong vòng 72 giờ sau khi thanh toán, với điều kiện sự kiện chưa diễn ra và ban tổ chức cho phép hoàn vé. Phí xử lý hoàn vé là 10% giá trị vé. Sau thời hạn 72 giờ hoặc khi sự kiện đã bắt đầu, vé sẽ không được hoàn trả trong mọi trường hợp.'
      },
      {
        heading: '5. Trách nhiệm của người dùng',
        content: 'Người dùng cam kết không sử dụng nền tảng cho mục đích bất hợp pháp, không đầu cơ vé, không sử dụng bot hoặc công cụ tự động để mua vé với số lượng lớn. Mọi hành vi vi phạm sẽ bị xử lý theo quy định pháp luật hiện hành và có thể dẫn đến việc khóa tài khoản vĩnh viễn.'
      },
      {
        heading: '6. Quyền sở hữu trí tuệ',
        content: 'Toàn bộ nội dung trên JoyB.VN bao gồm thiết kế, logo, văn bản, hình ảnh, mã nguồn đều thuộc quyền sở hữu của Goloco Company Limited hoặc đối tác được cấp phép. Nghiêm cấm sao chép, phân phối, sửa đổi bất kỳ nội dung nào mà không có sự đồng ý bằng văn bản.'
      },
      {
        heading: '7. Giới hạn trách nhiệm',
        content: 'JoyB.VN là nền tảng kết nối giữa ban tổ chức sự kiện và người mua vé. Chúng tôi không chịu trách nhiệm về nội dung, chất lượng, hoặc việc hủy/thay đổi lịch trình sự kiện do ban tổ chức quyết định. Trong mọi trường hợp, trách nhiệm bồi thường của JoyB.VN không vượt quá giá trị giao dịch vé.'
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Thu thập thông tin',
        content: 'Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, mua vé, hoặc liên hệ hỗ trợ. Thông tin bao gồm: họ tên, email, số điện thoại, địa chỉ, và thông tin thanh toán. Chúng tôi cũng tự động thu thập dữ liệu kỹ thuật như địa chỉ IP, loại trình duyệt, thiết bị sử dụng, và hành vi duyệt web thông qua cookies.'
      },
      {
        heading: '2. Mục đích sử dụng',
        content: 'Thông tin của bạn được sử dụng để xử lý đơn hàng và giao vé điện tử, cung cấp dịch vụ hỗ trợ khách hàng, gửi thông báo về sự kiện và chương trình khuyến mãi (nếu bạn đồng ý), cải thiện trải nghiệm người dùng và phát triển tính năng mới, tuân thủ các nghĩa vụ pháp lý.'
      },
      {
        heading: '3. Chia sẻ thông tin',
        content: 'Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ với ban tổ chức sự kiện (tên và email để xác nhận vé), đối tác thanh toán (để xử lý giao dịch), cơ quan pháp luật khi có yêu cầu hợp pháp.'
      },
      {
        heading: '4. Bảo mật dữ liệu',
        content: 'JoyB.VN áp dụng các biện pháp bảo mật tiên tiến bao gồm mã hóa SSL/TLS cho mọi giao dịch, hệ thống firewall và giám sát 24/7, sao lưu dữ liệu định kỳ, kiểm tra bảo mật thường xuyên bởi bên thứ ba. Mật khẩu người dùng được lưu trữ dưới dạng hash và không thể khôi phục.'
      },
      {
        heading: '5. Quyền của người dùng',
        content: 'Bạn có quyền truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân bất kỳ lúc nào thông qua trang cài đặt tài khoản. Bạn cũng có quyền yêu cầu xuất dữ liệu cá nhân, từ chối nhận email marketing, và yêu cầu xóa hoàn toàn tài khoản. Mọi yêu cầu sẽ được xử lý trong vòng 7 ngày làm việc.'
      },
      {
        heading: '6. Cookies',
        content: 'Chúng tôi sử dụng cookies để duy trì phiên đăng nhập, ghi nhớ tùy chọn ngôn ngữ và giao diện, phân tích lưu lượng truy cập, và hiển thị nội dung phù hợp. Bạn có thể quản lý hoặc vô hiệu hóa cookies thông qua cài đặt trình duyệt.'
      }
    ]
  },
  'dispute-resolution': {
    title: 'Dispute Resolution',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Nguyên tắc giải quyết',
        content: 'JoyB.VN cam kết giải quyết mọi tranh chấp một cách công bằng, minh bạch và nhanh chóng. Chúng tôi khuyến khích các bên liên quan ưu tiên thương lượng hòa giải trước khi tiến hành các bước pháp lý.'
      },
      {
        heading: '2. Quy trình khiếu nại',
        content: 'Bước 1: Gửi khiếu nại qua email support@joyb.vn hoặc form liên hệ trong vòng 48 giờ sau sự kiện. Bước 2: Đội ngũ hỗ trợ sẽ xác nhận và phản hồi trong vòng 24 giờ làm việc. Bước 3: Điều tra và thu thập thông tin từ các bên liên quan (tối đa 5 ngày làm việc). Bước 4: Đưa ra phương án giải quyết và thông báo kết quả.'
      },
      {
        heading: '3. Các trường hợp được hỗ trợ',
        content: 'Sự kiện bị hủy hoặc hoãn mà không có thông báo trước. Chất lượng sự kiện không đúng như quảng cáo. Lỗi hệ thống dẫn đến tính phí sai hoặc trùng lặp. Vé không hợp lệ tại cổng vào dù đã thanh toán thành công. Không nhận được vé điện tử sau khi thanh toán.'
      },
      {
        heading: '4. Bồi thường',
        content: 'Tùy theo từng trường hợp, JoyB.VN có thể hoàn tiền 100%, cấp voucher bồi thường, hoặc đổi vé cho sự kiện khác có giá trị tương đương. Quyết định cuối cùng thuộc về JoyB.VN dựa trên kết quả điều tra và các bằng chứng thu thập được.'
      },
      {
        heading: '5. Trọng tài và tòa án',
        content: 'Nếu tranh chấp không thể giải quyết qua thương lượng, các bên đồng ý đưa vụ việc ra Trung tâm Trọng tài Quốc tế Việt Nam (VIAC) hoặc Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh. Luật pháp Việt Nam sẽ được áp dụng.'
      }
    ]
  },
  'payment-privacy': {
    title: 'Payment Privacy',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Bảo mật thanh toán',
        content: 'Mọi giao dịch trên JoyB.VN đều được xử lý thông qua các cổng thanh toán đạt chuẩn PCI-DSS Level 1. Chúng tôi không lưu trữ số thẻ tín dụng/ghi nợ trên hệ thống. Toàn bộ dữ liệu thanh toán được mã hóa bằng SSL 256-bit.'
      },
      {
        heading: '2. Phương thức thanh toán',
        content: 'JoyB.VN hỗ trợ đa dạng phương thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB). Ví điện tử (MoMo, VNPay, ZaloPay). Chuyển khoản ngân hàng nội địa. Apple Pay và Google Pay (dự kiến 2026).'
      },
      {
        heading: '3. Xử lý giao dịch',
        content: 'Giao dịch được xử lý trong thời gian thực. Tiền sẽ được trừ ngay khi thanh toán thành công. Trong trường hợp hoàn tiền, thời gian hoàn vào tài khoản tùy thuộc vào ngân hàng phát hành (thường từ 5-15 ngày làm việc).'
      },
      {
        heading: '4. Chống gian lận',
        content: 'Hệ thống của chúng tôi tích hợp công nghệ phát hiện gian lận tiên tiến, bao gồm xác thực 3D Secure, kiểm tra CVV, phân tích hành vi giao dịch, và giới hạn số lần thử thanh toán. Giao dịch đáng ngờ sẽ bị tạm giữ để xác minh.'
      },
      {
        heading: '5. Hóa đơn',
        content: 'Hóa đơn điện tử được tự động gửi qua email sau mỗi giao dịch thành công. Bạn cũng có thể tải hóa đơn từ mục "Vé của tôi" trên trang web. JoyB.VN phát hành hóa đơn VAT theo quy định của pháp luật Việt Nam.'
      }
    ]
  },

  // ========== ORGANIZER ==========
  'ticketing-for-organizers': {
    title: 'Ticketing for Organizers',
    category: 'Organizer',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Tổng quan nền tảng',
        content: 'JoyB.VN cung cấp giải pháp bán vé trực tuyến toàn diện dành cho ban tổ chức sự kiện. Từ concert nhỏ 50 chỗ đến festival hàng chục nghìn người, chúng tôi đều có khả năng đáp ứng.'
      },
      {
        heading: 'Tính năng chính',
        content: 'Tạo sự kiện trong 5 phút với giao diện kéo thả trực quan. Thiết kế sơ đồ ghế tùy chỉnh (End-Stage, T-Stage, 360° Arena, Runway, Ring). Tạo nhiều hạng vé với giá và mô tả riêng. Quản lý doanh thu real-time. Hỗ trợ mã giảm giá và Flash Sale. Báo cáo chi tiết về lượt bán, doanh thu, và hành vi khán giả.'
      },
      {
        heading: 'Cách đăng ký',
        content: 'Truy cập JoyB.VN và chọn "Đăng ký tổ chức sự kiện". Điền thông tin doanh nghiệp/cá nhân và giấy tờ xác minh. Đội ngũ JoyB sẽ duyệt trong 24-48 giờ. Sau khi được duyệt, bạn có thể bắt đầu tạo sự kiện ngay lập tức.'
      },
      {
        heading: 'Hỗ trợ ban tổ chức',
        content: 'Mỗi ban tổ chức được giao một Account Manager riêng. Hỗ trợ kỹ thuật 24/7 qua hotline, email, và chat. Tư vấn chiến lược giá vé và marketing. Cung cấp công cụ check-in bằng QR code tại sự kiện.'
      }
    ]
  },
  'pricing': {
    title: 'Pricing',
    category: 'Organizer',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Cấu trúc phí',
        content: 'JoyB.VN áp dụng mô hình phí minh bạch, không có chi phí ẩn. Ban tổ chức có thể chọn chịu phí hoặc chuyển phí sang người mua vé.'
      },
      {
        heading: 'Gói STARTER (Miễn phí)',
        content: 'Phí dịch vụ: 5% + 5,000đ/vé. Tối đa 500 vé/sự kiện. Báo cáo cơ bản. Email hỗ trợ. 1 loại vé/hạng. Thanh toán trong 7 ngày làm việc.'
      },
      {
        heading: 'Gói PRO (2,000,000đ/tháng)',
        content: 'Phí dịch vụ: 3% + 3,000đ/vé. Không giới hạn vé/sự kiện. Báo cáo nâng cao + analytics. Hỗ trợ ưu tiên 24/7. Sơ đồ ghế tùy chỉnh không giới hạn. Mã giảm giá, Flash Sale. Thanh toán trong 3 ngày làm việc. Account Manager riêng.'
      },
      {
        heading: 'Gói ENTERPRISE (Liên hệ)',
        content: 'Phí dịch vụ thỏa thuận riêng. API tích hợp hệ thống. White-label solution. Hỗ trợ on-site tại sự kiện. SLA cam kết uptime 99.9%. Đội ngũ kỹ thuật chuyên trách. Thanh toán trong 1 ngày làm việc.'
      }
    ]
  },
  'compare': {
    title: 'So sánh với đối thủ',
    category: 'Organizer',
    updated: 'March 15, 2026',
    sections: [
      {
        heading: 'Tại sao chọn JoyB.VN?',
        content: 'JoyB.VN là nền tảng bán vé sự kiện được thiết kế đặc biệt cho thị trường Việt Nam, với phí dịch vụ thấp nhất thị trường, hỗ trợ tiếng Việt 100%, và tích hợp đầy đủ cổng thanh toán nội địa.'
      },
      {
        heading: 'So sánh phí dịch vụ',
        content: 'JoyB.VN: từ 3% + 3,000đ/vé. Ticketbox: 5% + 10,000đ/vé. Eventbrite: 6.95% + $0.99/vé. Các nền tảng khác: 5-10% + phí ẩn. JoyB.VN giúp ban tổ chức tiết kiệm trung bình 30-50% chi phí dịch vụ so với đối thủ cạnh tranh.'
      },
      {
        heading: 'Tính năng vượt trội',
        content: 'Sơ đồ ghế kéo thả (drag-and-drop) — không phải nền tảng nào cũng có. Zoom/Pan bản đồ ghế như Google Maps. Flash Sale tích hợp sẵn. Hệ thống gamification (JoyB Coins) tăng tương tác. AR Seat View — xem trước góc nhìn từ ghế. Thanh toán đa kênh: MoMo, VNPay, thẻ, chuyển khoản.'
      },
      {
        heading: 'Hỗ trợ',
        content: 'JoyB.VN: Hotline + Chat + Email 24/7 bằng tiếng Việt. Các nền tảng quốc tế: Email only, thời gian phản hồi 48-72 giờ, hỗ trợ bằng tiếng Anh.'
      }
    ]
  },
  'feature-updates': {
    title: 'Feature Updates',
    category: 'Organizer',
    updated: 'March 20, 2026',
    sections: [
      {
        heading: 'Q1/2026 — Đã phát hành',
        content: 'Sơ đồ ghế kéo thả (SeatMap Builder). Zoom và Pan trên bản đồ ghế. Hệ thống JoyB Coins gamification. Flash Sale tích hợp trên SeatMap. AR Seat View (xem trước góc nhìn). Đa ngôn ngữ (Tiếng Việt / English). Giao diện sáng/tối (Light/Dark mode). Thanh toán MoMo, VNPay, chuyển khoản ngân hàng.'
      },
      {
        heading: 'Q2/2026 — Đang phát triển',
        content: 'Ứng dụng di động iOS & Android. Tích hợp Apple Pay và Google Pay. Hệ thống đánh giá sự kiện sau khi tham dự. Tính năng "Nhóm bạn" — mua vé cùng nhau. Livestream tích hợp cho sự kiện online. Dashboard analytics nâng cao cho ban tổ chức.'
      },
      {
        heading: 'Q3/2026 — Kế hoạch',
        content: 'AI-powered pricing recommendations. Tích hợp NFT ticket (vé sưu tầm). Social check-in và story sharing. Chương trình loyalty program mở rộng. API mở cho đối tác tích hợp. Hệ thống waitlist thông minh khi hết vé.'
      },
      {
        heading: 'Đề xuất tính năng',
        content: 'Chúng tôi luôn lắng nghe ý kiến đóng góp từ ban tổ chức và người dùng. Gửi đề xuất tính năng mới qua email features@joyb.vn hoặc form góp ý trong trang quản lý sự kiện.'
      }
    ]
  },

  // ========== SUPPORT ==========
  'contact': {
    title: 'Contact',
    category: 'Support',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: 'Thông tin liên hệ',
        content: 'Công ty TNHH Goloco (JoyB.VN). Địa chỉ: Tầng 12, Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.'
      },
      {
        heading: 'Kênh hỗ trợ',
        content: 'Email: support@joyb.vn (phản hồi trong 24 giờ). Messenger: joybvn. Hotline: 1900-xxxx (8:00 - 22:00 hàng ngày). Live Chat: Có sẵn trên website (8:00 - 22:00).'
      },
      {
        heading: 'Giờ làm việc',
        content: 'Thứ Hai - Thứ Sáu: 8:00 - 18:00 (giờ hành chính). Thứ Bảy - Chủ Nhật: 9:00 - 17:00. Ngày lễ: Hỗ trợ qua email và chat. Các sự kiện diễn ra ngoài giờ: Đội ngũ trực chiến hỗ trợ check-in.'
      },
      {
        heading: 'Hợp tác kinh doanh',
        content: 'Đối với các đề xuất hợp tác, tài trợ, hoặc câu hỏi về doanh nghiệp, vui lòng liên hệ: partnership@joyb.vn.'
      }
    ]
  },
  'documentation': {
    title: 'Documentation',
    category: 'Support',
    updated: 'March 20, 2026',
    sections: [
      {
        heading: 'Bắt đầu nhanh — Người mua vé',
        content: '1. Tạo tài khoản tại JoyB.VN (email + mật khẩu). 2. Duyệt sự kiện trên trang chủ hoặc tìm kiếm theo tên, địa điểm, nghệ sĩ. 3. Chọn sự kiện và nhấn "MUA VÉ NGAY". 4. Chọn ghế/khu vực trên sơ đồ ghế tương tác. 5. Tiến hành thanh toán. 6. Nhận vé điện tử (QR code) qua email và trong mục "Vé của tôi".'
      },
      {
        heading: 'Bắt đầu nhanh — Ban tổ chức',
        content: '1. Đăng ký tài khoản ban tổ chức tại trang "Đăng ký tổ chức sự kiện". 2. Chờ duyệt bởi JoyB (24-48 giờ). 3. Đăng nhập và vào "Tạo sự kiện". 4. Điền thông tin sự kiện (tên, ngày giờ, địa điểm, mô tả). 5. Tạo hạng vé và đặt giá. 6. Thiết kế sơ đồ ghế hoặc sử dụng mẫu có sẵn. 7. Xuất bản sự kiện.'
      },
      {
        heading: 'Sơ đồ ghế (SeatMap)',
        content: 'JoyB.VN hỗ trợ nhiều kiểu sân khấu: End-Stage (sân khấu cuối), T-Stage (sân khấu chữ T), Arena 360° (sân khấu tròn), Thrust (sân khấu nhô), Runway (đường runway), Center Ring (ring đấu). Sử dụng công cụ kéo thả trong "Thiết kế sơ đồ ghế" để tùy chỉnh vị trí các khu vực ghế.'
      },
      {
        heading: 'Zoom và Pan bản đồ ghế',
        content: 'Ctrl + Cuộn chuột: Phóng to/thu nhỏ bản đồ ghế. Alt + Kéo chuột: Di chuyển (pan) khi đang zoom. Double-click: Reset về mặc định. Trên mobile: Pinch to zoom, swipe to pan.'
      },
      {
        heading: 'Thanh toán',
        content: 'JoyB.VN hỗ trợ 4 phương thức thanh toán: Thẻ tín dụng/ghi nợ (nhập thông tin trực tiếp), chuyển khoản ngân hàng (quét mã QR), MoMo (xác nhận qua app MoMo), VNPay (xác nhận qua app VNPay hoặc ngân hàng).'
      },
      {
        heading: 'FAQ — Câu hỏi thường gặp',
        content: 'Q: Tôi có thể mua bao nhiêu vé? A: Tối đa 10 vé/giao dịch. Q: Vé có thể chuyển nhượng không? A: Có, nếu ban tổ chức cho phép. Q: Mất vé thì sao? A: Vé điện tử luôn có sẵn trong tài khoản. Q: Sự kiện bị hủy thì sao? A: Hoàn tiền 100% trong 7 ngày làm việc.'
      }
    ]
  },

  // ========== BOTTOM FOOTER ==========
  'return-policy': {
    title: 'Return Policy',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Điều kiện hoàn vé',
        content: 'Vé có thể hoàn trả nếu sự kiện bị hủy bởi ban tổ chức, yêu cầu hoàn trả được gửi trong vòng 72 giờ sau khi mua, hoặc ban tổ chức đồng ý cho phép hoàn vé.'
      },
      {
        heading: '2. Trường hợp không hoàn vé',
        content: 'Vé không được hoàn trả nếu sự kiện đã diễn ra, quá thời hạn 72 giờ, hoặc vé đã được sử dụng (quét QR tại cổng). Vé mua trong chương trình Flash Sale hoặc khuyến mãi đặc biệt cũng không áp dụng chính sách hoàn trả.'
      },
      {
        heading: '3. Quy trình hoàn tiền',
        content: 'Bước 1: Gửi yêu cầu tại mục "Vé của tôi" hoặc email support@joyb.vn. Bước 2: Đội ngũ xác minh trong 1-3 ngày làm việc. Bước 3: Hoàn tiền qua phương thức thanh toán ban đầu. Thời gian nhận: 5-15 ngày tùy ngân hàng.'
      },
      {
        heading: '4. Phí hoàn vé',
        content: 'Sự kiện bị hủy bởi BTC: Hoàn 100%, không phí. Hoàn trả trong 24 giờ đầu: Hoàn 95%, phí 5%. Hoàn trả trong 24-72 giờ: Hoàn 90%, phí 10%.'
      }
    ]
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: '1. Vé điện tử (E-Ticket)',
        content: 'Tất cả vé trên JoyB.VN đều là vé điện tử (e-ticket). Vé được giao ngay lập tức qua email sau khi thanh toán thành công. Vé bao gồm mã QR duy nhất để check-in tại sự kiện. Không cần in vé — chỉ cần xuất trình mã QR trên điện thoại.'
      },
      {
        heading: '2. Thời gian giao vé',
        content: 'Thanh toán bằng thẻ/ví điện tử: Nhận vé ngay lập tức (< 1 phút). Chuyển khoản ngân hàng: Nhận vé trong 15-60 phút sau khi xác nhận thanh toán. Nếu không nhận được vé sau 2 giờ, vui lòng liên hệ support@joyb.vn.'
      },
      {
        heading: '3. Kiểm tra vé',
        content: 'Vé đã mua luôn có sẵn trong mục "Vé của tôi" trên trang web. Mỗi vé có mã QR duy nhất, mã đặt vé (booking code), thông tin sự kiện, và vị trí ghế. Vui lòng kiểm tra thông tin chính xác trước khi đến sự kiện.'
      }
    ]
  },
  'payment-methods': {
    title: 'Payment Methods',
    category: 'Legal',
    updated: 'March 10, 2026',
    sections: [
      {
        heading: 'Thẻ tín dụng / Ghi nợ',
        content: 'Hỗ trợ Visa, Mastercard, JCB, American Express. Xác thực 3D Secure cho mọi giao dịch. Không lưu trữ thông tin thẻ trên hệ thống JoyB. Xử lý bởi đối tác thanh toán đạt chuẩn PCI-DSS.'
      },
      {
        heading: 'Chuyển khoản ngân hàng',
        content: 'Quét mã QR để chuyển khoản nhanh. Hỗ trợ tất cả ngân hàng nội địa Việt Nam. Nội dung chuyển khoản được tự động điền. Xác nhận thanh toán trong 15-60 phút.'
      },
      {
        heading: 'MoMo',
        content: 'Thanh toán qua ứng dụng MoMo. Xác nhận giao dịch bằng mã OTP hoặc vân tay. Vé được gửi ngay sau khi thanh toán thành công.'
      },
      {
        heading: 'VNPay',
        content: 'Thanh toán qua VNPay-QR hoặc liên kết tài khoản ngân hàng. Hỗ trợ hơn 40 ngân hàng Việt Nam. Giao dịch nhanh, bảo mật cao.'
      }
    ]
  }
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = pages[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!page) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">Trang này không tồn tại.</p>
          <Link to="/" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow min-h-[60vh] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-400">{page.category}</span>
          <span>/</span>
          <span className="text-white">{page.title}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            {page.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{page.title}</h1>
          <p className="text-sm text-gray-500">Cập nhật lần cuối: {page.updated}</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {page.sections.map((section, idx) => (
            <div key={idx} className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">{section.heading}</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-[#27272a] text-center">
          <p className="text-gray-500 text-sm mb-4">Bạn cần hỗ trợ thêm?</p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/info/contact" className="px-5 py-2.5 bg-[#27272a] text-white font-medium rounded-lg hover:bg-[#333] transition-colors text-sm">
              Liên hệ
            </Link>
            <a href="mailto:support@joyb.vn" className="px-5 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Email hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
