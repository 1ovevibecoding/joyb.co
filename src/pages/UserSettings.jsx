import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [saved, setSaved] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');

  if (!user) {
    navigate('/login');
    return null;
  }

  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : n[0].toUpperCase();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser({ name, phone, avatar, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' }) : 'N/A';

  return (
    <div className="flex-grow w-full bg-gray-50 dark:bg-[#0a0a0a] pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Cài đặt tài khoản</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý hồ sơ và tuỳ chỉnh cá nhân</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Quay lại</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm mb-6">
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 relative">
            <div className="absolute -bottom-12 left-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#141416] shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white cursor-pointer relative overflow-hidden group"
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(name)
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* User Info + Stats */}
          <div className="pt-16 px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                {user.role === 'organizer' && (
                  <span className="inline-block mt-2 text-[10px] font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 rounded-full uppercase tracking-wider">Organizer</span>
                )}
              </div>
            </div>

            {/* Membership badge */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Thành viên từ {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span>Chỉnh sửa hồ sơ</span>
          </h3>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1e] text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#111] text-gray-500 dark:text-gray-500 text-sm font-medium cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 mt-1.5">Email không thể thay đổi</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1e] text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0912 345 678"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Giới thiệu ngắn</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1e] text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Fan cuồng nhiệt của những sự kiện đỉnh cao 🎶"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all text-sm"
            >
              {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
            </button>
            {saved && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-in fade-in">Cập nhật thành công</span>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Truy cập nhanh</h3>
          </div>
          <a href="/" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Khám phá sự kiện</p>
                <p className="text-[11px] text-gray-500">Tìm sự kiện mới và đặt vé</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-[#141416] rounded-2xl border border-red-200 dark:border-red-900/40 overflow-hidden shadow-sm">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Đăng xuất</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Bạn sẽ cần đăng nhập lại để truy cập tài khoản</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm whitespace-nowrap"
            >
              Đăng xuất
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserSettings;
