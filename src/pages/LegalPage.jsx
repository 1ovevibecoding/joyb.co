import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// Sidebar navigation structure
const sidebar = [
  { group: 'Quy chế hoạt động', items: [
    { slug: 'terms-of-service', label: 'Quy chế hoạt động' },
    { slug: 'ticket-sales-terms', label: 'Điều khoản bán vé' },
    { slug: 'privacy-policy', label: 'Chính sách bảo mật thông tin' },
    { slug: 'dispute-resolution', label: 'Cơ chế giải quyết tranh chấp / khiếu nại' },
    { slug: 'payment-privacy', label: 'Chính sách bảo mật thanh toán' },
    { slug: 'return-policy', label: 'Chính sách đổi trả và kiểm hàng' },
    { slug: 'shipping-policy', label: 'Điều kiện vận chuyển và giao nhận' },
    { slug: 'payment-methods', label: 'Phương thức thanh toán' },
    { slug: 'prohibited-goods', label: 'Hàng hoá, dịch vụ cấm kinh doanh' },
    { slug: 'content-rules', label: 'Quy định nội dung / hình ảnh' },
    { slug: 'advertising-rules', label: 'Hành hoá, dịch vụ cấm quảng cáo' },
  ]}
];

// ========== FULL LEGAL CONTENT ==========
const pages = {
  'terms-of-service': {
    title: 'QUY CHẾ HOẠT ĐỘNG SÀN GIAO DỊCH THƯƠNG MẠI ĐIỆN TỬ JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 's1', heading: 'I. Nguyên tắc chung',
        content: `1. Sàn giao dịch thương mại điện tử JoyB.VN (sau đây gọi tắt là "JoyB" hoặc "Sàn") do Công ty TNHH Goloco ("Công ty") thiết lập, vận hành và quản lý. JoyB cung cấp môi trường và dịch vụ cho phép Ban Tổ Chức (BTC) sự kiện đăng bán vé, và Người Mua tìm kiếm, so sánh, đặt mua vé sự kiện trực tuyến.

2. Thành viên trên Sàn là các thương nhân, tổ chức, cá nhân có hoạt động hợp pháp được JoyB chính thức ghi nhận và cho phép sử dụng dịch vụ. Mọi giao dịch được thực hiện phải tuân theo Quy chế này và các quy định pháp luật có liên quan.

3. Nghiêm cấm sử dụng JoyB để thu thập thông tin cá nhân của người dùng khác cho mục đích thương mại trái phép, gửi tin nhắn rác (spam), hoặc thực hiện các hành vi gian lận, lừa đảo dưới mọi hình thức.

4. Mọi vi phạm sẽ bị xử lý theo Quy chế hoạt động, Điều khoản sử dụng, và theo quy định pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam.` },
      { id: 's2', heading: 'II. Quy định chung',
        content: `1. Tên miền Sàn giao dịch: https://joyb.vn
2. Định nghĩa chung:
   a) "Người Bán" (Ban Tổ Chức / BTC): Là thương nhân, tổ chức, cá nhân có đăng ký hoạt động kinh doanh hợp lệ và được JoyB xác minh, cho phép đăng bán vé sự kiện trên Sàn.
   b) "Người Mua": Là thành viên đăng ký tài khoản trên JoyB và thực hiện giao dịch mua vé sự kiện.
   c) "Vé điện tử" (E-Ticket): Là vé được phát hành dưới dạng kỹ thuật số, chứa mã QR duy nhất dùng để xác nhận quyền tham dự sự kiện tại cổng vào.
   d) "Sơ đồ ghế" (Seat Map): Là bản đồ trực quan thể hiện vị trí chỗ ngồi/khu vực tại địa điểm tổ chức sự kiện, được hiển thị trên nền tảng để Người Mua lựa chọn.

3. Một cá nhân chỉ được đăng ký một (01) tài khoản duy nhất trên JoyB. Mỗi tài khoản phải cung cấp thông tin trung thực, chính xác, và được cập nhật khi có thay đổi. JoyB có quyền từ chối hoặc hủy bỏ tài khoản nếu phát hiện thông tin đăng ký sai lệch.` },
      { id: 's3', heading: 'III. Quy trình giao dịch',
        content: `Quy trình giao dịch mua vé trên JoyB được thực hiện theo các bước sau:

Bước 1: Người Mua truy cập JoyB.VN, tìm kiếm và chọn sự kiện muốn tham dự.
Bước 2: Người Mua xem thông tin chi tiết sự kiện (thời gian, địa điểm, nghệ sĩ, giá vé).
Bước 3: Người Mua nhấn "MUA VÉ NGAY" và chọn khu vực/ghế ngồi trên Sơ đồ ghế tương tác.
Bước 4: Hệ thống tự động giữ ghế trong vòng 10 phút kể từ khi Người Mua chọn ghế. Nếu không hoàn tất thanh toán trong 10 phút, ghế sẽ được tự động giải phóng cho người dùng khác.
Bước 5: Người Mua xác nhận đơn hàng và chọn phương thức thanh toán.
Bước 6: Sau khi thanh toán thành công, Người Mua xác nhận thông tin và nhận Vé điện tử (E-Ticket) qua email đã đăng ký.
Bước 7: Người Mua xuất trình mã QR trên Vé điện tử tại cổng vào sự kiện để được check-in.

Lưu ý: Mỗi giao dịch giới hạn tối đa 10 vé. Vé đã mua thành công sẽ hiển thị trong mục "Vé của tôi" trên tài khoản.` },
      { id: 's4', heading: 'IV. Quyền và nghĩa vụ của Ban Tổ Chức',
        content: `1. BTC có quyền đăng tải thông tin sự kiện (tên, mô tả, hình ảnh, thời gian, địa điểm), thiết lập hạng vé và mức giá, tạo sơ đồ ghế tùy chỉnh, theo dõi doanh thu và quản lý đơn hàng thông qua bảng điều khiển.

2. BTC có nghĩa vụ:
   a) Cung cấp thông tin sự kiện chính xác, đầy đủ, không gây nhầm lẫn cho Người Mua.
   b) Đảm bảo sự kiện diễn ra đúng theo thông tin đã đăng tải. Trường hợp hủy hoặc thay đổi lịch trình phải thông báo trước tối thiểu 07 ngày và phối hợp với JoyB để hoàn tiền cho Người Mua.
   c) Chịu trách nhiệm về chất lượng sự kiện và giải quyết khiếu nại liên quan đến nội dung sự kiện.
   d) Không đăng tải nội dung vi phạm pháp luật, xâm phạm quyền sở hữu trí tuệ, hoặc trái đạo đức xã hội.
   e) Thanh toán đầy đủ phí dịch vụ cho JoyB theo thỏa thuận hợp đồng.` },
      { id: 's5', heading: 'V. Quyền và nghĩa vụ của Người Mua',
        content: `1. Người Mua có quyền:
   a) Được cung cấp thông tin đầy đủ, chính xác về sự kiện trước khi quyết định mua vé.
   b) Yêu cầu hoàn vé/hoàn tiền theo chính sách hoàn vé của JoyB và BTC.
   c) Khiếu nại, tố cáo các hành vi gian lận, vi phạm của BTC hoặc JoyB thông qua các kênh hỗ trợ.
   d) Được bảo mật thông tin cá nhân theo Chính sách Bảo mật của JoyB.

2. Người Mua có nghĩa vụ:
   a) Cung cấp thông tin cá nhân chính xác khi đăng ký tài khoản và thực hiện giao dịch.
   b) Không sử dụng bot, script tự động, hoặc các công cụ gian lận để chiếm chỗ ngồi hoặc mua vé với số lượng vượt quá giới hạn.
   c) Không đầu cơ, tích trữ vé cho mục đích bán lại với giá cao hơn giá niêm yết.
   d) Thanh toán đúng hạn trong thời gian giữ ghế (10 phút).
   e) Tuân thủ nội quy tại địa điểm tổ chức sự kiện.` },
      { id: 's6', heading: 'VI. Quyền và trách nhiệm của JoyB',
        content: `1. JoyB có quyền:
   a) Từ chối hoặc gỡ bỏ sự kiện có nội dung vi phạm pháp luật hoặc Quy chế hoạt động.
   b) Tạm khóa hoặc xóa vĩnh viễn tài khoản của thành viên vi phạm.
   c) Thu phí dịch vụ theo thỏa thuận với BTC.
   d) Sử dụng dữ liệu ẩn danh cho mục đích cải thiện dịch vụ và phân tích thị trường.

2. JoyB có trách nhiệm:
   a) Cung cấp nền tảng ổn định, bảo mật, sẵn sàng phục vụ 24/7.
   b) Bảo mật thông tin cá nhân và giao dịch của thành viên theo quy định.
   c) Hỗ trợ giải quyết tranh chấp giữa BTC và Người Mua một cách công bằng.
   d) Thông báo kịp thời khi có thay đổi về Quy chế hoạt động, Điều khoản sử dụng.
   e) Phối hợp với cơ quan nhà nước có thẩm quyền khi được yêu cầu cung cấp thông tin.` },
      { id: 's7', heading: 'VII. Điều khoản áp dụng',
        content: `1. Quy chế này có hiệu lực kể từ ngày được đăng tải trên JoyB.VN. JoyB có quyền sửa đổi, bổ sung Quy chế này vào bất kỳ thời điểm nào. Mọi thay đổi sẽ được thông báo trên Sàn trước ít nhất 05 ngày làm việc.

2. Trong trường hợp có sự mâu thuẫn giữa Quy chế này và các thỏa thuận riêng giữa JoyB với thành viên, các thỏa thuận riêng sẽ được ưu tiên áp dụng.

3. Việc sử dụng dịch vụ của JoyB sau khi Quy chế được sửa đổi đồng nghĩa với việc thành viên chấp nhận các thay đổi đó.

4. Quy chế này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.` }
    ]
  },
  'ticket-sales-terms': {
    title: 'ĐIỀU KHOẢN BÁN VÉ SỰ KIỆN TRÊN SÀN JOYB',
    updated: '03/04/2026',
    sections: [
      { id: 'ts1', heading: 'I. Phạm vi áp dụng',
        content: `Điều khoản bán vé này áp dụng cho tất cả các giao dịch mua bán vé sự kiện được thực hiện trên nền tảng JoyB.VN. Bằng việc tiến hành mua vé, Người Mua xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản được nêu tại đây.

Điều khoản này bổ sung cho Quy chế hoạt động chung của Sàn. Trong trường hợp có mâu thuẫn, Điều khoản bán vé sẽ được ưu tiên áp dụng cho các vấn đề liên quan đến giao dịch mua bán vé.` },
      { id: 'ts2', heading: 'II. Quy trình mua vé',
        content: `1. Người Mua chọn sự kiện và khu vực/ghế ngồi trên Sơ đồ ghế tương tác.
2. Hệ thống tự động giữ ghế trong vòng 10 phút kể từ khi chọn. Trong thời gian này, ghế được dành riêng cho Người Mua và không ai khác có thể đặt mua.
3. Người Mua điền đầy đủ thông tin người nhận vé (họ tên, email, số điện thoại).
4. Người Mua chọn phương thức thanh toán và hoàn tất thanh toán trước khi hết 10 phút giữ chỗ.
5. Nếu không hoàn tất thanh toán trong thời gian quy định, ghế sẽ tự động được giải phóng.
6. Mỗi giao dịch giới hạn tối đa 10 vé.

Lưu ý: Tiến trình mua vé được tự động lưu lại. Nếu xảy ra sự cố (mất kết nối, trình duyệt bị đóng), Người Mua có thể quay lại trang Checkout để tiếp tục từ nơi đã dừng, miễn là thời gian giữ chỗ chưa hết.` },
      { id: 'ts3', heading: 'III. Giá vé và phí dịch vụ',
        content: `1. Giá vé được BTC niêm yết trên trang sự kiện, đã bao gồm thuế VAT (nếu có).
2. Phí dịch vụ nền tảng: 5% giá trị vé, được cộng thêm vào tổng đơn hàng và hiển thị rõ ràng trước khi thanh toán.
3. Tổng số tiền thanh toán = Giá vé + Phí dịch vụ - Giảm giá (nếu có).
4. JoyB Coins có thể được sử dụng để giảm giá theo chính sách gamification hiện hành.
5. Giá vé có thể thay đổi tùy theo đợt mở bán (Early Bird, Regular, Last Minute) do BTC quyết định.` },
      { id: 'ts4', heading: 'IV. Vé điện tử và quyền sử dụng',
        content: `1. Sau khi thanh toán thành công, Vé điện tử (E-Ticket) sẽ được gửi về email đã đăng ký trong vòng 01 phút.
2. Mỗi vé chứa mã QR duy nhất, không thể sao chép hay giả mạo.
3. Vé chỉ có giá trị sử dụng một lần tại cổng check-in của sự kiện.
4. Người Mua có trách nhiệm bảo mật mã QR trên vé. JoyB không chịu trách nhiệm nếu mã QR bị rò rỉ do lỗi của Người Mua.
5. Vé đã sử dụng (đã quét check-in) không thể hoàn trả hoặc chuyển nhượng.` },
      { id: 'ts5', heading: 'V. Chính sách hoàn vé của BTC',
        content: `1. Chính sách hoàn vé do mỗi BTC quyết định và được công bố trên trang sự kiện.
2. Trường hợp sự kiện bị HỦY bởi BTC: Hoàn 100% giá trị vé, không phí.
3. Trường hợp sự kiện bị HOÃN: Vé tự động có giá trị cho ngày tổ chức mới. Nếu Người Mua không thể tham dự ngày mới, được hoàn vé theo chính sách của BTC.
4. Yêu cầu hoàn vé từ phía Người Mua (không phải do lỗi BTC):
   a) Trong vòng 24 giờ sau mua: Hoàn 95%, phí xử lý 5%.
   b) Sau 24 - 72 giờ: Hoàn 90%, phí xử lý 10%.
   c) Sau 72 giờ: KHÔNG hỗ trợ hoàn vé.
5. Vé mua trong chương trình Flash Sale hoặc có ghi "KHÔNG HOÀN VÉ" sẽ không được hoàn trả.` },
      { id: 'ts6', heading: 'VI. Nghiêm cấm đầu cơ và bán lại vé',
        content: `1. Nghiêm cấm sử dụng bot, script tự động, hoặc bất kỳ công cụ nào để chiếm giữ ghế hoặc mua vé với số lượng vượt quá giới hạn.
2. Nghiêm cấm bán lại vé với giá cao hơn giá niêm yết (phe vé / scalping).
3. Nếu phát hiện hành vi đầu cơ, JoyB có quyền:
   a) Hủy toàn bộ vé vi phạm mà không hoàn tiền.
   b) Khóa vĩnh viễn tài khoản vi phạm.
   c) Chuyển hồ sơ cho cơ quan pháp luật xử lý (nếu nghiêm trọng).` },
      { id: 'ts7', heading: 'VII. Trách nhiệm các bên',
        content: `1. JoyB chịu trách nhiệm:
   a) Đảm bảo hệ thống hoạt động ổn định trong quá trình mua vé.
   b) Bảo mật thông tin thanh toán của Người Mua.
   c) Hỗ trợ giải quyết sự cố kỹ thuật liên quan đến giao dịch.

2. BTC chịu trách nhiệm:
   a) Tổ chức sự kiện đúng theo thông tin đã công bố.
   b) Xử lý hoàn vé theo chính sách đã cam kết.
   c) Đảm bảo hệ thống check-in hoạt động chính xác.

3. Người Mua chịu trách nhiệm:
   a) Cung cấp thông tin chính xác khi mua vé.
   b) Hoàn tất thanh toán trong thời gian giữ chỗ.
   c) Bảo mật vé điện tử và mã QR của mình.` }
    ]
  },
  'privacy-policy': {
    title: 'CHÍNH SÁCH BẢO MẬT THÔNG TIN CÁ NHÂN CỦA NGƯỜI TIÊU DÙNG TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'p1', heading: 'I. Mục đích và phạm vi thu thập thông tin', content: 'JoyB thu thập thông tin cá nhân của Người dùng khi: Đăng ký tài khoản (Họ tên, email, số điện thoại, ngày sinh). Thực hiện giao dịch mua vé (Địa chỉ, thông tin thanh toán). Liên hệ hỗ trợ khách hàng. Tham gia các chương trình khuyến mãi. Ngoài ra, hệ thống tự động thu thập: Địa chỉ IP, loại trình duyệt, thiết bị sử dụng, thời gian truy cập, các trang đã xem, hành vi tương tác trên Sàn thông qua cookies và công nghệ theo dõi tương tự.' },
      { id: 'p2', heading: 'II. Phạm vi sử dụng thông tin', content: 'Thông tin thu thập được JoyB sử dụng cho các mục đích: Xử lý đơn hàng, giao vé điện tử. Quản lý tài khoản người dùng. Cung cấp dịch vụ hỗ trợ khách hàng. Gửi thông báo về sự kiện, chương trình khuyến mãi (khi Người dùng đồng ý). Cải thiện trải nghiệm người dùng và phát triển tính năng mới. Phân tích và thống kê lưu lượng truy cập. Ngăn chặn gian lận và hoạt động bất hợp pháp. Tuân thủ các nghĩa vụ pháp lý.' },
      { id: 'p3', heading: 'III. Thời gian lưu trữ', content: 'Thông tin cá nhân của Người dùng sẽ được lưu trữ cho đến khi Người dùng yêu cầu xóa tài khoản, hoặc trong thời hạn tối thiểu là 03 năm kể từ giao dịch cuối cùng theo quy định pháp luật về lưu trữ chứng từ giao dịch điện tử.' },
      { id: 'p4', heading: 'IV. Những người hoặc tổ chức có thể tiếp cận thông tin', content: 'Các bên được quyền tiếp cận thông tin bao gồm: Ban Tổ Chức sự kiện (chỉ tên và email để xác nhận vé). Đối tác cổng thanh toán (thông tin cần thiết để xử lý giao dịch). Đội ngũ nhân viên JoyB được phân quyền (trong phạm vi nhiệm vụ). Cơ quan nhà nước có thẩm quyền (khi có yêu cầu bằng văn bản hợp lệ). JoyB cam kết KHÔNG bán, cho thuê, hoặc trao đổi thông tin cá nhân của Người dùng cho bất kỳ bên thứ ba nào vì mục đích thương mại.' },
      { id: 'p5', heading: 'V. Cam kết bảo mật', content: 'JoyB cam kết bảo mật toàn bộ thông tin cá nhân bằng các biện pháp: Mã hóa SSL/TLS 256-bit cho mọi kết nối. Mật khẩu được băm (hash) bằng thuật toán bcrypt, không thể khôi phục. Hệ thống tường lửa (Firewall) và giám sát an ninh mạng 24/7. Sao lưu dữ liệu tự động hàng ngày tại nhiều trung tâm dữ liệu. Kiểm tra bảo mật định kỳ bởi bên thứ ba độc lập (Penetration Testing). Tuân thủ tiêu chuẩn PCI-DSS cho xử lý thanh toán.' },
      { id: 'p6', heading: 'VI. Quyền của Người dùng', content: 'Người dùng có quyền: Truy cập và xem lại thông tin cá nhân đã cung cấp. Yêu cầu chỉnh sửa thông tin không chính xác. Yêu cầu xóa tài khoản và toàn bộ dữ liệu cá nhân. Từ chối nhận email tiếp thị / thông báo quảng cáo. Yêu cầu xuất (export) dữ liệu cá nhân ở định dạng phổ biến. Khiếu nại về việc xử lý dữ liệu cá nhân. Mọi yêu cầu sẽ được xử lý trong vòng 07 ngày làm việc.' }
    ]
  },
  'dispute-resolution': {
    title: 'CƠ CHẾ GIẢI QUYẾT TRANH CHẤP, KHIẾU NẠI TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'd1', heading: 'I. Nguyên tắc giải quyết', content: 'JoyB cam kết giải quyết mọi tranh chấp và khiếu nại một cách công bằng, minh bạch, kịp thời. Các bên được khuyến khích ưu tiên thương lượng, hòa giải trước khi tiến hành các thủ tục pháp lý. Quyền và lợi ích hợp pháp của cả Người Mua và Ban Tổ Chức đều được JoyB tôn trọng và bảo vệ.' },
      { id: 'd2', heading: 'II. Quy trình tiếp nhận và xử lý khiếu nại', content: 'Bước 1: Người khiếu nại gửi yêu cầu qua email support@joyb.vn hoặc form khiếu nại trên Sàn trong vòng 48 giờ kể từ khi phát sinh vấn đề. Nội dung gồm: thông tin tài khoản, mã đơn hàng, mô tả chi tiết vấn đề, bằng chứng kèm theo (nếu có).\n\nBước 2: JoyB xác nhận tiếp nhận khiếu nại trong vòng 24 giờ làm việc.\n\nBước 3: JoyB tiến hành xác minh, điều tra, thu thập thông tin từ các bên liên quan (tối đa 05 ngày làm việc).\n\nBước 4: JoyB đưa ra phương án giải quyết và thông báo kết quả bằng văn bản (email) đến các bên.\n\nBước 5: Nếu các bên không đồng ý với kết quả, tranh chấp sẽ được chuyển đến cơ quan giải quyết tranh chấp có thẩm quyền.' },
      { id: 'd3', heading: 'III. Các trường hợp được hỗ trợ giải quyết', content: '• Sự kiện bị hủy hoặc hoãn mà Người Mua không được thông báo trước.\n• Chất lượng sự kiện không đúng như thông tin đã quảng cáo trên Sàn.\n• Lỗi hệ thống dẫn đến thanh toán sai, tính phí trùng lặp, hoặc mất vé.\n• Vé không hợp lệ tại cổng kiểm soát dù đã thanh toán thành công.\n• Không nhận được Vé điện tử sau khi thanh toán thành công quá 02 giờ.\n• Tranh chấp về quyền sở hữu vé giữa các Người Mua.' },
      { id: 'd4', heading: 'IV. Phương án bồi thường', content: 'Tùy theo từng trường hợp cụ thể, JoyB có thể áp dụng: Hoàn tiền 100% giá trị vé (đối với sự kiện bị hủy bởi BTC). Hoàn tiền một phần kết hợp voucher bồi thường. Cấp voucher giá trị tương đương để sử dụng cho sự kiện khác. Đổi vé sang suất diễn/ngày khác (nếu BTC đồng ý). Quyết định cuối cùng dựa trên kết quả điều tra, bằng chứng, và các thỏa thuận giữa JoyB với BTC.' },
      { id: 'd5', heading: 'V. Cơ quan giải quyết tranh chấp', content: 'Nếu tranh chấp không thể giải quyết thông qua thương lượng, các bên có thể đưa vụ việc ra:\n• Trung tâm Trọng tài Quốc tế Việt Nam (VIAC).\n• Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh.\nLuật áp dụng: Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam.' }
    ]
  },
  'payment-privacy': {
    title: 'CHÍNH SÁCH BẢO MẬT THANH TOÁN TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'pp1', heading: 'I. Chính sách bảo mật thanh toán', content: 'Mọi giao dịch thanh toán trên JoyB đều được xử lý thông qua các cổng thanh toán đạt chuẩn quốc tế PCI-DSS Level 1 — tiêu chuẩn bảo mật cao nhất trong ngành thanh toán. JoyB cam kết KHÔNG LƯU TRỮ bất kỳ thông tin thẻ tín dụng / ghi nợ nào trên hệ thống. Toàn bộ dữ liệu giao dịch được mã hóa bằng SSL/TLS 256-bit trong quá trình truyền tải.' },
      { id: 'pp2', heading: 'II. Các biện pháp bảo mật giao dịch', content: '• Xác thực 3D Secure (Verified by Visa / Mastercard SecureCode) cho mọi giao dịch thẻ quốc tế.\n• Xác thực OTP (One-Time Password) qua SMS hoặc ứng dụng ngân hàng.\n• Hệ thống phát hiện gian lận (Fraud Detection System) tự động phân tích hành vi giao dịch bất thường.\n• Giới hạn số lần thử thanh toán thất bại: Tối đa 05 lần / giờ. Sau đó tài khoản sẽ bị tạm khóa chức năng thanh toán trong 01 giờ.\n• Giao dịch có giá trị cao (≥ 20.000.000 VND) yêu cầu xác minh bổ sung.' },
      { id: 'pp3', heading: 'III. Quy trình xử lý giao dịch lỗi', content: 'Trường hợp giao dịch bị lỗi (mất kết nối, timeout, lỗi cổng thanh toán): Hệ thống tự động kiểm tra trạng thái giao dịch với cổng thanh toán. Nếu tiền đã bị trừ nhưng chưa nhận vé, đội ngũ hỗ trợ sẽ xử lý trong vòng 02 giờ làm việc. Nếu xác nhận giao dịch thất bại, tiền sẽ được hoàn lại qua phương thức thanh toán ban đầu trong 05-15 ngày làm việc tùy ngân hàng.' }
    ]
  },
  'return-policy': {
    title: 'CHÍNH SÁCH ĐỔI TRẢ VÀ KIỂM HÀNG TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'r1', heading: 'I. Điều kiện hoàn vé', content: 'Vé có thể được hoàn trả trong các trường hợp sau:\n• Sự kiện bị hủy bởi Ban Tổ Chức: Hoàn 100% giá trị vé, không phí.\n• Yêu cầu hoàn trả trong vòng 24 giờ sau mua: Hoàn 95% giá trị, phí xử lý 5%.\n• Yêu cầu hoàn trả trong 24 - 72 giờ sau mua: Hoàn 90% giá trị, phí xử lý 10%.\n• BTC đồng ý hoàn vé theo chính sách riêng của sự kiện.' },
      { id: 'r2', heading: 'II. Trường hợp KHÔNG hoàn vé', content: '• Quá 72 giờ kể từ thời điểm mua.\n• Sự kiện đã diễn ra (kể cả khi Người Mua không tham dự).\n• Vé đã được quét QR check-in tại cổng vào.\n• Vé mua trong chương trình Flash Sale hoặc khuyến mãi đặc biệt có ghi rõ "KHÔNG HOÀN VÉ".\n• Người Mua vi phạm Quy chế sử dụng dẫn đến khóa tài khoản.' },
      { id: 'r3', heading: 'III. Quy trình hoàn tiền', content: 'Bước 1: Gửi yêu cầu hoàn vé tại mục "Vé của tôi" trên trang web hoặc email support@joyb.vn.\nBước 2: Đội ngũ JoyB xác minh yêu cầu trong 01-03 ngày làm việc.\nBước 3: Nếu đủ điều kiện, tiền được hoàn qua phương thức thanh toán ban đầu.\nBước 4: Thời gian nhận hoàn tiền: 05-15 ngày làm việc tùy ngân hàng phát hành.' },
      { id: 'r4', heading: 'IV. Kiểm tra vé', content: 'Vé điện tử phát hành bởi JoyB được đảm bảo về tính hợp lệ. Mỗi vé chứa mã QR duy nhất, không thể giả mạo. Người Mua có thể kiểm tra trạng thái vé bất cứ lúc nào trong mục "Vé của tôi". Nếu phát hiện vé bất thường, vui lòng liên hệ ngay support@joyb.vn.' }
    ]
  },
  'shipping-policy': {
    title: 'ĐIỀU KIỆN VẬN CHUYỂN VÀ GIAO NHẬN TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'sh1', heading: 'I. Hình thức giao vé', content: 'Toàn bộ vé trên JoyB là VÉ ĐIỆN TỬ (E-Ticket). Vé được giao ngay lập tức qua email sau khi thanh toán thành công. Không cần in vé giấy — chỉ cần xuất trình mã QR trên điện thoại tại cổng check-in.' },
      { id: 'sh2', heading: 'II. Thời gian giao vé', content: 'Thanh toán bằng thẻ tín dụng / ví điện tử: Nhận vé ngay lập tức (dưới 01 phút).\nChuyển khoản ngân hàng: Nhận vé trong 15 - 60 phút sau khi hệ thống xác nhận khoản thanh toán.\nNếu không nhận được vé sau 02 giờ, vui lòng kiểm tra hộp thư Spam / Junk hoặc liên hệ support@joyb.vn.' },
      { id: 'sh3', heading: 'III. Nội dung vé điện tử', content: 'Mỗi Vé điện tử bao gồm: Mã QR duy nhất (dùng để check-in). Mã đặt vé (Booking Code). Tên sự kiện, ngày giờ, địa điểm. Hạng vé và vị trí ghế (nếu có). Thông tin Người Mua. Điều khoản sử dụng vé. Người Mua có trách nhiệm kiểm tra thông tin trên vé ngay sau khi nhận và thông báo cho JoyB nếu phát hiện sai sót.' }
    ]
  },
  'payment-methods': {
    title: 'CÁC PHƯƠNG THỨC THANH TOÁN TRÊN SÀN THƯƠNG MẠI ĐIỆN TỬ JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'pm0', heading: 'Giới thiệu', content: 'Người tham gia sự kiện có thể tham khảo các phương thức thanh toán sau đây và lựa chọn phương thức thanh toán phù hợp:' },
      { id: 'pm1', heading: 'Cách 1: Thanh toán qua thẻ Visa/Master/JCB', content: '1. Người mua tìm hiểu thông tin về sự kiện và nhà tổ chức sự kiện đó;\n2. Người mua xác thực đơn hàng (điện thoại, tin nhắn, email);\n3. Người bán xác nhận thông tin Người mua;\n4. Người mua chọn phương thức thanh toán qua thẻ Visa/Master/JCB và thanh toán. Phí thanh toán tùy thuộc vào từng loại thẻ quý khách đang dùng và ngân hàng phát hành thẻ. Vui lòng liên hệ với ngân hàng phát hành thẻ để biết rõ phí thanh toán phát sinh;\n5. Người bán chuyển vé;\n6. Người mua nhận vé.' },
      { id: 'pm2', heading: 'Cách 2: Thanh toán qua ví điện tử MoMo', content: '1. Người mua tìm hiểu thông tin về sự kiện và nhà tổ chức;\n2. Người mua xác thực đơn hàng;\n3. Hệ thống chuyển hướng đến app MoMo để xác nhận thanh toán;\n4. Người mua xác nhận giao dịch bằng mã OTP hoặc vân tay;\n5. Vé được gửi ngay sau khi thanh toán thành công;\n6. Người mua kiểm tra vé trong mục "Vé của tôi".' },
      { id: 'pm3', heading: 'Cách 3: Thanh toán qua VNPay-QR', content: '1. Người mua chọn sự kiện và xác nhận đơn hàng;\n2. Chọn phương thức thanh toán VNPay;\n3. Hệ thống hiển thị mã QR hoặc chuyển hướng đến cổng VNPay;\n4. Người mua quét mã QR bằng app VNPay hoặc ứng dụng Mobile Banking;\n5. Xác nhận giao dịch trên ứng dụng ngân hàng;\n6. Nhận vé điện tử qua email ngay lập tức.\n\nVNPay hỗ trợ hơn 40 ngân hàng nội địa Việt Nam.' },
      { id: 'pm4', heading: 'Cách 4: Chuyển khoản ngân hàng', content: '1. Người mua chọn phương thức "Chuyển khoản ngân hàng";\n2. Hệ thống hiển thị thông tin tài khoản thụ hưởng và mã QR chuyển khoản nhanh;\n3. Nội dung chuyển khoản được tự động điền (KHÔNG ĐƯỢC sửa đổi nội dung);\n4. Người mua thực hiện chuyển khoản qua Internet Banking hoặc quét mã QR;\n5. Hệ thống tự động xác nhận thanh toán trong 15-60 phút;\n6. Vé điện tử được gửi qua email sau khi xác nhận.' }
    ]
  },
  'prohibited-goods': {
    title: 'HÀNG HOÁ, DỊCH VỤ CẤM KINH DOANH TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'pg1', heading: 'I. Nguyên tắc', content: 'JoyB là nền tảng chuyên cung cấp dịch vụ mua bán vé sự kiện. Các loại hàng hóa, dịch vụ sau đây bị NGHIÊM CẤM đăng bán hoặc quảng cáo trên Sàn:' },
      { id: 'pg2', heading: 'II. Danh mục cấm', content: '• Vé giả, vé nhái, vé photocopy, hoặc vé không được phát hành bởi JoyB.\n• Vé đã qua sử dụng (đã quét QR check-in).\n• Sự kiện vi phạm pháp luật Việt Nam, trái đạo đức, thuần phong mỹ tục.\n• Sự kiện có nội dung kích động bạo lực, phân biệt chủng tộc, tôn giáo.\n• Sự kiện liên quan đến cờ bạc, cá cược dưới mọi hình thức.\n• Dịch vụ liên quan đến chất cấm, ma túy, các chất kích thích bị pháp luật cấm.\n• Vũ khí, đạn dược, vật liệu nổ.\n• Dịch vụ tài chính trái phép (tín dụng đen, đa cấp biến tướng).\n• Nội dung xâm phạm quyền sở hữu trí tuệ của bên thứ ba.\n• Bất kỳ hàng hóa, dịch vụ nào thuộc danh mục cấm theo quy định tại Nghị định 52/2013/NĐ-CP và các văn bản pháp luật liên quan.' }
    ]
  },
  'content-rules': {
    title: 'QUY ĐỊNH VỀ NỘI DUNG VÀ HÌNH ẢNH TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'cr1', heading: 'I. Quy định nội dung đăng tải', content: '• Thông tin sự kiện phải chính xác, đầy đủ, không gây nhầm lẫn.\n• Hình ảnh phải rõ nét, không chứa watermark của bên thứ ba.\n• Nghiêm cấm sử dụng hình ảnh khiêu dâm, bạo lực, phản cảm.\n• Nội dung mô tả phải bằng tiếng Việt hoặc song ngữ Việt-Anh.\n• Không được chèn link dẫn đến website bên ngoài JoyB.\n• Giá vé phải được niêm yết rõ ràng, bao gồm thuế (nếu có).' },
      { id: 'cr2', heading: 'II. Quyền sở hữu trí tuệ', content: 'BTC chịu trách nhiệm đảm bảo toàn bộ nội dung đăng tải (văn bản, hình ảnh, video, âm nhạc) không xâm phạm quyền sở hữu trí tuệ của bất kỳ bên thứ ba nào. JoyB có quyền gỡ bỏ nội dung vi phạm mà không cần thông báo trước.' },
      { id: 'cr3', heading: 'III. Xử lý vi phạm', content: 'Vi phạm lần đầu: Cảnh cáo bằng email và yêu cầu chỉnh sửa trong 24 giờ.\nVi phạm lần hai: Gỡ bỏ sự kiện vi phạm, tạm khóa quyền đăng sự kiện 30 ngày.\nVi phạm nghiêm trọng hoặc tái phạm: Khóa vĩnh viễn tài khoản BTC và chuyển hồ sơ cho cơ quan pháp luật xử lý.' }
    ]
  },
  'advertising-rules': {
    title: 'HÀNG HOÁ, DỊCH VỤ HẠN CHẾ QUẢNG CÁO TRÊN SÀN JOYB',
    updated: '27/03/2026',
    sections: [
      { id: 'ar1', heading: 'I. Nguyên tắc quảng cáo', content: 'Quảng cáo trên JoyB phải tuân thủ Luật Quảng cáo 2012 và các quy định pháp luật liên quan. Nội dung quảng cáo phải trung thực, chính xác, không gây nhầm lẫn cho người tiêu dùng.' },
      { id: 'ar2', heading: 'II. Các loại hình quảng cáo hạn chế', content: '• Quảng cáo rượu, bia, thuốc lá tại các sự kiện không dành cho đối tượng từ 18 tuổi trở lên.\n• Quảng cáo dịch vụ y tế, dược phẩm chưa được cấp phép.\n• Quảng cáo so sánh trực tiếp với các nền tảng bán vé khác.\n• Quảng cáo có tính chất cường điệu, phóng đại về chất lượng sự kiện.\n• Pop-up quảng cáo cản trở trải nghiệm người dùng trên Sàn.' },
      { id: 'ar3', heading: 'III. Chế tài xử lý', content: 'JoyB có quyền từ chối hoặc gỡ bỏ bất kỳ nội dung quảng cáo nào vi phạm quy định. BTC chịu hoàn toàn trách nhiệm pháp lý đối với nội dung quảng cáo của mình trên Sàn. Phí quảng cáo đã thanh toán sẽ KHÔNG được hoàn trả trong trường hợp quảng cáo bị gỡ bỏ do vi phạm.' }
    ]
  }
};

const LegalPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const activeSlug = slug || 'terms-of-service';
  const page = pages[activeSlug];

  useEffect(() => { window.scrollTo(0, 0); }, [activeSlug]);

  if (!page) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-white dark:bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Trang này không tồn tại.</p>
          <Link to="/legal/terms-of-service" className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm">Về Quy chế hoạt động</Link>
        </div>
      </div>
    );
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex-grow bg-white min-h-screen" style={{ color: '#1a1a1a' }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Trang chủ</Link>
            <span>{'>'}</span>
            <span className="text-gray-700 font-medium">Quy chế hoạt động</span>
            <span>{'>'}</span>
            <span className="text-black font-semibold">{sidebar[0].items.find(i => i.slug === activeSlug)?.label || page.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 shrink-0 border-r border-gray-200 py-8 pr-6 pl-6 hidden lg:block sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link to="/" className="flex items-center space-x-2 mb-6 text-gray-500 hover:text-black transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
            <span>Trang chủ</span>
          </Link>
          {sidebar.map(group => (
            <div key={group.group}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{group.group}</h4>
              <ul className="space-y-1">
                {group.items.map(item => (
                  <li key={item.slug}>
                    <Link
                      to={`/legal/${item.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSlug === item.slug
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-3 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main ref={contentRef} className="flex-1 py-10 px-8 lg:px-12 min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{page.title} <span className="text-gray-300 text-lg">#</span></h1>
          <p className="text-sm text-gray-400 mb-8">Cập nhật lần cuối: {page.updated}</p>

          <div className="space-y-10">
            {page.sections.map(section => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{section.heading}</h2>
                <div className="text-gray-700 text-[15px] leading-[1.8] whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>

          {/* Contribution */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-400 text-sm mb-3">Bạn cần hỗ trợ thêm?</p>
            <div className="flex items-center justify-center space-x-4">
              <a href="mailto:support@joyb.vn" className="px-5 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm">Email hỗ trợ</a>
              <Link to="/info/contact" className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">Liên hệ</Link>
            </div>
          </div>
        </main>

        {/* RIGHT TOC */}
        <aside className="w-56 shrink-0 py-10 pl-6 hidden xl:block sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">On This Page</h4>
          <ul className="space-y-2 border-l-2 border-gray-100 pl-4">
            {page.sections.map(section => (
              <li key={section.id}>
                <button onClick={() => scrollToSection(section.id)} className="text-left text-sm text-gray-500 hover:text-blue-600 transition-colors leading-snug w-full truncate">
                  {section.heading}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <a href="mailto:support@joyb.vn" className="text-sm text-gray-400 hover:text-blue-600 transition-colors flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <span>Đóng góp ý kiến</span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LegalPage;
