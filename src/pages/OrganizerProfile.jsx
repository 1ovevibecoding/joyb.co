import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEnrichedEvents } from '../data/eventLoader';

const OrganizerProfile = () => {
  const { name } = useParams();
  const organizerName = decodeURIComponent(name || '');
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getEnrichedEvents().then(allEvents => {
      // Lọc ra các sự kiện của đúng nhà tổ chức này
      const matchedEvents = allEvents.filter(e => 
        e.organizer_name?.toLowerCase().includes(organizerName.toLowerCase())
      );
      setEvents(matchedEvents);
      setLoading(false);
    });
  }, [organizerName]);

  // Extract avatar from the first event or use fallback
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}&background=random&color=fff&size=200`;
  const avatar = events.length > 0 ? events[0].organizer_avatar : fallbackAvatar;

  // Format date helper
  const formatDateTimeShort = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-gray-50 dark:bg-[#0a0a0a] min-h-screen pb-20">
      
      {/* Profil Header Banner */}
      <div className="w-full bg-gray-900 border-b border-gray-800 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"></div>
          <div className="absolute top-20 -left-20 w-72 h-72 bg-pink-600/20 blur-3xl rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#18181b] shadow-2xl shrink-0 overflow-hidden bg-white">
              <img src={avatar} alt={organizerName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">Verified Partner</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
                {organizerName}
              </h1>
              <p className="text-gray-400 font-medium">Nhà tổ chức sự kiện chuyên nghiệp với {events.length} show diễn trên JoyB</p>
            </div>
            <div className="pb-2">
               <button className="px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg">
                 Đăng Ký Theo Dõi 🔔
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sự kiện của nhà tổ chức</h2>
          <span className="text-sm font-bold text-gray-500 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">{events.length} Events</span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
            <span className="text-5xl block mb-4">🎭</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chưa có sự kiện nào</h3>
            <p className="text-gray-500 dark:text-gray-400">Nhà tổ chức này chưa có hoặc đã gỡ tất cả sự kiện hiện tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Link 
                key={event.id}
                to={`/event/${event.id}`}
                className="group flex flex-col sm:flex-row bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
              >
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden relative">
                  <img src={event.anh_banner} alt={event.ten_show} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase">
                    {formatDateTimeShort(event.ngay_gio)}
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-center flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 uppercase line-clamp-2 leading-tight group-hover:text-purple-500 transition-colors">
                    {event.ten_show}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="truncate">{event.dia_diem.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-3 border-t border-gray-100 dark:border-gray-800/50 pt-3">
                    <span className="font-bold text-purple-600 dark:text-purple-400">Mua vé ngay &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfile;
