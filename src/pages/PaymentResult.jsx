import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const localDict = {
    vi: {
        verifying: 'Đang xác minh giao dịch...',
        pleaseWait: 'Vui lòng không đóng trang này',
        success: 'Thanh toán thành công!',
        orderId: 'Mã giao dịch JoyB:',
        amount: 'Số tiền:',
        bank: 'Ngân hàng:',
        channel: 'Kênh thanh toán:',
        vnpaySandbox: 'VNPay Sandbox',
        ticketNotice: 'E-Ticket đã được gửi về email của bạn. Vui lòng trình QR Code này tại cổng sự kiện.',
        viewTickets: 'Xem vé của tôi',
        returnHome: 'Trở về trang chủ',
        failedTitle: 'Thanh toán thất bại hoặc đã bị huỷ',
        failedNotice: 'Giao dịch của bạn qua VNPay không thành công hoặc bạn đã tự ý huỷ.',
        tryAgain: 'Thử lại sau'
    },
    en: {
        verifying: 'Verifying transaction...',
        pleaseWait: 'Please do not close this page',
        success: 'Payment Successful!',
        orderId: 'JoyB Order ID:',
        amount: 'Amount:',
        bank: 'Bank:',
        channel: 'Payment Channel:',
        vnpaySandbox: 'VNPay Sandbox',
        ticketNotice: 'Your E-Ticket has been sent to your email. Please present this QR Code at the event entrance.',
        viewTickets: 'View My Tickets',
        returnHome: 'Return to Homepage',
        failedTitle: 'Payment Failed or Cancelled',
        failedNotice: 'Your transaction via VNPay was not successful or you cancelled it.',
        tryAgain: 'Try again later'
    }
};

const PaymentResult = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { lang } = useLanguage();
   const t = localDict[lang] || localDict.vi;
   
   const [status, setStatus] = useState('processing');
   const [orderData, setOrderData] = useState(null);

   useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const vnp_Amount = searchParams.get('vnp_Amount');
      const vnp_BankCode = searchParams.get('vnp_BankCode');

      if (!vnp_ResponseCode) {
          setStatus('invalid');
          return;
      }

      setOrderData({
         id: vnp_TxnRef,
         amount: vnp_Amount ? (Number(vnp_Amount) / 100) : 0,
         bank: vnp_BankCode
      });

      // Simple UX delay for fake processing feel
      setTimeout(() => {
          if (vnp_ResponseCode === '00') {
             setStatus('success');
          } else {
             setStatus('failed');
          }
      }, 1500);

   }, [location]);

   const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

   if (status === 'processing') {
       return (
           <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-[#0e0e12]">
               <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.verifying}</h2>
               <p className="text-sm text-gray-500">{t.pleaseWait}</p>
           </div>
       );
   }

   if (status === 'success') {
       return (
           <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-[#0e0e12] px-4 py-12">
               <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   className="max-w-md w-full bg-white dark:bg-[#18181c] border border-gray-200 dark:border-[#27272a] rounded-xl overflow-hidden shadow-xl dark:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] text-center relative"
               >
                   <div className="bg-[#10b981] h-2 w-full absolute top-0"></div>
                   
                   <div className="p-8">
                       <div className="w-20 h-20 bg-green-100 dark:bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                           <svg className="w-10 h-10 text-green-600 dark:text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                           </svg>
                       </div>
                       
                       <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.success}</h2>
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.orderId} <span className="font-bold text-gray-900 dark:text-white">{orderData?.id}</span></p>

                       <div className="bg-gray-50 dark:bg-[#111] p-5 rounded-lg border border-gray-200 dark:border-[#27272a] text-left mb-8 space-y-3">
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-gray-500">{t.amount}</span>
                               <span className="font-bold text-gray-900 dark:text-white">{formatPrice(orderData?.amount)}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-gray-500">{t.bank}</span>
                               <span className="font-bold text-gray-900 dark:text-white">{orderData?.bank}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                               <span className="text-gray-500">{t.channel}</span>
                               <span className="font-bold text-gray-900 dark:text-white">{t.vnpaySandbox}</span>
                           </div>
                       </div>

                       <div className="p-3 border-2 border-dashed border-gray-300 dark:border-[#333] rounded-lg bg-gray-50 dark:bg-white/5 inline-block mb-6">
                           <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JOYB-TICKET-MOCK" alt="QR Ticket" className="w-32 h-32 opacity-80 mix-blend-multiply dark:mix-blend-screen" />
                       </div>
                       <p className="text-xs text-gray-500 mb-6">{t.ticketNotice}</p>

                       <Link to="/my-tickets" className="block w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded transition-colors text-sm">{t.viewTickets}</Link>
                       <Link to="/" className="block w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold rounded transition-colors text-sm mt-2">{t.returnHome}</Link>
                   </div>
               </motion.div>
           </div>
       );
   }

   return (
       <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-[#0e0e12] px-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                 </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{t.failedTitle}</h2>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-sm">{t.failedNotice}</p>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-200 dark:bg-[#27272a] hover:bg-gray-300 dark:hover:bg-[#333] border border-gray-300 dark:border-[#444] text-gray-900 dark:text-white font-bold rounded transition-colors text-sm">{t.tryAgain}</button>
       </div>
   );
};

export default PaymentResult;
