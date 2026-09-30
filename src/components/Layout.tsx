import { useState } from 'react';
import { GraduationCap, LayoutDashboard, Upload, PlayCircle, Award, CreditCard, ListTodo, Bell, Sun, Moon, LogOut, Menu, X, Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { ModuleKey, Notification } from '@/types';

interface LayoutProps {
  activeModule: ModuleKey;
  onModuleChange: (m: ModuleKey) => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onDismissNotification: (id: string) => void;
  onToggleNotification: (id: string) => void;
  children: React.ReactNode;
}

const navItems: { key: ModuleKey; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: 'assignments', label: 'Assignments', icon: <Upload className="h-5 w-5" /> },
  { key: 'lectures', label: 'Lectures', icon: <PlayCircle className="h-5 w-5" /> },
  { key: 'performance', label: 'Performance', icon: <Award className="h-5 w-5" /> },
  { key: 'fees', label: 'Fee Payment', icon: <CreditCard className="h-5 w-5" /> },
  { key: 'planner', label: 'Exam Planner', icon: <ListTodo className="h-5 w-5" /> },
];

const moduleTitles: Record<ModuleKey, string> = {
  dashboard: 'Dashboard Overview',
  assignments: 'Assignment Portal',
  lectures: 'Lectures & Videos',
  performance: 'Performance & Grades',
  fees: 'Fee Payment Portal',
  planner: 'Exam Planner & To-Do',
};

export default function Layout({
  activeModule,
  onModuleChange,
  notifications,
  onMarkAllRead,
  onDismissNotification,
  onToggleNotification,
  children,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
  };

  const handleNavClick = (key: ModuleKey) => {
    onModuleChange(key);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex-shrink-0 bg-slate-900 dark:bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">EduQuest</span>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeModule === item.key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Theme toggle + Logout */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{moduleTitles[activeModule]}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search (decorative but functional focus) */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 w-56 lg:w-72">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search courses, assignments..."
                  className="bg-transparent border-0 outline-0 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full ml-2"
                />
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User avatar */}
              <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Notification Drawer */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
          <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">{unreadCount} new</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Bell className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`relative p-4 rounded-xl border transition-all ${
                      notif.read
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50'
                        : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50'
                    }`}
                  >
                    <button
                      onClick={() => onToggleNotification(notif.id)}
                      className={`absolute left-2 top-4 w-2 h-2 rounded-full ${notif.read ? 'bg-transparent border border-slate-300 dark:border-slate-600' : 'bg-blue-500'}`}
                    />
                    <div className="pl-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{notif.title}</p>
                        <button
                          onClick={() => onDismissNotification(notif.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notif.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
