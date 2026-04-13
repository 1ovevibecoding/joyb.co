import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();



  // Live clock — update every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
  };

  const formatClock = () => {
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const dayNames = lang === 'vi'
      ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayNames[now.getDay()];
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    return { time: `${h}:${m}`, date: `${day}, ${date}` };
  };

  const clock = formatClock();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo + Nav */}
            <div className="flex items-center space-x-8">
              <a href="/" className="flex-shrink-0 flex items-center group">
                <img src="/joyb-flame-logo.png" alt="JoyB" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
              </a>

              {/* Desktop Navigation — only essential links */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 font-bold transition-colors text-sm">
                  {lang === 'vi' ? 'Trang chủ' : 'Home'}
                </a>
                <a 
                  href="/about"
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 font-bold transition-colors text-sm"
                >
                  {lang === 'vi' ? 'Về chúng tôi' : 'About Us'}
                </a>
                {user?.role?.toLowerCase() === 'organizer' && (
                  <a href="/organizer/create-event" className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 font-bold transition-colors text-sm flex items-center space-x-1 border-l border-gray-300 dark:border-gray-700 pl-6 ml-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span>{lang === 'vi' ? 'Tổ chức sự kiện' : 'Host Event'}</span>
                  </a>
                )}
                {user?.role?.toLowerCase() === 'admin' && (
                  <a href="/dashboard" className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 font-bold transition-colors text-sm flex items-center space-x-1 border-l border-gray-300 dark:border-gray-700 pl-6 ml-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    <span>Dashboard</span>
                  </a>
                )}
              </nav>
            </div>

            {/* Actions Group */}
            <div className="flex items-center space-x-3">

              {/* Live Clock (desktop only) */}
              <div className="hidden lg:flex items-center space-x-2 text-gray-500 dark:text-gray-400 select-none">
                <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{clock.time}</span>
                  <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500">{clock.date}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

              {/* Theme Toggle — inline icon button */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Search */}
              <div className="relative flex items-center">
                {searchOpen && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      navigate('/?q=' + encodeURIComponent(searchQuery.trim()));
                      setSearchOpen(false);
                    }
                  }} className="absolute right-10 top-1/2 -translate-y-1/2 w-64">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => { setTimeout(() => setSearchOpen(false), 200); }}
                      placeholder={lang === 'vi' ? 'Tìm sự kiện...' : 'Search events...'}
                      className="w-full bg-gray-100 dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </form>
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* User Dropdown (desktop) */}
              {user ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center space-x-2 bg-gray-100 dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-purple-500 dark:hover:border-purple-500 rounded-full px-1 py-1 pr-3 shadow-sm transition-all focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-black text-white shadow-inner relative overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : getInitials(user.name)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user.name}</span>
                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out flex flex-col overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-800 shadow-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-black text-white shrink-0 relative overflow-hidden">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                            {user.role?.toLowerCase() === 'organizer' && (
                               <span className="inline-block mt-1 text-[9px] font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Organizer</span>
                            )}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5 bg-white dark:bg-[#131316]">
                        {user.role?.toLowerCase() === 'organizer' && (
                          <a href="/organizer/my-events" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item">
                              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg group-hover/item:scale-110 transition-transform">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Sự kiện của tôi</p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Quản lý và chỉnh sửa</p>
                              </div>
                          </a>
                        )}
                        <a href="/profile" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg group-hover/item:scale-110 transition-transform">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Hồ sơ cá nhân</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Đổi avatar, cập nhật thông tin</p>
                            </div>
                        </a>
                        
                        <a href="/my-tickets" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item">
                            <div className="p-2 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-lg group-hover/item:scale-110 transition-transform">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Lịch sử & vé của tôi</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Quản lý vé đã mua</p>
                            </div>
                        </a>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                        {/* Settings Row — Theme + Language inline */}
                        <div className="px-3 py-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Cài đặt</span>
                            <div className="flex items-center space-x-1.5">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className={`p-1.5 rounded-lg border transition-all text-xs ${
                                        theme === 'dark'
                                            ? 'border-purple-500 bg-purple-500/10 text-yellow-500'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                    )}
                                </button>
                                {/* Language Toggle */}
                                <button
                                    onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                                    className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                >
                                    {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-left transition-colors group/item">
                            <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg group-hover/item:scale-110 transition-transform">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <p className="text-sm font-bold text-red-600 dark:text-red-400">Đăng xuất</p>
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                <a href="/login" className="hidden sm:inline-flex items-center justify-center px-5 py-1.5 text-sm font-bold rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md transition-all">
                  {lang === 'vi' ? 'Đăng nhập' : 'Login'}
                </a>
              )}

              {/* Hamburger — mobile only */}
              <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Slide-out Menu — compact, no duplication with desktop dropdown */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white dark:bg-[#0f0f12] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Menu Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#1e1e24] flex items-center justify-between">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-black text-white shadow-inner">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[160px]">{user.name}</p>
                <p className="text-[10px] font-medium text-gray-500">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <img src="/joyb-flame-logo.png" alt="JoyB" className="h-7 w-auto" />
              <span className="text-lg font-black text-gray-900 dark:text-white">Menu</span>
            </div>
          )}
          <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="px-5 py-5 flex-grow overflow-y-auto space-y-1">
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2 px-3">Navigation</p>
          
          <a href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>{lang === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </a>

          {user && (
            <>
              <a href="/my-tickets" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                <span>{lang === 'vi' ? 'Vé của tôi' : 'My Tickets'}</span>
              </a>
              <a href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>{lang === 'vi' ? 'Hồ sơ' : 'Profile'}</span>
              </a>
            </>
          )}

          {user?.role?.toLowerCase() === 'organizer' && (
            <>
              <a href="/organizer/my-events" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5 transition-colors mt-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <span>{lang === 'vi' ? 'Sự kiện của tôi' : 'My Events'}</span>
                <span className="text-[8px] font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded-full ml-auto">ORG</span>
              </a>
              <a href="/organizer/create-event" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>{lang === 'vi' ? 'Tổ chức sự kiện' : 'Host Event'}</span>
                <span className="text-[8px] font-black text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/10 px-1.5 py-0.5 rounded-full ml-auto">ORG</span>
              </a>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-[#1e1e24] my-4"></div>

          {/* Settings */}
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2 px-3">
            {lang === 'vi' ? 'Cài đặt' : 'Settings'}
          </p>

          {/* Theme + Language compact row */}
          <div className="px-3 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lang === 'vi' ? 'Giao diện' : 'Theme'}</span>
              <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                  {theme === 'dark' ? (
                      <><svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg><span>{lang === 'vi' ? 'Sáng' : 'Light'}</span></>
                  ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>{lang === 'vi' ? 'Tối' : 'Dark'}</span></>
                  )}
              </button>
          </div>

          <div className="px-3 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lang === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
              <button
                  onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                  <span>{lang === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}</span>
              </button>
          </div>
        </div>

        {/* Menu Footer */}
        <div className="px-5 py-5 border-t border-gray-100 dark:border-[#1e1e24] bg-gray-50 dark:bg-transparent">
          {user ? (
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-transparent hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors text-sm font-bold shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>{lang === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
            </button>
          ) : (
            <a href="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-black hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              <span>{lang === 'vi' ? 'Đăng nhập / Đăng ký' : 'Login / Register'}</span>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
