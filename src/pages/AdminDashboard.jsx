import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, CheckCircle, AlertCircle, Clock, Settings, Eye, MoreVertical } from 'lucide-react';


// Mock data
const revenueData = [
  { month: 'Jan', revenue: 45000, profit: 28000 },
  { month: 'Feb', revenue: 52000, profit: 31000 },
  { month: 'Mar', revenue: 48000, profit: 29000 },
  { month: 'Apr', revenue: 61000, profit: 38000 },
  { month: 'May', revenue: 55000, profit: 34000 },
  { month: 'Jun', revenue: 67000, profit: 42000 },
  { month: 'Jul', revenue: 72000, profit: 45000 },
  { month: 'Aug', revenue: 68000, profit: 43000 },
  { month: 'Sep', revenue: 74000, profit: 47000 },
  { month: 'Oct', revenue: 79000, profit: 50000 },
  { month: 'Nov', revenue: 85000, profit: 54000 },
  { month: 'Dec', revenue: 92000, profit: 58000 },
];

const userGrowthData = [
  { day: 'Day 1', users: 120 },
  { day: 'Day 2', users: 145 },
  { day: 'Day 3', users: 138 },
  { day: 'Day 4', users: 162 },
  { day: 'Day 5', users: 155 },
  { day: 'Day 6', users: 178 },
  { day: 'Day 7', users: 190 },
];

const orderStatusData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'Processing', value: 28, color: '#3b82f6' },
  { name: 'Pending', value: 18, color: '#f59e0b' },
  { name: 'Cancelled', value: 9, color: '#ef4444' },
];

const recentOrders = [
  { id: '#1001', customer: 'Sarah Johnson', amount: '$487.23', status: 'completed', date: '2024-04-02' },
  { id: '#1002', customer: 'Michael Chen', amount: '$892.50', status: 'processing', date: '2024-04-02' },
  { id: '#1003', customer: 'Emma Wilson', amount: '$345.67', status: 'completed', date: '2024-04-01' },
  { id: '#1004', customer: 'James Brown', amount: '$721.89', status: 'pending', date: '2024-04-01' },
  { id: '#1005', customer: 'Lisa Anderson', amount: '$567.34', status: 'completed', date: '2024-03-31' },
];

const recentActivity = [
  { id: 1, type: 'user', message: 'New user registered', time: '2 minutes ago', icon: Users },
  { id: 2, type: 'order', message: 'Order #1001 completed', time: '15 minutes ago', icon: CheckCircle },
  { id: 3, type: 'event', message: 'New event created', time: '1 hour ago', icon: Calendar },
  { id: 4, type: 'system', message: 'System maintenance scheduled', time: '3 hours ago', icon: AlertCircle },
  { id: 5, type: 'payment', message: 'Payment received: $5,234', time: '5 hours ago', icon: DollarSign },
];



