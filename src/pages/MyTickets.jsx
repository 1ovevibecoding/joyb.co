import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, coins } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(o => ({
          orderId: o.id,
          eventId: o.event_id,
          eventName: o.event?.ten_show || 'Sự kiện bí ẩn',
          eventVenue: o.event?.dia_diem || 'Chưa xác định',
          eventDate: o.event?.ngay_gio || new Date(),
          eventBanner: o.event?.anh_banner || 'https://via.placeholder.com/300x150',
          seats: typeof o.seats === 'string' ? JSON.parse(o.seats) : o.seats,
          status: o.status.toLowerCase(),
          paymentMethod: 'bank',
          subtotal: Number(o.totalAmount),
          serviceFee: 0,
          grandTotal: Number(o.totalAmount),
          timestamp: o.createdAt,
          buyerName: o.user?.name || user.name,
          buyerEmail: o.user?.email || user.email,
          buyerPhone: o.invoice_phone || 'N/A'
        }));
        setOrders(formatted);
      })
      .catch(err => console.error('Error fetching user orders:', err));
  }, [user]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getLevel = (c) => {
    if (c >= 500) return { name: 'V.I.P Member', color: 'from-purple-500 to-pink-500', icon: '👑' };
    if (c >= 100) return { name: 'Concert Goer', color: 'from-blue-500 to-cyan-500', icon: '🎵' };
    return { name: 'Rookie Fan', color: 'from-gray-500 to-gray-400', icon: '🌱' };
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'bank': return 'Chuyển khoản';
      case 'card': return 'Thẻ tín dụng';
      case 'ewallet': return 'Ví điện tử';
      default: return method;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">✓ Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-yellow-500/20">⏳ Pending</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-500/20">✕ Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-500/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full">{status}</span>;
    }
  };

  // ========== EMPTY STATE ==========
  if (orders.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1e1e24] border border-[#27272a] flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Chưa có vé nào</h2>
          <p className="text-gray-500 text-sm mb-6">Bạn chưa mua vé cho sự kiện nào. Khám phá các sự kiện đang diễn ra!</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
            Khám phá sự kiện
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full bg-[#121212] pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-white mb-6 transition-colors group text-sm font-medium">
              <svg className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Về trang chủ
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Vé của tôi
              <span className="block text-sm font-medium text-gray-500 normal-case tracking-normal mt-1">
                {orders.length} đơn hàng • My Tickets
              </span>
            </h1>
          </div>

          {user && user.role === 'user' && (
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 flex items-center gap-4 min-w-[280px]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${getLevel(coins).color}`}>
                {getLevel(coins).icon}
              </div>
              <div>
                <p className="text-white font-bold">{user.name}</p>
                <p className="text-[11px] text-gray-400 mb-1">{user.email}</p>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${getLevel(coins).color}`}>
                    {getLevel(coins).name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-xs font-bold text-yellow-500">🪙 {coins}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order list */}
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const isExpanded = expandedOrder === idx;
            const eventDate = new Date(order.eventDate);
            const isPast = eventDate < new Date();

            return (
              <div key={order.orderId} className={`bg-[#18181b] border rounded-2xl overflow-hidden transition-all ${isPast ? 'border-[#27272a] opacity-70' : 'border-[#27272a]'}`}>
                {/* Order Header — always visible */}
                <button onClick={() => setExpandedOrder(isExpanded ? null : idx)} className="w-full text-left p-5 flex items-start gap-4 hover:bg-[#1a1a1e] transition-colors">
                  {/* Event banner */}
                  <img src={order.eventBanner} alt="event" className="w-16 h-16 object-cover rounded-xl border border-gray-800 shrink-0" />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h3 className="text-sm font-extrabold text-white uppercase leading-tight truncate">{order.eventName}</h3>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatDate(order.eventDate)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {order.eventVenue}
                      </span>
                      <span>{order.seats.length} vé</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white font-bold text-sm">{formatPrice(order.grandTotal)}</span>
                      <svg className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-[#27272a] bg-[#111113]">
                    {/* Order meta */}
                    <div className="px-5 py-3 bg-[#0f0f12] flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-gray-600 font-medium uppercase tracking-wider">
                      <span>Mã: <span className="text-gray-400">{order.orderId}</span></span>
                      <span>Ngày mua: <span className="text-gray-400">{formatDate(order.timestamp)} {formatTime(order.timestamp)}</span></span>
                      <span>Thanh toán: <span className="text-gray-400">{getPaymentLabel(order.paymentMethod)}</span></span>
                    </div>

                    {/* Seat cards */}
                    <div className="p-5 space-y-2">
                      <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider mb-3">Chi tiết ghế</p>
                      {order.seats.map((seat, si) => (
                        <div key={si} className="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl p-3 relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ backgroundColor: seat.tierColor }}></div>
                          <div className="flex items-center space-x-2 flex-1 pl-2">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seat.tierColor }}></div>
                            <span className="text-xs font-bold uppercase" style={{ color: seat.tierColor }}>{seat.tierName}</span>
                          </div>
                          <div className="flex items-center space-x-5 text-center">
                            <div>
                              <span className="block text-[8px] text-gray-600 uppercase tracking-wider font-semibold">Section</span>
                              <span className="block text-white text-xs font-bold">{seat.sectionId || '—'}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-gray-600 uppercase tracking-wider font-semibold">Row</span>
                              <span className="block text-white text-xs font-bold">{String.fromCharCode(65 + seat.row)}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-gray-600 uppercase tracking-wider font-semibold">Seat</span>
                              <span className="block text-white text-xs font-bold">{seat.seat + 1}</span>
                            </div>
                          </div>
                          <span className="text-white font-bold text-xs ml-6 whitespace-nowrap">{formatPrice(seat.price)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price breakdown */}
                    <div className="px-5 pb-5">
                      <div className="bg-[#0f0f12] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Tạm tính ({order.seats.length} vé)</span>
                          <span className="text-gray-300">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Phí dịch vụ</span>
                          <span className="text-gray-300">{formatPrice(order.serviceFee)}</span>
                        </div>
                        <div className="border-t border-[#27272a] pt-2 mt-2 flex justify-between">
                          <span className="font-black text-white text-sm">Tổng</span>
                          <span className="font-black text-green-400 text-sm">{formatPrice(order.grandTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Buyer info */}
                    <div className="px-5 pb-5">
                      <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider mb-2">Thông tin người nhận</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                        <span>📧 {order.buyerEmail}</span>
                        <span>📱 {order.buyerPhone}</span>
                        <span>👤 {order.buyerName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
