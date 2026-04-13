import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminLayout - Reusable admin panel layout component
 * Provides consistent structure: Header + Sidebar + Main Content
 * Inspired by Bootstrap Admin Template best practices
 */
const AdminLayout = ({
  title,
  subtitle,
  modules = [],
  activeModule,
  onModuleChange,
  headerActions = null,
  children,
  stats = null,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('vibee_user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#111113] border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left: Logo/Brand + Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h1>
              </div>
            </div>
          </div>

          {/* Center: Search (optional) */}
          {headerActions && <div className="hidden sm:flex items-center gap-4">{headerActions}</div>}

          {/* Right: User Menu */}
          <div className="flex items-center gap-3 ml-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-bold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors ml-2 border-l border-gray-200 dark:border-gray-800 pl-3"
              title="Logout"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTAINER ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── SIDEBAR ─── */}
        <aside
          className={`w-64 bg-white dark:bg-[#111113] border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-all duration-300 lg:sticky lg:top-16 lg:z-20 ${
            sidebarOpen ? 'fixed left-0 top-16 h-[calc(100vh-4rem)] z-40' : 'hidden lg:flex'
          } flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Modules</p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 flex-1">
            {modules.map((mod) => {
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    onModuleChange(mod.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left group ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30'
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                    {mod.icon}
                  </span>
                  <span className="flex-1">{mod.label}</span>
                  {mod.badge !== undefined && mod.badge > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full flex-shrink-0">
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer - User Profile Card */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/20">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
                  {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {headerActions && <div className="sm:hidden">{headerActions}</div>}
              </div>

              {/* Stats Cards */}
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#141416] rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-purple-400/30 dark:hover:border-purple-600/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${stat.badgeClass}`}>
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="pb-8">{children}</div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
