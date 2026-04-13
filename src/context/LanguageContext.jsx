import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  vi: {
    // ── Navigation & Header ──
    home: 'Trang chủ',
    aboutUs: 'Về chúng tôi',
    hostEvent: '+ Tạo sự kiện',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm sự kiện, nghệ sĩ...',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    myProfile: 'Hồ sơ cá nhân',
    myTickets: 'Lịch sử & vé của tôi',
    myEvents: 'Sự kiện của tôi',
    settings: 'Cài đặt',

    // ── Hero Section ──
    heroTitle: 'Đặt vé sự kiện Online\ntrên',
    heroBrand: 'joyb',
    heroSubtitle: 'Với nhiều ưu đãi hấp dẫn và kết nối với tất cả các sự kiện lớn phủ rộng khắp Việt Nam. Đặt vé ngay tại joyb!',
    heroBullet1: 'Mua vé Online,',
    heroBullet1Bold: 'trải nghiệm sự kiện đỉnh cao',
    heroBullet2Bold: 'Đặt vé an toàn',
    heroBullet2: 'trên joyb',
    heroBullet3: 'Tha hồ',
    heroBullet3Bold: 'chọn chỗ ngồi',
    heroBullet3Suffix: ', thanh toán tiện lợi.',
    heroBullet4Bold: 'Lịch sử đặt vé',
    heroBullet4: 'được lưu lại ngay',
    heroCTA: 'ĐẶT VÉ NGAY',

    // ── Event Browsing ──
    upcomingEvents: 'Sự kiện sắp tới',
    allEvents: 'Xem tất cả',
    eventDate: 'Ngày diễn ra',
    eventVenue: 'Địa điểm',
    organizedBy: 'Được tổ chức bởi',
    fromPrice: 'Từ',
    soldOut: 'Hết vé',
    getTickets: 'Mua vé',

    // ── EventDetail ──
    back: 'Quay lại',
    ticketTiers: 'Hạng vé',
    bestValue: 'Giá tốt',
    aboutEvent: 'Giới thiệu sự kiện',
    seatViewAR: 'Góc nhìn ghế (AR)',
    ticketsSelected: (n) => `${n} vé đã chọn`,
    clearAll: 'Xoá tất cả',
    section: 'Khu vực',
    row: 'Hàng',
    seat: 'Ghế',
    subtotal: 'Tạm tính',
    selectSeatsHint: 'Chọn ghế trên sơ đồ để tiếp tục',
    continue: 'Tiếp tục',
    selectTicket: 'Chọn vé',
    noSeatMap: 'Chưa có sơ đồ ghế',
    noSeatMapDesc: 'Sự kiện này chưa được thiết lập sơ đồ chỗ ngồi. Vui lòng liên hệ ban tổ chức.',
    buyNow: 'MUA VÉ NGAY',
    flashSale: 'FLASH SALE',

    // ── DotGridSeatMap ──
    stage: 'Sân khấu',
    reset: 'Đặt lại',
    selecting: 'Đang chọn',
    unavailable: 'Không chọn được',

    // ── SeatMap ──
    all: 'Tất cả',
    remaining: 'còn',
    general: 'Chung',
    seatsAvailable: 'ghế trống',

    // ── Checkout ──
    checkout: 'THANH TOÁN',
    checkoutSubtitle: 'Hoàn tất thông tin và thanh toán',
    ticketReceiverInfo: 'Thông tin người nhận vé',
    fullName: 'Họ và Tên',
    emailLabel: 'Địa chỉ Email',
    emailHint: 'Vé điện tử sẽ được gửi về email này.',
    phoneLabel: 'Số điện thoại',
    phoneHint: 'Hỗ trợ khi có sự cố',
    orderSummary: 'Tóm tắt đơn hàng',
    serviceFee: 'Phí dịch vụ',
    grandTotal: 'Tổng thanh toán',
    paymentMethod: 'Chọn phương thức thanh toán',
    bankTransfer: 'Chuyển khoản ngân hàng',
    creditCard: 'Thẻ tín dụng / ghi nợ',
    eWallet: 'Ví điện tử',
    agreeTerms: 'Tôi đồng ý với điều khoản bán vé của ban tổ chức và chính sách',
    placeOrder: 'Thanh toán ngay',
    backToSeats: 'Quay lại chọn ghế',
    invoiceExport: 'Xuất hóa đơn',
    companyName: 'Tên công ty',
    taxCode: 'Mã số thuế',

    // ── CheckoutTimer ──
    holdTitle: 'Giữ chỗ cho bạn',
    holdSubtitle: 'Hoàn tất thanh toán trước khi hết thời gian',
    expiredTitle: 'Hết thời gian giữ chỗ',
    expiredDescription: 'Rất tiếc, thời gian 10 phút đã hết. Ghế của bạn đã được trả lại.',
    checkoutTimePrefix: 'Bạn có',
    checkoutTimeSuffix: 'để hoàn tất mua vé',
    checkoutPriceLocked: 'Giá vé của bạn sẽ được giữ nguyên trong thời gian này',
    summary: 'Tóm tắt',
    total: 'Tổng cộng',
    start: 'Bắt đầu',
    termsAgreed: 'Bằng việc nhấn "Bắt đầu", bạn đồng ý với Điều khoản dịch vụ',

    // ── My Tickets ──
    myTicketsTitle: 'Lịch sử & vé của tôi',
    noTicketsYet: 'Bạn chưa mua vé nào',
    viewTicket: 'Xem vé',
    downloadTicket: 'Tải vé',

    // ── Auth ──
    loginTitle: 'Đăng nhập tài khoản',
    registerTitle: 'Tạo tài khoản mới',
    password: 'Mật khẩu',
    confirmPassword: 'Nhập lại mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?',

    // ── Footer ──
    footerAbout: 'Nền tảng đặt vé sự kiện hàng đầu Việt Nam',
    footerContact: 'Liên hệ',
    footerTerms: 'Điều khoản sử dụng',
    footerPrivacy: 'Chính sách bảo mật',
    footerCopyright: '© 2026 JoyB. Mọi quyền được bảo lưu.',

    // ── Success ──
    orderSuccess: 'Đặt vé thành công!',
    orderSuccessDesc: 'Vé điện tử đã được gửi về email của bạn.',
    backToHome: 'Về trang chủ',
  },

  en: {
    // ── Navigation & Header ──
    home: 'Home',
    aboutUs: 'About Us',
    hostEvent: '+ Host Event',
    search: 'Search',
    searchPlaceholder: 'Find events, artists...',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Log Out',
    myProfile: 'My Profile',
    myTickets: 'My Tickets & History',
    myEvents: 'My Events',
    settings: 'Settings',

    // ── Hero Section ──
    heroTitle: 'Book event tickets Online\non',
    heroBrand: 'joyb',
    heroSubtitle: 'Discover amazing deals and connect with the biggest events across Vietnam. Book your tickets now on joyb!',
    heroBullet1: 'Buy tickets Online,',
    heroBullet1Bold: 'experience world-class events',
    heroBullet2Bold: 'Book safely',
    heroBullet2: 'on joyb',
    heroBullet3: 'Freely',
    heroBullet3Bold: 'choose your seats',
    heroBullet3Suffix: ', pay with ease.',
    heroBullet4Bold: 'Booking history',
    heroBullet4: 'saved instantly',
    heroCTA: 'BOOK NOW',

    // ── Event Browsing ──
    upcomingEvents: 'Upcoming Events',
    allEvents: 'View All',
    eventDate: 'Event Date',
    eventVenue: 'Venue',
    organizedBy: 'Organized by',
    fromPrice: 'From',
    soldOut: 'Sold Out',
    getTickets: 'Get Tickets',

    // ── EventDetail ──
    back: 'Back',
    ticketTiers: 'Ticket Tiers',
    bestValue: 'Best Value',
    aboutEvent: 'About the event',
    seatViewAR: 'Seat View (AR)',
    ticketsSelected: (n) => `${n} Ticket${n > 1 ? 's' : ''} selected`,
    clearAll: 'Clear All',
    section: 'Section',
    row: 'Row',
    seat: 'Seat',
    subtotal: 'Subtotal',
    selectSeatsHint: 'Select seats on the map to continue',
    continue: 'Continue',
    selectTicket: 'Select',
    noSeatMap: 'No seat map available',
    noSeatMapDesc: 'This event does not have a seating chart yet. Please contact the organizer.',
    buyNow: 'BUY TICKETS',
    flashSale: 'FLASH SALE',

    // ── DotGridSeatMap ──
    stage: 'Stage',
    reset: 'Reset',
    selecting: 'Selecting',
    unavailable: 'Unavailable',

    // ── SeatMap ──
    all: 'All',
    remaining: 'left',
    general: 'General',
    seatsAvailable: 'seats available',

    // ── Checkout ──
    checkout: 'CHECKOUT',
    checkoutSubtitle: 'Complete your information and payment',
    ticketReceiverInfo: 'Ticket Receiver Information',
    fullName: 'Full Name',
    emailLabel: 'Email Address',
    emailHint: 'Your e-ticket will be sent to this email.',
    phoneLabel: 'Phone Number',
    phoneHint: 'For support and assistance',
    orderSummary: 'Order Summary',
    serviceFee: 'Service Fee',
    grandTotal: 'Grand Total',
    paymentMethod: 'Select payment method',
    bankTransfer: 'Bank Transfer',
    creditCard: 'Credit / Debit Card',
    eWallet: 'E-Wallet',
    agreeTerms: 'I agree to the organizer\'s ticket terms and privacy policy',
    placeOrder: 'Place Order',
    backToSeats: 'Back to seat selection',
    invoiceExport: 'Export Invoice',
    companyName: 'Company Name',
    taxCode: 'Tax Code',

    // ── CheckoutTimer ──
    holdTitle: 'Holding your seats',
    holdSubtitle: 'Complete payment before time runs out',
    expiredTitle: 'Seat hold expired',
    expiredDescription: 'Sorry, your 10-minute hold has expired. Your seats have been released.',
    checkoutTimePrefix: 'You have',
    checkoutTimeSuffix: 'to complete your purchase',
    checkoutPriceLocked: 'The price of your tickets will be locked during this time',
    summary: 'Summary',
    total: 'Total',
    start: 'Start',
    termsAgreed: 'By clicking "Start", you agree to our Terms of Service',

    // ── My Tickets ──
    myTicketsTitle: 'My Tickets & History',
    noTicketsYet: 'You haven\'t purchased any tickets yet',
    viewTicket: 'View Ticket',
    downloadTicket: 'Download',

    // ── Auth ──
    loginTitle: 'Sign in to your account',
    registerTitle: 'Create a new account',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',

    // ── Footer ──
    footerAbout: 'Vietnam\'s leading event ticket booking platform',
    footerContact: 'Contact',
    footerTerms: 'Terms of Service',
    footerPrivacy: 'Privacy Policy',
    footerCopyright: '© 2026 JoyB. All rights reserved.',

    // ── Success ──
    orderSuccess: 'Booking Confirmed!',
    orderSuccessDesc: 'Your e-ticket has been sent to your email.',
    backToHome: 'Back to Home',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('vibee_lang') || 'vi');

  useEffect(() => {
    localStorage.setItem('vibee_lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.vi;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export default LanguageContext;