const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('overview');
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Guard
  useEffect(() => {
    if (user && user.role?.toLowerCase() !== 'admin') navigate('/');
  }, [user, navigate]);

  // Fetch real events from API
  useEffect(() => {
    fetchEvents();
    fetchOrders();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('http://localhost:5000/api/events?status=all');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
    setLoadingEvents(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
    setLoadingOrders(false);
  };

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  // Event approval actions
  const handleApproval = async (eventId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approved_by: user.id })
      });
      if (res.ok) {
        // Update local state
        setEvents(prev => prev.map(e =>
          e.id === eventId
            ? { ...e, approval_status: status, approved_by: status === 'approved' ? user.id : null, approved_at: status === 'approved' ? new Date().toISOString() : null }
            : e
        ));
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  // Gather users from localStorage (keeping existing behavior)
  const allUsers = JSON.parse(localStorage.getItem('vibee_users') || '[]').filter(u => u.role !== 'admin');
  const organizers = allUsers.filter(u => u.role === 'organizer');

  // Stats
  const stats = {
    totalUsers: 12428,
    totalRevenue: 54320,
    totalOrders: 1852,
    avgResponse: 2.3,
    pendingEvents: events.filter(e => e.approval_status === 'pending_approval').length,
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+4.2%',
      icon: Users,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Revenue',
      value: '$' + stats.totalRevenue.toLocaleString(),
      change: '+8.5%',
      icon: DollarSign,
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+2.1%',
      icon: Calendar,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Avg Response',
      value: stats.avgResponse + 's',
      change: '-0.3s',
      icon: TrendingUp,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Status badge style
  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return styles[status] || styles.pending;
  };

  // Render functions for modules
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`${card.color} rounded-lg border border-gray-200 dark:border-gray-700 p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.iconColor} bg-white dark:bg-gray-800`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="users" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {orderStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'user' && <Users size={20} className="text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'order' && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
                  {activity.type === 'event' && <Calendar size={20} className="text-purple-600 dark:text-purple-400" />}
                  {activity.type === 'system' && <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />}
                  {activity.type === 'payment' && <DollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{order.customer}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tổng cộng: {allUsers.length} tài khoản</h3>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>
      </div>

      {allUsers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Chưa có tài khoản nào</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {allUsers
                .filter(u =>
                  !searchQuery ||
                  u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${u.role === 'organizer'
                          ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300'
                          : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        }`}>
                        {u.role === 'organizer' ? 'Organizer' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors hover:underline">
                        Ban
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ─── MODULE 3-6: Keep simplified versions ───
  const renderFinance = () => (
    <div className="text-center py-20">
      <div className="inline-block mb-6">
        <div className="text-6xl mb-4">💰</div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Quản lý tài chính</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Module này đang được phát triển</p>
      <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
        Quay lại
      </button>
    </div>
  );

  const renderOrganizers = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng: {organizers.length} Organizer</h3>
      </div>

      {organizers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Chưa có Organizer nào đăng ký</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizers.map(org => (
            <div key={org.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {org.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{org.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{org.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                  ✓ Xác minh
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTickets = () => (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lịch sử giao dịch mua vé toàn cục</h3>
        <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Làm mới
        </button>
      </div>

      {loadingOrders ? (
        <div className="text-center py-20 text-gray-500">Đang tải biểu đồ dữ liệu...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Chưa có giao dịch mua vé nào được thực hiện.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Mã GD</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Sự kiện</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ghế đã giữ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const seatsList = Array.isArray(order.seats) ? order.seats : [];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.event?.ten_show || 'Sự kiện ẩn'}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.event?.organizer_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {seatsList.length > 0 ? seatsList.map((seat, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono border border-gray-200 dark:border-gray-600">
                            {seat.label || seat}
                          </span>
                        )) : <span className="text-xs text-gray-500">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                        {order.totalAmount?.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSystem = () => (
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cài đặt & Kiểm soát hệ thống</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">Tài khoản Admin</h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">
              SA
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email} · Super Admin</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">Thông tin test</h4>
          <div className="space-y-2 font-mono text-sm">
            <div><span className="text-gray-600 dark:text-gray-400">Email:</span> <span className="text-gray-900 dark:text-white font-bold">admin@joyb.vn</span></div>
            <div><span className="text-gray-600 dark:text-gray-400">Password:</span> <span className="text-gray-900 dark:text-white font-bold">admin123</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'events': return renderEvents();
      case 'users': return renderUsers();
      case 'finance': return renderFinance();
      case 'organizers': return renderOrganizers();
      case 'tickets': return renderTickets();
      case 'system': return renderSystem();
      default: return renderEvents();
    }
  };

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Xin chào, ${user?.name}`}
      modules={modulesWithBadges}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      stats={statCards}
    >
      {(() => {
        switch (activeModule) {
          case 'events':
            return renderEvents();
          case 'users':
            return renderUsers();
          case 'finance':
            return renderFinance();
          case 'organizers':
            return renderOrganizers();
          case 'tickets':
            return renderTickets();
          case 'system':
            return renderSystem();
          default:
            return renderEvents();
        }
      })()}
    </AdminLayout>
  );
};

export default AdminDashboard;
