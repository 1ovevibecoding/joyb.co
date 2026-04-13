import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PendingCheckoutBanner = () => {
   const [pendingSession, setPendingSession] = useState(null);
   const [timeLeft, setTimeLeft] = useState(null);
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      // Don't show on checkout workflows
      if (location.pathname.startsWith('/checkout') || location.pathname.startsWith('/payment-result')) {
         return;
      }

      const checkSession = () => {
         const dataStr = localStorage.getItem('joyb_pending_checkout');
         if (dataStr) {
             try {
                const data = JSON.parse(dataStr);
                const now = Date.now();
                if (data.expiresAt > now) {
                   setPendingSession(data);
                   setTimeLeft(Math.floor((data.expiresAt - now) / 1000));
                } else {
                   // expired
                   localStorage.removeItem('joyb_pending_checkout');
                   localStorage.removeItem(`joyb_timer_${data.event?.id}`);
                   setPendingSession(null);
                }
             } catch (e) {
                 localStorage.removeItem('joyb_pending_checkout');
             }
         } else {
             setPendingSession(null);
         }
      };

      checkSession();
      const interval = setInterval(checkSession, 1000);
      return () => clearInterval(interval);
   }, [location.pathname]);

   if (!pendingSession || timeLeft === null) return null;

   const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
   };

   const handleReturn = () => {
      navigate('/checkout', { state: { selectedSeats: pendingSession.selectedSeats, event: pendingSession.event } });
   };

   return (
      <AnimatePresence>
         <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-blue-600 dark:bg-blue-600 text-white shadow-[0_-10px_40px_rgba(37,99,235,0.3)] border-t border-blue-500"
         >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between sm:space-x-4">
               <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                  </div>
                  <div>
                     <p className="text-sm font-bold">Bạn có một đơn hàng đang chờ thanh toán</p>
                     <p className="text-xs text-blue-100 flex items-center">
                        {pendingSession.selectedSeats.length} vé • {pendingSession.event?.ten_show?.substring(0, 30)}...
                        <span className="ml-2 px-2 py-0.5 bg-blue-800 rounded font-mono font-bold">
                           {formatTime(timeLeft)}
                        </span>
                     </p>
                  </div>
               </div>
               
               <div className="flex w-full sm:w-auto space-x-2">
                  <button 
                     onClick={() => {
                        localStorage.removeItem('joyb_pending_checkout');
                        if (pendingSession.event?.id) {
                           localStorage.removeItem(`joyb_timer_${pendingSession.event.id}`);
                        }
                        setPendingSession(null);
                     }}
                     className="px-4 py-2 bg-blue-800 hover:bg-blue-900 rounded font-medium text-sm transition-colors whitespace-nowrap"
                  >
                     Hủy đơn
                  </button>
                  <button 
                     onClick={handleReturn}
                     className="flex-grow sm:flex-grow-0 px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded font-bold text-sm shadow-md transition-colors whitespace-nowrap"
                  >
                     Tiếp tục thanh toán
                  </button>
               </div>
            </div>
         </motion.div>
      </AnimatePresence>
   );
};

export default PendingCheckoutBanner;
