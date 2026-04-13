import EventList from '../components/EventList';
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getEnrichedEvents } from '../data/eventLoader';

// Utility for formatting featured event date
const formatDateTimeHero = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const dayName = new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${dayName}, ${day}/${month} • ${time}`;
};

const formatDateCard = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthName = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${day} ${monthName}, ${year}`;
};

const getMinPrice = (tiers) => {
  if (!tiers || !Array.isArray(tiers) || tiers.length === 0) return null;
  const parsed = tiers.map(t => parseInt(t.price) || 0).filter(p => p > 0);
  if (parsed.length === 0) return null;
  return Math.min(...parsed);
};

const formatVND = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

// Recommendation Carousel
const RecommendedCarousel = ({ events }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Shuffle and pick 8 random events
  const shuffled = [...events].sort(() => Math.random() - 0.5).slice(0, 8);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  if (shuffled.length === 0) return null;

  return (
    <section className="w-full bg-[#111] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Dành cho bạn</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${canScrollLeft ? 'border-gray-500 text-gray-300 hover:border-white hover:text-white' : 'border-gray-800 text-gray-700 cursor-default'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${canScrollRight ? 'border-gray-500 text-gray-300 hover:border-white hover:text-white' : 'border-gray-800 text-gray-700 cursor-default'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shuffled.map((event) => {
            let tiers = event.ticket_tiers;
            if (typeof tiers === 'string') try { tiers = JSON.parse(tiers); } catch(e) { tiers = []; }
            const minPrice = getMinPrice(tiers);

            return (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="flex-shrink-0 w-[260px] group"
              >
                <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222] hover:border-[#444] transition-all hover:-translate-y-1 shadow-lg">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={event.anh_banner}
                      alt={event.ten_show}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'; }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-snug group-hover:text-pink-400 transition-colors">
                      {event.ten_show}
                    </h3>
                    {minPrice && (
                      <p className="text-pink-500 font-bold text-sm mb-1">
                        Từ {formatVND(minPrice)}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {formatDateCard(event.ngay_gio)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Home = ({ theme, toggleTheme }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    getEnrichedEvents().then(data => {
      setEvents(data);
      if (data && data.length > 0) {
        // Find the up to 5 upcoming events
        const now = new Date();
        let upcoming = data.filter(e => e.status === 'upcoming' || new Date(e.ngay_gio) > now);
        let top5 = upcoming.slice(0, 5);
        if (top5.length === 0) {
          top5 = data.slice(0, 5);
        }
        setFeaturedEvents(top5);
      }
    });
  }, []);

  // Auto-slide effect every 5 seconds (smoother pace)
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const featuredEvent = featuredEvents[currentSlideIndex];

  return (
    <>
      {/* Banner / Hero Section (MoMo style adapted for JoyB) */}
      <div className="w-full bg-[#fdf2f8] dark:bg-[#13071b] transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left Content */}
          <div className="md:w-1/2 flex flex-col items-start z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-[1.2] font-display">
              Đặt vé sự kiện Online trên <span className="text-pink-600 dark:text-pink-500">joyb</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
              Với nhiều ưu đãi hấp dẫn và kết nối với tất cả các sự kiện lớn phủ rộng khắp Việt Nam. Đặt vé ngay tại joyb!
            </p>
            
            <ul className="mb-10 space-y-4">
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span>Mua vé Online, <strong className="text-gray-900 dark:text-white font-bold">trải nghiệm sự kiện đỉnh cao</strong></span>
              </li>
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span><strong className="text-gray-900 dark:text-white font-bold">Đặt vé an toàn</strong> trên joyb</span>
              </li>
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span>Tha hồ <strong className="text-gray-900 dark:text-white font-bold">chọn chỗ ngồi</strong>, thanh toán tiện lợi.</span>
              </li>
              <li className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-pink-500 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                <span><strong className="text-gray-900 dark:text-white font-bold">Lịch sử đặt vé</strong> được lưu lại ngay</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="bg-[#e91e63] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5">
                ĐẶT VÉ NGAY
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:w-1/2 flex justify-center md:justify-end z-10 w-full relative">
            {/* Background Blob for dark mode flair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-500/10 dark:bg-pink-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <img 
              src={`${import.meta.env.BASE_URL}hero-illustration.png`}
              alt="Hero Illustration" 
              className="w-full max-w-lg object-contain rounded-2xl shadow-2xl relative z-10 border border-black/5 dark:border-white/5"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>

        </div>
      </div>

      {/* SỰ KIỆN SẮP TỚI HERO BANNER SECTION */}
      <section className="w-full bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-900 overflow-hidden relative pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="text-3xl font-extrabold text-white mb-6">Sự kiện sắp tới</h2>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative w-full aspect-[21/9] bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-[#222]">
            {/* Crossfade slides */}
            {featuredEvents.map((ev, idx) => (
              <Link
                key={ev.id}
                to={`/event/${ev.id}`}
                className={`absolute inset-0 group cursor-pointer transition-opacity duration-[1200ms] ease-in-out ${
                  idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Image / Banner */}
                <img 
                  src={ev.anh_banner || "https://images.unsplash.com/photo-1543807535-eceef0bc6599?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"} 
                  alt={ev.ten_show || "Upcoming Featured Event"} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80";
                  }}
                />
                
                {/* Dark/Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                
                {/* Floating Title Content */}
                <div className={`absolute bottom-10 left-10 md:bottom-16 md:left-16 max-w-2xl transition-all duration-[800ms] ease-out ${
                  idx === currentSlideIndex ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-xs px-3 py-1 uppercase tracking-widest rounded-full shadow-lg">
                      Featured
                    </span>
                    <span className="text-[#fca311] font-bold text-sm bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm shadow-md">
                      {formatDateTimeHero(ev.ngay_gio)}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-[#fdf0d5] mb-2 uppercase tracking-wide font-display drop-shadow-lg leading-tight line-clamp-2">
                    {ev.ten_show || "Sự kiện sắp diễn ra"}
                  </h1>
                  <p className="text-gray-300 font-medium text-lg leading-relaxed max-w-xl line-clamp-2">
                    {ev.about_event || "Khám phá các sự kiện hấp dẫn và đặt vé ngay hôm nay cùng joyb."}
                  </p>
                </div>
                
                {/* Decorative Artists Text at Top */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex space-x-16 text-xs text-gray-400 uppercase tracking-widest font-bold opacity-0 md:opacity-100 drop-shadow-md bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5">
                  <div className="text-center"><span>{ev.ca_si || "Nghệ sĩ"}</span><br/><span className="text-white">Live</span></div>
                  <div className="text-center flex items-center gap-2"><img src={ev.organizer_avatar} className="w-5 h-5 rounded-full grayscale opacity-80" onError={e => e.target.style.display='none'} /> <span className="text-white">{ev.organizer_name || "Ban tổ chức"}</span></div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Carousel Dots */}
          <div className="flex justify-center mt-6 relative z-20">
            <div className="flex items-center space-x-3 px-6 py-2 rounded-full border border-[#222] bg-[#111]">
              <svg onClick={(e) => { e.preventDefault(); setCurrentSlideIndex(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length); }} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {featuredEvents.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={(e) => { e.preventDefault(); setCurrentSlideIndex(idx); }}
                  className={`cursor-pointer rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'bg-pink-500 w-3 h-3 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'bg-gray-600 w-2 h-2 hover:bg-gray-400'}`}
                ></div>
              ))}
              <svg onClick={(e) => { e.preventDefault(); setCurrentSlideIndex(prev => (prev + 1) % featuredEvents.length); }} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US MARQUEE MOVED TO SEPARATE PAGE */}

      {/* "Dành cho bạn" Recommendation Carousel */}
      {events.length > 0 && <RecommendedCarousel events={events} />}

      {/* Main Content Area */}
      <main className="flex-grow w-full bg-[#1e1e1e] xl:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventList initialSearch={initialSearch} events={events} />
        </div>
      </main>
    </>
  );
};

export default Home;
