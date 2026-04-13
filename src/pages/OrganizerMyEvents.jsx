import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnrichedEvents } from '../data/eventLoader';

const OrganizerMyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.role?.toLowerCase() !== 'organizer') {
      navigate('/');
      return;
    }

    const fetchMyEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events?status=all&organizer=${encodeURIComponent(user.name)}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user, navigate]);

  const formatDateTimeFull = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-[#0a0a0a] min-h-screen pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Sự kiện của tôi</h1>
            <p className="text-gray-400 mt-1">Quản lý và chỉnh sửa các sự kiện bạn đã tạo trên JoyB</p>
          </div>
          <Link 
            to="/organizer/create-event"
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tạo sự kiện mới
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-12 text-center shadow-lg">
            <span className="text-5xl block mb-4">🎭</span>
            <h3 className="text-xl font-bold text-white mb-2">Chưa có sự kiện nào</h3>
            <p className="text-gray-400 mb-6">Bạn chưa tạo sự kiện nào trên hệ thống.</p>
            <Link to="/organizer/create-event" className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors inline-block">
              Tạo sự kiện đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden flex flex-col md:flex-row hover:border-purple-500/50 transition-colors">
                
                <div className="w-full md:w-64 h-40 shrink-0 bg-[#111] relative">
                  <img src={event.anh_banner} alt={event.ten_show} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {event.approval_status === 'approved' ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded uppercase">Đã duyệt</span>
                    ) : event.approval_status === 'rejected' ? (
                      <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded uppercase">Bị từ chối</span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded uppercase">Chờ duyệt</span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-xl text-white mb-1 uppercase line-clamp-1">{event.ten_show}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{formatDateTimeFull(event.ngay_gio)}</span>
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{event.dia_diem.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#27272a] pt-3 mt-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Vé: {(event.ticket_tiers || []).length} hạng</span>
                      <span className="text-gray-700">•</span>
                      <span className="text-gray-500">
                        {event.seats_io_chart_key ? (
                          <span className="text-green-400">Đã gán Sơ đồ Seats.io</span>
                        ) : event.venueLayout ? (
                          <span className="text-blue-400">Dùng Sơ đồ Basic</span>
                        ) : (
                          <span className="text-yellow-400">Chưa có Sơ đồ</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link 
                        to={`/event/${event.id}`}
                        className="px-4 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white text-sm font-medium rounded transition-colors"
                      >
                        Preview
                      </Link>
                      <Link 
                        to={`/organizer/edit-event/${event.id}`}
                        className="flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Chỉnh sửa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerMyEvents;
