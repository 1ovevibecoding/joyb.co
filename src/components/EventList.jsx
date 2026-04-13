import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

// Fade-in card wrapper using IntersectionObserver
const FadeInCard = ({ children, index }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      {children}
    </div>
  );
};

// Format ngày giờ hiển thị
const formatDateTimeShort = (dateString) => {
  const date = new Date(dateString);
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${dayName}, ${day}/${month} • ${time}`;
};

// Reusable Event Card
const EventCard = ({ event, isPast = false }) => (
  <Link 
    to={isPast ? '#' : `/event/${event.id}`}
    onClick={isPast ? (e) => e.preventDefault() : undefined}
    className={`group flex flex-col bg-white dark:bg-black rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-900 transition-all duration-300 block ${
      isPast 
        ? 'opacity-60 cursor-default grayscale-[30%]' 
        : 'hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 cursor-pointer hover:-translate-y-1'
    }`}
  >
    {/* Image */}
    <div className="relative aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-t-xl mb-1">
      <img 
        src={event.anh_banner} 
        alt={event.ten_show} 
        className={`w-full h-full object-cover transition-transform duration-500 ${isPast ? '' : 'group-hover:scale-105'}`}
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80";
        }}
      />
      {isPast && (
        <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide backdrop-blur-sm">
          Đã kết thúc
        </div>
      )}
    </div>

    {/* Content */}
    <div className="flex flex-col flex-grow p-4">
      <div className="mb-2">
        <p className={`font-semibold text-sm mb-2 flex items-center ${isPast ? 'text-gray-400' : 'text-[#fca311] dark:text-[#ffb703]'}`}>
          {formatDateTimeShort(event.ngay_gio)} • <span className="ml-1 text-gray-400">{(event.dia_diem || "Chưa rõ").split(',').pop().trim()}</span>
        </p>
        <h3 className={`text-xl font-bold mb-1 line-clamp-2 uppercase leading-tight transition-colors ${
          isPast ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white group-hover:text-purple-400'
        }`} title={event.ten_show || "Chưa có tên"}>
          {event.ten_show || "Chưa có tên"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 font-medium text-base mb-4 line-clamp-1">
          {(event.dia_diem || "Chưa cập nhật địa điểm").split(',')[0]}
        </p>

        <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <img src={event.organizer_avatar} alt="org" className="w-5 h-5 rounded-full object-cover grayscale opacity-80" onError={e => e.target.style.display='none'} />
          <span>{event.organizer_name || "Chưa cập nhật"}</span>
        </div>
      </div>
    </div>
  </Link>
);

const EventList = ({ initialSearch = '', events = [] }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const filterEvents = (listToFilter) => {
    const term = searchTerm.toLowerCase();
    return listToFilter.filter(event => {
      const showName = event.ten_show || "Chưa có tên";
      const loc = event.dia_diem || "Chưa cập nhật địa điểm";
      const org = event.organizer_name || "Unknown";
      return showName.toLowerCase().includes(term) ||
             loc.toLowerCase().includes(term) ||
             org.toLowerCase().includes(term);
    });
  };

  const now = new Date();
  const upcomingEvents = filterEvents(events.filter(e => e.status === 'upcoming' || new Date(e.ngay_gio) > now));
  const pastEvents = filterEvents(events.filter(e => e.status === 'past' || new Date(e.ngay_gio) <= now));

  return (
    <div className="py-8">
      {/* Search Bar */}
      <div className="mb-10 relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện, địa điểm, nghệ sĩ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-white dark:bg-[#111] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-lg transition-colors shadow-sm"
        />
      </div>

      {/* UPCOMING EVENTS */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sự Kiện Sắp Diễn Ra</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-5">Khám phá các buổi diễn đang hot nhất hiện nay</p>
          </div>
          <span className="hidden sm:block text-sm text-gray-400 font-medium">{upcomingEvents.length} sự kiện</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => (
            <FadeInCard key={event.id} index={idx % 3}>
              <EventCard event={event} isPast={false} />
            </FadeInCard>
          )) : (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy sự kiện sắp tới</h3>
              <p className="text-gray-500 dark:text-gray-400">Hiện không có sự kiện nào phù hợp</p>
            </div>
          )}
        </div>
      </section>

      {/* PAST EVENTS */}
      {pastEvents.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></span>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sự Kiện Đã Kết Thúc</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 ml-5">Những sự kiện đình đám đã diễn ra trước đó</p>
            </div>
            <span className="hidden sm:block text-sm text-gray-400 font-medium">{pastEvents.length} sự kiện</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, idx) => (
              <FadeInCard key={event.id} index={idx % 3}>
                <EventCard event={event} isPast={true} />
              </FadeInCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventList;
