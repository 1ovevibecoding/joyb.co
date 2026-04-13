import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:5000';

// Helper to handle guest session ID
const getGuestId = () => {
  let gid = sessionStorage.getItem('joyb_guest_id');
  if (!gid) {
    gid = 'guest_' + crypto.randomUUID();
    sessionStorage.setItem('joyb_guest_id', gid);
  }
  return gid;
};

const localDict = {
    vi: {
        header: 'THANH TOÁN',
        timeLeft: 'THỜI GIAN',
        expired: 'Hết thời gian giữ chỗ! Ghế của bạn đã được giải phóng.',
        emptyCart: 'Giỏ vé trống',
        goBack: 'Quay lại',
        deliveryAddress: 'Địa chỉ giao hàng',
        required: 'Bắt buộc',
        optional: 'Tuỳ chọn',
        firstName: 'Tên',
        lastName: 'Họ',
        email: 'Email nhận vé',
        phone: 'Số điện thoại di động',
        emailSub: 'E-Ticket sẽ được gửi về địa chỉ này.',
        country: 'Quốc gia',
        eventPartners: 'Đối tác sự kiện',
        partnerSub: 'Đừng bỏ lỡ! Bạn có thể nhận thông tin cập nhật về sự kiện, tin tức và ưu đãi. Các đối tác sẽ sử dụng dữ liệu của bạn theo Chính sách bảo mật.',
        partnerCheckbox: <>Vâng! Tôi muốn nhận thông tin cập nhật qua email theo <a href="#privacy" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-block font-semibold">Chính sách bảo mật</a>.</>,
        conditions: 'Điều khoản mua vé',
        conditionCheckbox: <>Tôi đã đọc và đồng ý với <a href="#policy" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-block font-semibold">Chính sách mua vé của JoyB.VN</a> và các đối tác.</>,
        conditionSub: 'Không có quyền rút lại vé đã thanh toán theo quy định.',
        paymentMethod: 'Phương thức thanh toán',
        payVNPay: 'Thanh toán qua VNPay (Sandbox)',
        vnpaySub: 'An toàn • Khuyên dùng',
        payMoMo: 'Ví MoMo',
        momoSub: 'Quét mã QR qua ứng dụng MoMo',
        total: 'TỔNG CỘNG',
        tickets: 'Vé',
        serviceFee: 'Phí dịch vụ',
        vat: 'VAT',
        cancelOrder: 'Huỷ giao dịch',
        proceedPayment: 'Tiếp tục thanh toán',
        fillFields: 'Vui lòng điền đủ thông tin và đồng ý điều khoản.',
        gatewayMaintenance: 'Cổng thanh toán đang bảo trì trong Sandbox. Vui lòng chọn thẻ hoặc phương thức khác hợp lệ.',
        serverError: 'Lỗi kết nối máy chủ.',
        seatsHeld: 'Các ghế đang được giữ tạm thời. Vui lòng thanh toán trước khi thời gian kết thúc.'
    },
    en: {
        header: 'CHECKOUT',
        timeLeft: 'TIME LEFT',
        expired: 'Time limit exceeded! Your seats have been released.',
        emptyCart: 'Your cart is empty',
        goBack: 'Go back',
        deliveryAddress: 'Delivery Address',
        required: 'Required',
        optional: 'Optional',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Mobile Phone Number',
        emailSub: 'Your E-Ticket will be sent to this email.',
        country: 'Country',
        eventPartners: 'Event Partners',
        partnerSub: 'Don\'t miss out! You can receive updates about events, news and special offers. Our partners will use your data in accordance with their Privacy Policy.',
        partnerCheckbox: <>Yes! I want to be kept updated by electronic means per the <a href="#privacy" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-block font-semibold">Privacy Policy</a>.</>,
        conditions: 'Conditions of Purchase',
        conditionCheckbox: <>I have read and accept the <a href="#policy" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-block font-semibold">Purchase Policy of JoyB.VN</a> and partners.</>,
        conditionSub: 'There is no withdrawal right on tickets, in accordance with our terms.',
        paymentMethod: 'Payment Method',
        payVNPay: 'Pay via VNPay (Sandbox)',
        vnpaySub: 'Secure • Recommended',
        payMoMo: 'MoMo e-Wallet',
        momoSub: 'Scan QR via MoMo app',
        total: 'TOTAL',
        tickets: 'Tickets',
        serviceFee: 'Service Fee',
        vat: 'VAT',
        cancelOrder: 'Cancel Order',
        proceedPayment: 'Proceed to Payment',
        fillFields: 'Please fill in all required fields and accept the terms.',
        gatewayMaintenance: 'Gateway is currently under maintenance in Sandbox. Please select another method.',
        serverError: 'Server connection error.',
        seatsHeld: 'These seats are temporarily held. Please complete payment before the timer expires.'
    }
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = localDict[lang] || localDict.vi;
  
  const { selectedSeats = [], event = null } = location.state || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Vietnam');
  
  const [partnerUpdates, setPartnerUpdates] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vnpay'); // 'vnpay', 'momo', 'bank'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
     if (user) {
         setEmail(user.email || '');
         const names = (user.name || '').split(' ');
         if (names.length > 1) {
             setLastName(names.pop());
             setFirstName(names.join(' '));
         } else {
             setFirstName(user.name || '');
         }
     }
  }, [user]);

  // --- Persistent Countdown Timer ---
  const HOLD_SECONDS = 600; // 10 minutes
  const [timeLeft, setTimeLeft] = useState(HOLD_SECONDS);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!event || selectedSeats.length === 0) return;
    
    const eventTimerKey = `joyb_timer_${event.id}`;
    const storedExpiry = localStorage.getItem(eventTimerKey);
    let expiryTime;

    if (storedExpiry && Date.now() < parseInt(storedExpiry, 10)) {
        // Valid existing timer in the future
        expiryTime = parseInt(storedExpiry, 10);
    } else {
        // No timer, or timer is expired - start a fresh 10 mins
        expiryTime = Date.now() + HOLD_SECONDS * 1000;
        localStorage.setItem(eventTimerKey, expiryTime.toString());
    }

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setExpired(true);
        localStorage.removeItem(eventTimerKey);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [event, selectedSeats.length]);

  useEffect(() => {
    if (expired) {
      window.alert(t.expired);
      navigate('/');
    }
  }, [expired, navigate, t.expired]);

  const timerMins = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;

  // --- Cost calculation ---
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const serviceFee = Math.round(totalAmount * 0.05); // 5% fee mock
  const vat = Math.round((totalAmount + serviceFee) * 0.08); // 8% VAT
  const grandTotal = totalAmount + serviceFee + vat;

  // Group seats by tier for summary
  const seatsByTier = useMemo(() => {
    if (!event) return [];
    const groups = {};
    selectedSeats.forEach(seat => {
      // Map to proper tier
      const tId = seat.tierId || 'unknown';
      if (!groups[tId]) {
        const tier = event.ticket_tiers?.find(t => t.id === tId) || { name: seat.tierName || 'Vé', color: '#6366f1' };
        groups[tId] = { tier, seats: [], subtotal: 0 };
      }
      groups[tId].seats.push(seat);
      groups[tId].subtotal += seat.price;
    });
    return Object.values(groups);
  }, [selectedSeats, event]);

  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && agreedTerms;

  const handleProceedPayment = async () => {
    if (!isFormValid) {
      alert(t.fillFields);
      return;
    }
    setIsProcessing(true);

    try {
      if (paymentMethod === 'vnpay') {
         const res = await fetch(`${API_BASE}/api/payment/create-payment-url`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 event_id: event.id,
                 user_id: user?.id || getGuestId(),
                 seats: selectedSeats,
                 totalAmount: grandTotal,
                 returnUrl: `${window.location.origin}/payment-result`,
                 invoice_info: {
                     firstName,
                     lastName,
                     email,
                     phone,
                     country
                 }
             })
         });
         
         const data = await res.json();
         if (res.ok && data.paymentUrl) {
             // Clear timer as we leave the page
             localStorage.removeItem(`joyb_timer_${event.id}`);
             localStorage.removeItem('joyb_pending_checkout');
             window.location.href = data.paymentUrl;
         } else {
             alert('Error: ' + (data.error || 'Unknown'));
             setIsProcessing(false);
         }
      } else if (paymentMethod === 'momo') {
         // Create completed payment on backend mock to save history
         const mockRes = await fetch(`${API_BASE}/api/payment/mock-payment`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 event_id: event.id,
                 user_id: user?.id || getGuestId(),
                 seats: selectedSeats,
                 totalAmount: grandTotal,
                 payment_method: 'momo',
                 invoice_info: { firstName, lastName, email, phone, country }
             })
         });
         const mockData = await mockRes.json();
         
         if (mockRes.ok && mockData.success) {
             localStorage.removeItem(`joyb_timer_${event.id}`);
             localStorage.removeItem('joyb_pending_checkout');
             
             // Redirect with order ID generated by backend
             window.location.href = `${window.location.origin}/payment-result?vnp_ResponseCode=00&vnp_TxnRef=${mockData.orderId}&vnp_Amount=${grandTotal * 100}&vnp_BankCode=MOMO`;
         } else {
             alert('Payment setup error: ' + (mockData.error || 'Unknown'));
             setIsProcessing(false);
         }
      } else {
         setTimeout(() => {
             alert(t.gatewayMaintenance);
             setIsProcessing(false);
         }, 1000);
      }
    } catch (err) {
       console.error("Payment Error:", err);
       alert(t.serverError);
       setIsProcessing(false);
    }
  };

  if (!event || selectedSeats.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-[#0e0e12]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.emptyCart}</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded hover:opacity-80 text-sm">{t.goBack}</button>
      </div>
    );
  }

  // Define dynamic class constants to prevent repeating light/dark pairs
  const themeClasses = {
      bgMain: "bg-gray-100 dark:bg-[#0e0e12]",
      panelBg: "bg-white dark:bg-[#18181c]",
      panelHeaderBg: "bg-gray-50 dark:bg-[#1f1f24]",
      borderCol: "border-gray-200 dark:border-[#27272a]",
      textColor: "text-gray-900 dark:text-white",
      textMuted: "text-gray-500 dark:text-gray-400",
      inputBg: "bg-white dark:bg-[#111]",
      inputBorder: "border-gray-300 dark:border-[#333]"
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans pb-20 ${themeClasses.bgMain}`}>
      
      {/* FIXED HEADER TICKETMASTER STYLE */}
      <div className="w-full bg-[#000] border-b border-[#222] py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-[100] shadow-md">
         <div className="flex items-center gap-4">
            <h1 className="text-white text-xl md:text-2xl font-black tracking-widest uppercase">
                JOYB <span className="text-[#2563eb] font-bold">{t.header}</span>
            </h1>
            {/* Lang switch */}
            <div className="flex bg-[#222] rounded overflow-hidden text-xs font-bold text-gray-400 border border-[#333]">
               <button onClick={() => setLang('vi')} className={`px-2 py-1 transition-colors ${lang==='vi'?'bg-[#3b82f6] text-white':'hover:bg-[#333]'}`}>VI</button>
               <button onClick={() => setLang('en')} className={`px-2 py-1 transition-colors ${lang==='en'?'bg-[#3b82f6] text-white':'hover:bg-[#333]'}`}>EN</button>
            </div>
         </div>
         <div className="flex items-center space-x-3 bg-[#111] px-4 py-2 rounded-full border border-[#333]">
             <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold">{t.timeLeft}</p>
                <motion.p 
                   className={`text-lg font-black tabular-nums tracking-wider ${timeLeft <= 180 ? 'text-red-500' : 'text-white'}`}
                   animate={timeLeft <= 180 ? { opacity: [1, 0.5, 1] } : {}}
                   transition={{ repeat: Infinity, duration: 1 }}
                >
                   {String(timerMins).padStart(2,'0')}:{String(timerSecs).padStart(2,'0')}
                </motion.p>
             </div>
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
               className="w-6 h-6 border-2 border-dashed border-gray-500 rounded-full"
             ></motion.div>
         </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* ==== LEFT COLUMN (Forms) ==== */}
           <div className="lg:col-span-8 space-y-6">
              
              {/* DELIVERY ADDRESS PANEL */}
              <section className={`${themeClasses.panelBg} border ${themeClasses.borderCol} rounded-lg overflow-hidden shadow-sm dark:shadow-none`}>
                 <div className={`${themeClasses.panelHeaderBg} px-6 py-4 flex justify-between items-center border-b ${themeClasses.borderCol}`}>
                    <h2 className={`${themeClasses.textColor} text-[15px] font-bold uppercase tracking-wider`}>{t.deliveryAddress}</h2>
                    <span className="text-xs text-red-600 dark:text-red-500 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded font-semibold uppercase">{t.required}</span>
                 </div>
                 
                 <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className={`block text-[11px] ${themeClasses.textMuted} uppercase font-semibold mb-1`}>{t.firstName}</label>
                          <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.textColor} text-sm rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors`} />
                       </div>
                       <div>
                          <label className={`block text-[11px] ${themeClasses.textMuted} uppercase font-semibold mb-1`}>{t.lastName}</label>
                          <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.textColor} text-sm rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors`} />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className={`block text-[11px] ${themeClasses.textMuted} uppercase font-semibold mb-1`}>{t.email} <span className="text-red-500">*</span></label>
                          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.textColor} text-sm rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors`} />
                          <p className="text-[10px] text-gray-500 mt-1">{t.emailSub}</p>
                       </div>
                       <div>
                          <label className={`block text-[11px] ${themeClasses.textMuted} uppercase font-semibold mb-1`}>{t.phone}</label>
                          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.textColor} text-sm rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors`} />
                       </div>
                    </div>

                    <div>
                       <label className={`block text-[11px] ${themeClasses.textMuted} uppercase font-semibold mb-1`}>{t.country}</label>
                       <select value={country} onChange={e=>setCountry(e.target.value)} className={`w-full ${themeClasses.inputBg} border ${themeClasses.inputBorder} ${themeClasses.textColor} text-sm rounded px-3 py-2 outline-none focus:border-blue-500 appearance-none`}>
                          <option value="Vietnam">Vietnam</option>
                          <option value="United States">United States</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                 </div>
              </section>

              {/* EVENT PARTNERS PANEL */}
              <section className={`${themeClasses.panelBg} border ${themeClasses.borderCol} rounded-lg overflow-hidden shadow-sm dark:shadow-none`}>
                 <div className={`${themeClasses.panelHeaderBg} px-6 py-4 flex justify-between items-center border-b ${themeClasses.borderCol}`}>
                    <h2 className={`${themeClasses.textColor} text-[15px] font-bold uppercase tracking-wider`}>{t.eventPartners}</h2>
                    <span className="text-xs text-blue-600 dark:text-blue-500 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded font-semibold uppercase">{t.optional}</span>
                 </div>
                 <div className="p-6">
                    <p className={`text-xs ${themeClasses.textMuted} mb-4 leading-relaxed`}>{t.partnerSub}</p>
                    <label className="flex items-start space-x-3 cursor-pointer group">
                       <input type="checkbox" checked={partnerUpdates} onChange={e=>setPartnerUpdates(e.target.checked)} className="mt-0.5 w-4 h-4 rounded-sm border-gray-300 dark:border-[#444] bg-white dark:bg-[#222] text-blue-600 focus:ring-blue-500/50" />
                       <span className={`text-sm ${themeClasses.textMuted} group-hover:${themeClasses.textColor} transition-colors`}>{t.partnerCheckbox}</span>
                    </label>
                 </div>
              </section>

              {/* CONDITIONS OF PURCHASE */}
              <section className={`${themeClasses.panelBg} border ${themeClasses.borderCol} rounded-lg overflow-hidden shadow-sm dark:shadow-none`}>
                 <div className={`${themeClasses.panelHeaderBg} px-6 py-4 flex justify-between items-center border-b ${themeClasses.borderCol}`}>
                    <h2 className={`${themeClasses.textColor} text-[15px] font-bold uppercase tracking-wider`}>{t.conditions}</h2>
                    <span className="text-xs text-red-600 dark:text-red-500 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded font-semibold uppercase">{t.required}</span>
                 </div>
                 <div className="p-6">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                       <input type="checkbox" checked={agreedTerms} onChange={e=>setAgreedTerms(e.target.checked)} className="mt-0.5 w-4 h-4 rounded-sm border-gray-300 dark:border-[#444] bg-white dark:bg-[#222] text-blue-600 focus:ring-blue-500/50" />
                       <div className={`text-sm ${themeClasses.textMuted} group-hover:${themeClasses.textColor} transition-colors`}>
                          {t.conditionCheckbox} <br/>
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">{t.conditionSub}</span>
                       </div>
                    </label>
                 </div>
              </section>

              {/* PAYMENT SELECTION */}
              <section className={`${themeClasses.panelBg} border ${themeClasses.borderCol} rounded-lg overflow-hidden shadow-sm dark:shadow-none`}>
                 <div className={`${themeClasses.panelHeaderBg} px-6 py-4 flex justify-between items-center border-b ${themeClasses.borderCol}`}>
                    <h2 className={`${themeClasses.textColor} text-[15px] font-bold uppercase tracking-wider`}>{t.paymentMethod}</h2>
                    <span className="text-xs text-red-600 dark:text-red-500 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded font-semibold uppercase">{t.required}</span>
                 </div>
                 <div className="p-6 space-y-3">
                    
                    {/* VNPay */}
                    <div 
                       onClick={() => setPaymentMethod('vnpay')}
                       className={`p-4 border rounded cursor-pointer flex items-center transition-all ${paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]' : `border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#555]`}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod==='vnpay' ? 'border-blue-500' : 'border-gray-400 dark:border-gray-500'}`}>
                          {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                       </div>
                       <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="VNPay" className="h-6 w-10 object-cover rounded mr-3 bg-white border border-gray-200" />
                       <div>
                          <span className={`${themeClasses.textColor} font-bold text-sm block`}>{t.payVNPay}</span>
                          <span className="text-xs text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-0.5 rounded mt-1 inline-block font-medium">{t.vnpaySub}</span>
                       </div>
                    </div>

                    {/* MoMo */}
                    <div 
                       onClick={() => setPaymentMethod('momo')}
                       className={`p-4 border rounded cursor-pointer flex items-center transition-all ${paymentMethod === 'momo' ? 'border-[#a50064] bg-pink-50 dark:bg-[#a50064]/5 shadow-[0_0_15px_-3px_rgba(165,0,100,0.2)]' : `border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#555]`}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${paymentMethod==='momo' ? 'border-[#a50064]' : 'border-gray-400 dark:border-gray-500'}`}>
                          {paymentMethod === 'momo' && <div className="w-2.5 h-2.5 bg-[#a50064] rounded-full"></div>}
                       </div>
                       <img src="https://developers.momo.vn/v3/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png" alt="MoMo" className="h-6 w-6 object-contain rounded mr-3" />
                       <div>
                          <span className={`${themeClasses.textColor} font-bold text-sm block`}>{t.payMoMo}</span>
                          <span className={`text-xs ${themeClasses.textMuted}`}>{t.momoSub}</span>
                       </div>
                    </div>

                 </div>
              </section>

           </div>

           {/* ==== RIGHT COLUMN (Order Summary) ==== */}
           <div className="lg:col-span-4 relative">
             <div className="sticky top-28 space-y-6">

                {/* Total / Proceed Button Block */}
                <div className={`${themeClasses.panelBg} rounded-lg shadow-xl overflow-hidden order-1 border border-gray-200 dark:border-none`}>
                   {/* Total Header */}
                   <div className={`p-5 flex justify-between items-center border-b ${themeClasses.borderCol}`}>
                      <h2 className={`text-xl font-black ${themeClasses.textColor}`}>{t.total}</h2>
                      <span className={`text-xl font-bold ${themeClasses.textColor}`}>{formatPrice(grandTotal)}</span>
                   </div>

                   {/* Pricing Breakdown */}
                   <div className="p-5 space-y-4">
                      
                      {/* Ticket breakdown */}
                      <div className={`pb-3 border-b ${themeClasses.borderCol}`}>
                         <h3 className={`text-sm font-bold ${themeClasses.textColor} mb-3`}>{t.tickets}</h3>
                         {seatsByTier.map(group => (
                            <div key={group.tier.id} className="flex justify-between items-center text-sm mb-1 group">
                               <div className={`flex items-center ${themeClasses.textMuted}`}>
                                  <span>{group.tier.name} x {group.seats.length}</span>
                               </div>
                               <span className={`${themeClasses.textColor} font-semibold`}>{formatPrice(group.subtotal)}</span>
                            </div>
                         ))}
                      </div>

                      {/* Fees */}
                      <div className="space-y-1.5 text-sm">
                         <div className={`flex justify-between ${themeClasses.textMuted}`}>
                            <span>{t.serviceFee} <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1 rounded ml-1">5%</span></span>
                            <span>{formatPrice(serviceFee)}</span>
                         </div>
                         <div className={`flex justify-between ${themeClasses.textMuted}`}>
                            <span>{t.vat} <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1 rounded ml-1">8%</span></span>
                            <span>{formatPrice(vat)}</span>
                         </div>
                      </div>

                      {/* Cancel Link */}
                      <div className="pt-2">
                        <span onClick={() => navigate(-1)} className="text-sm text-[#2563eb] underline cursor-pointer hover:text-blue-700">{t.cancelOrder}</span>
                      </div>

                      {/* Action Button */}
                      <button 
                         onClick={handleProceedPayment} 
                         disabled={isProcessing || !isFormValid}
                         className={`w-full py-4 text-white font-bold text-[15px] uppercase tracking-wide rounded transition-all flex items-center justify-center ${isFormValid ? 'bg-[#0f8b4d] hover:bg-[#0c723f] shadow-lg shadow-green-500/20' : 'bg-gray-300 dark:bg-[#e5e5e5] text-gray-500 dark:text-[#999] cursor-not-allowed'}`}
                      >
                         {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : (
                            <span className="flex items-center">
                               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                               {t.proceedPayment}
                            </span>
                         )}
                      </button>
                      
                   </div>
                </div>

                {/* Event Summary Block */}
                <div className={`${themeClasses.panelBg} rounded-lg shadow-xl overflow-hidden order-2 border border-gray-200 dark:border-none`}>
                   <div className={`flex bg-gray-50 dark:bg-gray-900 border-b ${themeClasses.borderCol}`}>
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-black shrink-0 relative">
                         <img src={event.anh_banner || "https://images.unsplash.com/photo-1540039155732-684735009fcb"} className="w-full h-full object-cover" alt="Banner" />
                      </div>
                      <div className="p-4 flex flex-col justify-center">
                         <h3 className={`font-black ${themeClasses.textColor} leading-tight uppercase line-clamp-2`}>{event.ten_show}</h3>
                         <p className={`text-xs ${themeClasses.textMuted} font-semibold mt-2`}>{new Date(event.ngay_gio).toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                         <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{event.dia_diem}</p>
                      </div>
                   </div>

                   {/* TICKETS Accordion (Always open for now) */}
                   <div>
                      <div className={`p-4 flex justify-between items-center border-b ${themeClasses.borderCol} ${themeClasses.panelBg}`}>
                         <h4 className={`font-bold ${themeClasses.textColor} text-sm uppercase tracking-wider`}>{t.tickets}</h4>
                         <svg className={`w-4 h-4 ${themeClasses.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </div>
                      
                      <div className={`p-4 space-y-4 ${themeClasses.panelBg}`}>
                         {selectedSeats.map((s, idx) => {
                            const tier = event.ticket_tiers?.find(t => t.id === s.tierId);
                            const tColor = tier?.color || '#3b82f6';
                            return (
                               <div key={idx} className="flex space-x-3 items-center">
                                  {/* Simple schematic of a seat */}
                                  <div className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-b-xl rounded-t-sm flex items-center justify-center shrink-0" style={{backgroundColor: tColor + '20'}}>
                                     <div className="w-3 h-3 rounded-full" style={{backgroundColor: tColor}}></div>
                                  </div>
                                  <div className="flex-1">
                                     <p className={`font-bold ${themeClasses.textColor} text-sm`}>{tier?.name || s.tierName} x 1</p>
                                     <p className={`text-[11px] ${themeClasses.textMuted} mt-0.5 font-medium`}>{s.sectionId} • Row {s.row} • Seat {s.seat}</p>
                                  </div>
                                  <p className="text-xs text-gray-500 cursor-pointer hover:underline self-end pb-0.5">Edit</p>
                               </div>
                            )
                         })}
                      </div>
                      
                      <div className={`bg-gray-100 dark:bg-[#111] px-4 py-3 border-t ${themeClasses.borderCol} flex space-x-2 text-[11px] ${themeClasses.textMuted}`}>
                         <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <p>{t.seatsHeld}</p>
                      </div>
                   </div>

                </div>

             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
