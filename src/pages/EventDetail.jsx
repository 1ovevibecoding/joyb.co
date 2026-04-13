import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import CheckoutTimer from '../components/CheckoutTimer';
import { getEnrichedEvent } from '../data/eventLoader';
import VenuePreview from '../components/VenuePreview';
import TicketmasterSeatMap from '../components/TicketmasterSeatMap';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutTimerOpen, setIsCheckoutTimerOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [globalSoldSeats, setGlobalSoldSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState({});
  const [previewSection, setPreviewSection] = useState(null);

  // Generate or retrieve a persistent session string for guest locking
  const localSessionId = user?.id || (() => {
    let sess = localStorage.getItem('joyb_session_id');
    if (!sess) {
      sess = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('joyb_session_id', sess);
    }
    return sess;
  })();

  const flashSaleSections = ['SR-W', 'SR-E', 'GA-1', 'VVIP', 'F1', 'B1'];
  const hasFlashSale = event?.venueLayout?.sections?.some(s => flashSaleSections.includes(s.id));

  // Init basic Event info
  useEffect(() => {
    window.scrollTo(0, 0);

    getEnrichedEvent(id).then(async (foundEvent) => {
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setNotFound(true);
      }
    });
  }, [id]);

  // Polling Ticketmaster Availability API
  useEffect(() => {
    if (!event?.id) return;
    
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${event.id}/availability`);
        if (!res.ok) return;
        const data = await res.json();
        
        // Merge DB sold seats with Local storage history
        if (data.soldSeats) {
          const localSold = JSON.parse(localStorage.getItem(`vibee_sold_seats_${event.id}`) || '[]');
          setGlobalSoldSeats([...new Set([...data.soldSeats, ...localSold])]);
        }
        
        // Handle In-memory locks
        if (data.lockedSeats) {
          setLockedSeats(data.lockedSeats);
        }
      } catch (e) {
        console.error('Failed to poll availability:', e);
      }
    };

    fetchAvailability(); // initial fetch
    const timer = setInterval(fetchAvailability, 3000); // 3 seconds interval
    return () => clearInterval(timer);
  }, [event?.id]);

  // Cleanup on Unmount (Giải phóng các block nếu user tắt web)
  useEffect(() => {
    return () => {
      if (event?.id && localSessionId) {
        // We use fetch with keepalive to ensure request goes through when unloading
        fetch('http://localhost:5000/api/seat-locks', {
          method: 'DELETE',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: event?.id, user_id: localSessionId })
        }).catch(() => {});
      }
    };
  }, [event?.id, localSessionId]);

  if (notFound) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-widest">Không tìm thấy sự kiện</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Sự kiện bạn đang tìm kiếm có thể đã kết thúc, bị hủy hoặc đường dẫn không còn tồn tại do hệ thống mới cập nhật. Vui lòng quay lại trang chủ.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
        >
          TRỞ VỀ TRANG CHỦ
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border-4 border-gray-800 border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-white font-bold tracking-widest uppercase animate-pulse">Đang tải biểu diễn...</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const formatDateTimeShort = (dateString, type) => {
    if (!dateString) return type === 'day' ? '??' : 'TBA';
    const date = new Date(dateString);
    if (isNaN(date)) return type === 'day' ? '??' : 'TBA';
    
    if (type === 'day') {
       return String(date.getDate()).padStart(2, '0');
    }
    if (type === 'month') {
       return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    }
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const fullDate = `${String(date.getDate()).padStart(2, '0')} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)}`;
    return `${dayName}, ${fullDate}`;
  };

  const timeRange = (dateString) => {
    if (!dateString) return 'Thời gian đang cập nhật';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Thời gian đang cập nhật';
    
    const start = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    // Giả lập end time + 3.5 tiếng
    date.setHours(date.getHours() + 3);
    date.setMinutes(date.getMinutes() + 30);
    const end = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${start} - ${end}`;
  };

  const safeTicketTiers = Array.isArray(event.ticket_tiers) ? event.ticket_tiers : [];
  const prices = safeTicketTiers.length > 0 ? safeTicketTiers.map(t => t.price || 0) : [0];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  const handleSeatToggle = async (seatId, tier, sectionId, rowLabel, colIndex) => {
    if (globalSoldSeats.includes(seatId)) return;
    
    // Ticketmaster Behavior: Ensure it's not locked by someone else
    if (lockedSeats[seatId] && lockedSeats[seatId] !== localSessionId) {
      alert('Another fan beat you to it! Ghế này đã bị một fan khác đưa vào giỏ hàng.');
      return;
    }

    const sId = sectionId || seatId.split('-').slice(0, -2).join('-');
    const isFlashSale = flashSaleSections.includes(sId);
    const finalPrice = isFlashSale ? Math.round(tier.price * 0.8) : tier.price;

    const isSelected = selectedSeats.some(seat => seat.seatId === seatId);

    if (isSelected) {
      // 1. Send UNLOCK request
      try {
        await fetch('http://localhost:5000/api/seat-locks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: event.id, seat_id: seatId, user_id: localSessionId })
        });
      } catch (e) {}

      // 2. Remove locally
      setSelectedSeats(prev => prev.filter(seat => seat.seatId !== seatId));
      
      // Update lock state immediately for UI snap
      setLockedSeats(prev => {
        const next = {...prev};
        delete next[seatId];
        return next;
      });
      
    } else {
      if (selectedSeats.length >= 10) return;
      
      // 1. Send LOCK request
      try {
        const lockRes = await fetch('http://localhost:5000/api/seat-locks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: event.id, seat_id: seatId, user_id: localSessionId })
        });
        
        if (!lockRes.ok) {
           const errData = await lockRes.json();
           alert(errData.error || 'Ghế đã bị người khác chọn trước đó.');
           return;
        }

        // 2. Add locally
        setSelectedSeats(prev => [...prev, {
          seatId,
          tierId: tier.id,
          tierName: tier.name,
          tierColor: tier.color,
          price: finalPrice,
          originalPrice: isFlashSale ? tier.price : null,
          isFlashSale,
          sectionId: sId,
          row: rowLabel ?? 'A',
          seat: typeof colIndex === 'number' ? colIndex : 0
        }]);

        // Update lock state immediately
        setLockedSeats(prev => ({...prev, [seatId]: localSessionId}));
      } catch (e) {
        console.error('Lock failed:', e);
      }
    }
  };




  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const totalTickets = selectedSeats.length;

  // Derive AR View Image
  const lastSelectedSeat = selectedSeats[selectedSeats.length - 1];
  let currentViewImage = null;
  if (lastSelectedSeat && event.venueLayout && event.venueLayout.sections) {
    const section = event.venueLayout.sections.find(s => s.id === lastSelectedSeat.sectionId);
    if (section && section.viewImage) {
      currentViewImage = section.viewImage;
    }
  }

  return (
    <div className="flex-grow w-full bg-gray-50 dark:bg-black pt-6 pb-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors group text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
           {t.back}
        </button>

        {/* FLASH SALE GLOBE BANNER */}
        {hasFlashSale && (
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-4 mb-6 shadow-lg shadow-red-500/20 flex flex-col sm:flex-row items-center justify-between text-white animate-in slide-in-from-top-4">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
               <span className="text-2xl animate-bounce">⚡</span>
               <div>
                  <h3 className="font-extrabold text-lg uppercase tracking-wider">Flash Sale Đang Diễn Ra</h3>
                  <p className="text-sm font-medium opacity-90">Giảm ngay 20% cho các khu vực: <span className="font-bold">{flashSaleSections.filter(sid => event.venueLayout?.sections?.some(s => s.id === sid)).join(', ')}</span></p>
               </div>
            </div>
            <div className="text-xl font-black bg-white text-red-600 px-4 py-1.5 rounded-full shadow-inner animate-pulse">
               -20% Off
            </div>
          </div>
        )}

        {/* HERO BANNER SECTION */}
        <div className="w-full relative rounded-2xl overflow-hidden mb-6 aspect-[21/9] bg-gray-200 dark:bg-gray-900 shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800">
           <img 
            src={event.anh_banner} 
            alt={event.ten_show} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* HEADER INFO SECTION */}
        <div className="mb-12 pb-8 border-b border-gray-200 dark:border-[#222]">
           {/* Thẻ Date block */}
           <div className="flex items-center space-x-4 mb-6 text-xl">
             <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#27272A] w-14 h-14 shadow-sm dark:shadow-none">
                <span className="text-gray-900 dark:text-white font-bold text-lg leading-none">{formatDateTimeShort(event.ngay_gio, 'day')}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase mt-1">{formatDateTimeShort(event.ngay_gio, 'month')}</span>
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-display mb-1">{event.ten_show}</h1>
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 space-x-6 mt-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 dark:text-white">{formatDateTimeShort(event.ngay_gio)}</p>
                      <p className="text-xs">{timeRange(event.ngay_gio)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-900 dark:text-white">{(event.dia_diem || "Đang cập nhật").split(',')[0].trim()}</p>
                      <p className="text-xs">{(event.dia_diem || "").split(',').pop().trim()}</p>
                    </div>
                  </div>
                </div>
             </div>
           </div>

            <div className="flex items-center space-x-3 mt-4">
              <img src={event.organizer_avatar} alt="Organizer" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{event.organizer_name || "Chưa cập nhật"}</span>
            </div>
        </div>

        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: TICKET TIERS */}
          <div className="lg:col-span-7 xl:col-span-7">
             
             {/* PREMIUM BUY TICKET HEADER ACTION */}
             <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-center shadow-md">
                <div className="mb-4 sm:mb-0">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 tracking-wide">Giá vé chỉ từ</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(minPrice)}</p>
                </div>
                <button 
                  onClick={() => {
                    if (!user) { navigate('/login', { state: { from: `/event/${id}` } }); return; }
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold rounded-xl transition-colors text-sm tracking-wide flex items-center justify-center group"
                >
                  MUA VÉ NGAY
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
             </div>

             {/* VENUE PREVIEW */}
             <div className="mb-8">
               <VenuePreview 
                 event={event} 
                 selectedSectionId={previewSection || (selectedSeats.length > 0 ? selectedSeats[selectedSeats.length - 1].sectionId : null)} 
               />
             </div>

             <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-[#27272A] overflow-hidden shadow-sm dark:shadow-none">
                <div className="p-5 border-b border-gray-200 dark:border-[#27272A] flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.ticketTiers}</h2>
                </div>
                
                <div className="flex flex-col">
                  {safeTicketTiers.map((tier, index) => (
                    <div 
                      key={tier.id} 
                      onClick={() => {
                        if (!user) { navigate('/login', { state: { from: `/event/${id}` } }); return; }
                        setIsModalOpen(true);
                      }}
                      className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-[#27272A]/40 transition-colors ${index !== safeTicketTiers.length - 1 ? 'border-b border-gray-200 dark:border-[#27272A]' : ''}`}
                    >
                      <div className="flex flex-col mb-3 sm:mb-0 pr-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-900 dark:text-white shrink-0">{tier.name}</span>
                          {(tier.name.includes('Voucher') || tier.name.includes('Admission')) && (
                            <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                               {t.bestValue}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">{tier.description}</span>
                      </div>
                      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap mr-6 sm:mr-0">{formatPrice(tier.price)}</span>
                        <button className="sm:hidden px-4 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-semibold">{t.selectTicket}</button>
                      </div>
                    </div>
                  ))}
                  {safeTicketTiers.length === 0 && (
                     <div className="p-6 text-center text-gray-500">Chưa có thông tin giá vé</div>
                  )}
                </div>
             </div>
          </div>

          {/* CỘT PHẢI: ABOUT & MAP */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-8">
            
            {/* Organizer Profile */}
            <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-[#27272A] p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group shadow-sm dark:shadow-none">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 dark:border-[#27272A] pb-3">Đơn vị tổ chức</h2>
              <div className="flex items-center">
                <img src={event.organizer_avatar} alt={event.organizer_name || "Organizer"} className="w-14 h-14 rounded-full border border-gray-200 dark:border-gray-700 mr-4" />
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{event.organizer_name || "Đơn vị tổ chức"}</h3>
                  <Link to={`/organizer/${encodeURIComponent(event.organizer_name || "Đơn vị tổ chức")}`}>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 hover:underline">Xem hồ sơ sự kiện &rarr;</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Vị trí trên biểu đồ Google Map */}
            <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-[#27272A] overflow-hidden group shadow-sm dark:shadow-none">
                <div className="p-0 border-b border-gray-200 dark:border-[#27272A] h-56 bg-gray-100 dark:bg-gray-800 relative">
                   <iframe 
                      title="Google Map"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(event.dia_diem)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      loading="lazy"
                   ></iframe>
                </div>
                <div className="p-5">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-2">{(event.dia_diem || "Đang cập nhật").split(',')[0].trim()}</h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{event.dia_diem || "Chưa có thông tin"}</p>
                   <a 
                     href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.dia_diem)}`} 
                     target="_blank" 
                     rel="noreferrer"
                     className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                   >
                     Mở trên Google Maps
                   </a>
                </div>
            </div>

            {/* About Event */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.aboutEvent}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: (event.about_event || "Đang cập nhật thông tin sự kiện.").replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>').replace(/^/, '<p>').replace(/$/, '</p>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 dark:text-white mt-4 block">$1</strong>') }}>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL TICKETS SELECTION - INTERACTIVE SEAT MAP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
             
             {/* Close Button */}
             <button 
               onClick={() => setIsModalOpen(false)}
               className="absolute top-4 right-4 z-10 p-2 text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100/80 dark:bg-[#111111]/80 hover:bg-gray-200 dark:hover:bg-[#222222] rounded-full transition-colors backdrop-blur-sm shadow-sm"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>

              {/* TicketmasterSeatMap tich hop san Map + Sidebar dong 3 trang thai */}
              <TicketmasterSeatMap
                event={event}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
                globalSoldSeats={globalSoldSeats}
                lockedSeats={lockedSeats}
                localSessionId={localSessionId}
                onProceedToCheckout={() => setIsCheckoutTimerOpen(true)}
              />

          </div>
        </div>
      )}

      {/* Checkout Timer Modal */}
      <CheckoutTimer
        isOpen={isCheckoutTimerOpen}
        onClose={() => setIsCheckoutTimerOpen(false)}
        event={event}
        listing={{
          seats: totalTickets,
          pricePerSeat: totalTickets > 0 ? calculateTotal() / totalTickets : 0
        }}
        onStart={() => {
          setIsCheckoutTimerOpen(false);
          setIsModalOpen(false);
          localStorage.setItem('joyb_pending_checkout', JSON.stringify({
             event,
             selectedSeats,
             expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
          }));
          navigate('/checkout', { state: { selectedSeats, event } });
        }}
      />
    </div>
  );
};

export default EventDetail;
