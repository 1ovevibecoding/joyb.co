import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const OrganizerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNav = [
    { name: 'Sự kiện của tôi', path: '/organizer/my-events', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  ];

  const policyNav = [
    { name: 'Ticketing for Organizers', path: '/info/ticketing-for-organizers', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { name: 'Pricing', path: '/info/pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Compare To Others', path: '/info/compare', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Feature Updates', path: '/info/feature-updates', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  return (
    <div className="flex bg-[#121212] min-h-screen text-gray-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1c] border-r border-[#27272a] hidden md:flex flex-col">
        <div className="p-6 flex items-center mb-8">
          <div className="w-8 h-8 bg-green-500 rounded text-black font-black flex items-center justify-center text-xs mr-3">box</div>
          <span className="text-green-500 font-bold text-lg tracking-tight">Organizer Center</span>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
          {/* Main Workspace section */}
          <div className="space-y-2">
            <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Workspace</div>
            {mainNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-[#27272a] text-white font-semibold border-l-2 border-green-500' : 'text-gray-400 hover:text-gray-200 hover:bg-[#202024]'
                  }`}
                >
                  <div className="w-5 h-5 opacity-70">
                    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Policy/Terms section */}
          <div className="space-y-2">
            <div className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3" style={{marginTop: '1rem'}}>Tài liệu & Điều khoản</div>
            {policyNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-[#27272a] text-white font-semibold border-l-2 border-green-500' : 'text-gray-400 hover:text-gray-200 hover:bg-[#202024]'
                  }`}
                >
                  <div className="w-5 h-5 opacity-70">
                    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-sm">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 mb-4 mt-auto">
          <div className="flex items-center justify-between bg-[#27272a] rounded-full px-4 py-2">
            <span className="text-xs font-semibold text-gray-400">Ngôn ngữ</span>
            <div className="flex items-center bg-[#1a1a1c] rounded-full px-2 py-1 space-x-1 cursor-pointer">
              <span className="text-xs text-white">Vie</span>
              <div className="w-3 h-3 bg-red-600 rounded-sm flex items-center justify-center"><div className="text-[6px] text-yellow-400">★</div></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#1a1a1c] border-b border-[#27272a] flex items-center justify-between px-6 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
               <button 
                onClick={() => navigate('/organizer/create-event')}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center transition-colors"
                >
                 <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 Tạo sự kiện
               </button>
               <div className="relative group cursor-pointer">
                 <div className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-[#27272a]">
                    <div className="w-7 h-7 bg-gray-500 rounded-full overflow-hidden">
                        {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <div className="w-full h-full bg-gray-600 flex items-center justify-center">{user?.name?.charAt(0)}</div>}
                    </div>
                    <span className="text-sm font-medium">Tài khoản</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 relative">
          {/* Faint subtle background glow as in screenshot */}
          <div className="fixed top-0 left-64 w-[800px] h-[500px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizerLayout;
