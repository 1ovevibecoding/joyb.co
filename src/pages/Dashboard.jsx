import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Bell, Menu, Sun, Moon,
  LayoutDashboard, Users, Settings,
  TrendingUp, Shield, Activity, X,
  ArrowUpRight, ArrowDownRight, Calendar, DollarSign, LogOut, FileText,
  RefreshCw, AlertTriangle, CheckCircle, XCircle, EyeOff, Clock,
  Terminal, ChevronDown, Filter, Eye, Ban, RotateCcw, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const API = 'http://localhost:5000';

// ─── Helpers ──────────────────────────────────
const fmtVND = (n) => (Number(n) || 0).toLocaleString('vi-VN') + 'đ';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';
const relTime = (d) => {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  if (diff < 60000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return fmtDate(d);
};

const StatusBadge = ({ status }) => {
  const map = {
    approved:         'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    pending_approval: 'bg-amber-100   text-amber-700   dark:bg-amber-500/20   dark:text-amber-400',
    rejected:         'bg-rose-100    text-rose-700    dark:bg-rose-500/20    dark:text-rose-400',
    hidden:           'bg-gray-200    text-gray-600    dark:bg-gray-700       dark:text-gray-400',
    COMPLETED:        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    PENDING:          'bg-amber-100   text-amber-700   dark:bg-amber-500/20   dark:text-amber-400',
    CANCELLED:        'bg-rose-100    text-rose-700    dark:bg-rose-500/20    dark:text-rose-400',
  };
  const label = {
    pending_approval: 'Pending', approved: 'Approved', rejected: 'Rejected',
    hidden: 'Hidden', COMPLETED: 'Paid', PENDING: 'Pending', CANCELLED: 'Cancelled',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${map[status] || map.hidden}`}>
      {label[status] || status}
    </span>
  );
};

const LogLevelBadge = ({ level }) => {
  const map = {
    info:   'bg-blue-100  text-blue-700  dark:bg-blue-500/20  dark:text-blue-400',
    warn:   'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    error:  'bg-rose-100  text-rose-700  dark:bg-rose-500/20  dark:text-rose-400',
    action: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  };
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${map[level] || map.info}`}>
      {level}
    </span>
  );
};

// ─── Reject Modal ──────────────────────────────
const RejectModal = ({ event, onConfirm, onClose }) => {
  const [reason, setReason] = useState('');
  const presets = [
    'Nội dung vi phạm tiêu chuẩn cộng đồng',
    'Thông tin sự kiện không đầy đủ hoặc không chính xác',
    'Hình ảnh banner không đạt chất lượng yêu cầu',
    'Thông tin giá vé không hợp lệ',
    'Sự kiện trùng lặp đã tồn tại trên hệ thống',
  ];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Từ chối sự kiện</h3>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{event?.ten_show}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Lý do có sẵn</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button key={i} onClick={() => setReason(p)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hoặc nhập lý do riêng</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Mô tả lý do từ chối..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Huỷ
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => reason.trim() && onConfirm(reason)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Data state ──
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [orders, setOrders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [financeData, setFinanceData] = useState(null);
  const [activeHolds, setActiveHolds] = useState([]);
  const [loading, setLoading] = useState({});

  // ── Filters ──
  const [eventFilter, setEventFilter] = useState('all');
  const [logLevel, setLogLevel] = useState('all');
  const [logCategory, setLogCategory] = useState('all');
  const [financeRange, setFinanceRange] = useState('30');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // ── Modals ──
  const [rejectTarget, setRejectTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  // ── Auto-refresh log ──
  const logIntervalRef = useRef(null);
  const [autoRefreshLogs, setAutoRefreshLogs] = useState(false);

  // Security guard
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin') navigate('/');
  }, [user, navigate]);

  const setLoad = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Fetchers ──
  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/admin/stats/overview`);
      if (r.ok) setStats(await r.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoad('events', true);
    try {
      const r = await fetch(`${API}/api/events?status=all`);
      if (r.ok) setEvents(await r.json());
    } catch (e) { console.error(e); }
    setLoad('events', false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoad('users', true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (userRoleFilter !== 'all') params.set('role', userRoleFilter);
      if (userSearch) params.set('search', userSearch);
      const r = await fetch(`${API}/api/admin/users?${params}`);
      if (r.ok) {
        const d = await r.json();
        setAllUsers(d.users || d);
        setTotalUsers(d.total || (d.users || d).length);
      }
    } catch (e) { console.error(e); }
    setLoad('users', false);
  }, [userRoleFilter, userSearch]);

  const fetchOrders = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/admin/orders`);
      if (r.ok) setOrders(await r.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '150', level: logLevel, category: logCategory });
      const r = await fetch(`${API}/api/admin/logs?${params}`);
      if (r.ok) {
        const d = await r.json();
        setLogs(d.logs || []);
        setTotalLogs(d.total || 0);
      }
    } catch (e) { console.error(e); }
  }, [logLevel, logCategory]);

  const fetchFinance = useCallback(async () => {
    setLoad('finance', true);
    try {
      const r = await fetch(`${API}/api/admin/finance?range=${financeRange}`);
      if (r.ok) setFinanceData(await r.json());
    } catch (e) { console.error(e); }
    setLoad('finance', false);
  }, [financeRange]);

  const fetchHolds = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/admin/active-holds`);
      if (r.ok) setActiveHolds((await r.json()).holds || []);
    } catch (e) { console.error(e); }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchEvents();
    fetchOrders();
  }, []);

  // Module-specific fetches
  useEffect(() => {
    if (activeModule === 'users') fetchUsers();
    if (activeModule === 'logs') { fetchLogs(); fetchHolds(); }
    if (activeModule === 'finance') fetchFinance();
  }, [activeModule]);

  useEffect(() => { if (activeModule === 'users') fetchUsers(); }, [userRoleFilter, userSearch]);
  useEffect(() => { if (activeModule === 'logs') fetchLogs(); }, [logLevel, logCategory]);
  useEffect(() => { if (activeModule === 'finance') fetchFinance(); }, [financeRange]);

  // Auto-refresh logs
  useEffect(() => {
    if (autoRefreshLogs && activeModule === 'logs') {
      logIntervalRef.current = setInterval(fetchLogs, 3000);
    } else {
      clearInterval(logIntervalRef.current);
    }
    return () => clearInterval(logIntervalRef.current);
  }, [autoRefreshLogs, activeModule, fetchLogs]);

  // ── Actions ──
  const handleApprove = async (eventId, eventName) => {
    try {
      const r = await fetch(`${API}/api/admin/events/${eventId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: user.id, admin_name: user.name }),
      });
      if (r.ok) {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, approval_status: 'approved' } : e));
        fetchStats();
        notify(`✅ Đã duyệt: "${eventName}"`);
      }
    } catch (e) { notify('Lỗi khi duyệt sự kiện', 'error'); }
  };

  const handleReject = async (eventId, reason) => {
    try {
      const r = await fetch(`${API}/api/admin/events/${eventId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: user.id, admin_name: user.name, reason }),
      });
      if (r.ok) {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, approval_status: 'rejected' } : e));
        setRejectTarget(null);
        fetchStats();
        notify(`❌ Đã từ chối sự kiện`);
      }
    } catch (e) { notify('Lỗi khi từ chối sự kiện', 'error'); }
  };

  const handleHide = async (eventId) => {
    try {
      const r = await fetch(`${API}/api/admin/events/${eventId}/hide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: user.id }),
      });
      if (r.ok) {
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, approval_status: 'hidden' } : e));
        notify('Sự kiện đã được ẩn');
      }
    } catch (e) { console.error(e); }
  };

  const handleSuspendUser = async (userId, userEmail, suspend) => {
    try {
      const r = await fetch(`${API}/api/admin/users/${userId}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspended: suspend, admin_name: user.name }),
      });
      if (r.ok) {
        notify(`${suspend ? '🔴 Đã suspend' : '🟢 Đã khôi phục'}: ${userEmail}`);
        fetchLogs();
      }
    } catch (e) { notify('Lỗi thao tác', 'error'); }
  };

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  // ── KPI Cards from real stats ──
  const kpiCards = stats ? [
    {
      title: 'Tổng người dùng', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10',
      value: stats.users.total.toLocaleString(),
      sub: `+${stats.users.newThisMonth} tháng này`,
      change: stats.users.changePercent, isUp: stats.users.changePercent >= 0,
    },
    {
      title: 'Doanh thu tháng', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10',
      value: fmtVND(stats.revenue.thisMonth),
      sub: `Tổng: ${fmtVND(stats.revenue.total)}`,
      change: stats.revenue.changePercent, isUp: stats.revenue.changePercent >= 0,
    },
    {
      title: 'Sự kiện', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10',
      value: stats.events.total.toString(),
      sub: `${stats.events.pending} chờ duyệt`,
      change: stats.events.pending, isUp: true, changeSuffix: ' pending',
    },
    {
      title: 'Vé đã bán', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10',
      value: stats.tickets.total.toLocaleString(),
      sub: `${stats.tickets.activeHolds} ghế đang giữ`,
      change: stats.tickets.thisMonth, isUp: true, changeSuffix: ' tháng này',
    },
  ] : [];

  // ══════════════════════════════
  // RENDER: OVERVIEW
  // ══════════════════════════════
  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Xin chào, {user?.name} · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={() => { fetchStats(); fetchEvents(); fetchOrders(); notify('Đã làm mới dữ liệu'); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      {/* KPI Cards */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{c.title}</p>
                  <div className={`p-2.5 rounded-xl ${c.bg}`}><Icon size={18} className={c.color} /></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{c.value}</h3>
                <p className="text-xs text-gray-400">{c.sub}</p>
                <div className="mt-3 flex items-center gap-1.5">
                  {c.isUp ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                  <span className={`text-xs font-semibold ${c.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {c.change > 0 ? '+' : ''}{c.change}{c.changeSuffix || '%'}
                  </span>
                  <span className="text-xs text-gray-400">vs tháng trước</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 h-36 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Chart */}
      {stats?.charts?.revenueByDay && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Doanh thu 7 ngày gần nhất</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.charts.revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 11 }}
                  tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}k`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '10px' }}
                  formatter={(v) => [fmtVND(v), 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#gRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Events Quick Review */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Chờ duyệt ({events.filter(e => e.approval_status === 'pending_approval').length})
            </h3>
            <button onClick={() => setActiveModule('events')} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            {events.filter(e => e.approval_status === 'pending_approval').slice(0, 4).map(ev => (
              <div key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ev.ten_show}</p>
                  <p className="text-xs text-gray-500">{ev.organizer_name} · {fmtDate(ev.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => handleApprove(ev.id, ev.ten_show)}
                    className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 transition-colors">
                    <CheckCircle size={15} />
                  </button>
                  <button onClick={() => setRejectTarget(ev)}
                    className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-200 transition-colors">
                    <XCircle size={15} />
                  </button>
                </div>
              </div>
            ))}
            {events.filter(e => e.approval_status === 'pending_approval').length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">✅ Không có sự kiện nào chờ duyệt</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              Giao dịch gần nhất
            </h3>
            <button onClick={() => setActiveModule('tickets')} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-2">
            {(stats?.recent?.orders || orders.slice(0, 5)).map(o => (
              <div key={o.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {o.user?.name?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{o.user?.name || 'Guest'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{o.event?.ten_show || '—'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{fmtVND(o.totalAmount)}</p>
                  <p className="text-[10px] text-gray-400">{relTime(o.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════
  // RENDER: EVENTS MODERATION
  // ══════════════════════════════
  const renderEvents = () => {
    const filterCounts = {
      all: events.length,
      pending_approval: events.filter(e => e.approval_status === 'pending_approval').length,
      approved: events.filter(e => e.approval_status === 'approved').length,
      rejected: events.filter(e => e.approval_status === 'rejected').length,
      hidden: events.filter(e => e.approval_status === 'hidden').length,
    };
    const filtered = eventFilter === 'all' ? events : events.filter(e => e.approval_status === eventFilter);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Event Moderation</h3>
          <button onClick={fetchEvents} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw size={14} /> Làm mới
          </button>
        </div>

        {/* Filter tabs with count badges */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterCounts).map(([f, count]) => (
            <button key={f} onClick={() => setEventFilter(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2
                ${eventFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                }`}>
              {f === 'all' ? 'Tất cả' : f === 'pending_approval' ? '⏳ Chờ duyệt' : f === 'approved' ? '✅ Đã duyệt' : f === 'rejected' ? '❌ Từ chối' : '👁️ Ẩn'}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${eventFilter === f ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-4">Sự kiện</th>
                  <th className="px-5 py-4">Ban tổ chức</th>
                  <th className="px-5 py-4">Ngày diễn</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{ev.ten_show}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{ev.dia_diem}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{ev.organizer_name || 'JoyB'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(ev.ngay_gio)}</td>
                    <td className="px-5 py-4"><StatusBadge status={ev.approval_status} /></td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/organizer/edit-event/${ev.id}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-colors" title="Xem/Sửa">
                          <Eye size={15} />
                        </button>
                        {ev.approval_status === 'pending_approval' && (
                          <>
                            <button onClick={() => handleApprove(ev.id, ev.ten_show)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors" title="Duyệt">
                              <CheckCircle size={15} />
                            </button>
                            <button onClick={() => setRejectTarget(ev)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-colors" title="Từ chối">
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        {ev.approval_status === 'approved' && (
                          <button onClick={() => handleHide(ev.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 transition-colors" title="Ẩn">
                            <EyeOff size={15} />
                          </button>
                        )}
                        {(ev.approval_status === 'hidden' || ev.approval_status === 'rejected') && (
                          <button onClick={() => handleApprove(ev.id, ev.ten_show)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors" title="Khôi phục">
                            <RotateCcw size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">Không có sự kiện nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════
  // RENDER: USERS
  // ══════════════════════════════
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Quản lý người dùng <span className="text-gray-400 font-normal text-base">({totalUsers})</span>
        </h3>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Tất cả role</option>
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Người dùng</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Đơn hàng</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading.users ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Đang tải...</td></tr>
              ) : allUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      u.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                      u.role?.toLowerCase() === 'organizer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{u._count?.orders ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    {u.role?.toLowerCase() !== 'admin' && (
                      <button onClick={() => handleSuspendUser(u.id, u.email, true)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline transition-colors flex items-center gap-1 ml-auto">
                        <Ban size={12} /> Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════
  // RENDER: TICKETS
  // ══════════════════════════════
  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lịch sử giao dịch</h3>
          <p className="text-sm text-gray-400 mt-1">Tổng cộng {orders.length} giao dịch</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Mã GD</th>
                <th className="px-5 py-4">Người mua</th>
                <th className="px-5 py-4">Sự kiện</th>
                <th className="px-5 py-4">Ghế</th>
                <th className="px-5 py-4 text-right">Tổng tiền</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {orders.map(o => {
                const seats = Array.isArray(o.seats) ? o.seats : [];
                return (
                  <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        #{o.id?.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {o.user?.name?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{o.user?.name || 'Guest'}</p>
                          <p className="text-[11px] text-gray-400">{o.user?.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white max-w-[180px] truncate">{o.event?.ten_show || '—'}</p>
                      <p className="text-[11px] text-gray-400">{o.event?.organizer_name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {seats.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-200 dark:border-indigo-500/30">
                            {typeof s === 'object' ? s.label : s}
                          </span>
                        ))}
                        {seats.length > 3 && <span className="text-[10px] text-gray-400">+{seats.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{fmtVND(o.totalAmount)}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{fmtDateTime(o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════
  // RENDER: FINANCE
  // ══════════════════════════════
  const renderFinance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Finance Report</h3>
        <div className="flex items-center gap-3">
          <select value={financeRange} onChange={e => setFinanceRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="7">7 ngày</option>
            <option value="30">30 ngày</option>
            <option value="90">90 ngày</option>
            <option value="365">1 năm</option>
          </select>
          <button onClick={fetchFinance} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw size={14} /> Cập nhật
          </button>
        </div>
      </div>

      {loading.finance && !financeData ? (
        <div className="text-center py-20 text-gray-400">Đang tải dữ liệu tài chính...</div>
      ) : financeData ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Tổng doanh thu', value: fmtVND(financeData.totalRevenue), icon: DollarSign, color: 'text-emerald-500' },
              { label: 'Tổng đơn hàng', value: financeData.totalOrders.toLocaleString(), icon: FileText, color: 'text-blue-500' },
              { label: 'Vé đã bán', value: financeData.totalTickets.toLocaleString(), icon: TrendingUp, color: 'text-indigo-500' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={18} className={c.color} />
                    <span className="text-sm text-gray-500">{c.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
                </div>
              );
            })}
          </div>

          {/* Daily revenue chart */}
          {financeData.dailyRevenue?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white mb-5">Doanh thu theo ngày</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeData.dailyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}k`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '10px' }}
                      formatter={(v) => [fmtVND(v), 'Doanh thu']} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Revenue by event */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white">Doanh thu theo sự kiện</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Sự kiện</th>
                    <th className="px-5 py-3">Ban tổ chức</th>
                    <th className="px-5 py-3 text-right">Doanh thu</th>
                    <th className="px-5 py-3 text-right">Vé</th>
                    <th className="px-5 py-3 text-right">Đơn hàng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {financeData.byEvent.map((ev) => (
                    <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white max-w-[220px] truncate">{ev.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{ev.organizer}</td>
                      <td className="px-5 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">{fmtVND(ev.revenue)}</td>
                      <td className="px-5 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{ev.tickets}</td>
                      <td className="px-5 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{ev.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 py-20">Không có dữ liệu</p>
      )}
    </div>
  );

  // ══════════════════════════════
  // RENDER: SYSTEM LOG
  // ══════════════════════════════
  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Terminal size={20} className="text-indigo-400" /> System Log
          </h3>
          <p className="text-sm text-gray-400 mt-1">{totalLogs} entries · {autoRefreshLogs ? '🟢 Live' : '⚪ Paused'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoRefreshLogs(!autoRefreshLogs)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${
              autoRefreshLogs
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            <Zap size={14} /> {autoRefreshLogs ? 'Live ON' : 'Auto-refresh'}
          </button>
          <button onClick={fetchLogs}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Active Holds widget */}
      {activeHolds.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4">
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
            <Clock size={16} /> {activeHolds.length} ghế đang bị giữ (Hold-Seat active)
          </p>
          <div className="flex flex-wrap gap-2">
            {activeHolds.map((h, i) => (
              <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg font-mono">
                User {h.userId?.slice(0, 6)} · {h.seatCount} ghế · {h.expiresIn}s
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={logLevel} onChange={e => setLogLevel(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Level: All</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="action">Action</option>
        </select>
        <select value={logCategory} onChange={e => setLogCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">Category: All</option>
          <option value="auth">auth</option>
          <option value="event">event</option>
          <option value="order">order</option>
          <option value="user">user</option>
          <option value="seatsio">seatsio</option>
          <option value="system">system</option>
        </select>
      </div>

      {/* Log entries */}
      <div className="bg-gray-950 dark:bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden font-mono">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-500 text-xs ml-2">joybvn-server — system.log</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto p-4 space-y-1.5">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-8">Không có log nào. Refresh để kiểm tra.</p>
          ) : logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 text-xs hover:bg-white/5 rounded px-2 py-1.5 transition-colors group">
              <span className="text-gray-600 whitespace-nowrap shrink-0">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
              <LogLevelBadge level={log.level} />
              <span className="text-gray-500 shrink-0 w-14 truncate">[{log.category}]</span>
              <span className={`flex-1 ${
                log.level === 'error' ? 'text-rose-400' :
                log.level === 'warn' ? 'text-amber-400' :
                log.level === 'action' ? 'text-purple-400' :
                'text-gray-300'
              }`}>{log.message}</span>
              {log.meta && Object.keys(log.meta).length > 0 && (
                <span className="text-gray-600 text-[10px] hidden group-hover:block truncate max-w-[200px]">
                  {JSON.stringify(log.meta)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'overview': return renderOverview();
      case 'events': return renderEvents();
      case 'users': return renderUsers();
      case 'tickets': return renderTickets();
      case 'finance': return renderFinance();
      case 'logs': return renderLogs();
      default: return renderOverview();
    }
  };

  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'events', label: 'Event Moderation', icon: Calendar, badge: events.filter(e => e.approval_status === 'pending_approval').length },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'tickets', label: 'Tickets & Orders', icon: FileText },
    { key: 'finance', label: 'Finance', icon: DollarSign },
    { key: 'logs', label: 'System Log', icon: Terminal, badge: activeHolds.length || 0 },
  ];

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all
          ${notification.type === 'error' ? 'bg-rose-600' : 'bg-gray-900 dark:bg-gray-700 border border-gray-700'}`}>
          {notification.msg}
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          event={rejectTarget}
          onConfirm={(reason) => handleReject(rejectTarget.id, reason)}
          onClose={() => setRejectTarget(null)}
        />
      )}

      {/* Sidebar */}
      {!sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(true)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-30 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 dark:text-white">JoyB Admin</span>
              <p className="text-[10px] text-gray-400">Super Admin Panel</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ key, label, icon: Icon, badge }) => (
            <button key={key} onClick={() => setActiveModule(key)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors
                ${activeModule === key
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}>
              <div className="flex items-center gap-3">
                <Icon size={18} /> {label}
              </div>
              {badge > 0 && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 lg:px-8">
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/')} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" title="Về trang chủ">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
