import { useAuth } from '../hooks/useAuth';

import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalendarIcon, Users, Settings, Clock, IndianRupee, Menu, X, ArrowLeft, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarIcon },
  { path: '/admin/calendar', label: 'Calendar', icon: Clock },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/pricing', label: 'Pricing', icon: IndianRupee },
  { path: '/admin/availability', label: 'Availability', icon: Clock }, // we could use different icons
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };
  const location = useLocation();

  const getPageTitle = () => {
    const item = NAV_ITEMS.find(i => i.path === location.pathname || (i.path !== '/admin' && location.pathname.startsWith(i.path)));
    return item ? item.label : 'Admin';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col z-50 shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <span className="text-xl font-bold tracking-tight">You Work Admin</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-800">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Website</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed inset-y-0 z-10">
        <div className="p-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight">You Work Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Website</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5 w-full mt-2 border-t border-slate-800 pt-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || "Admin User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <LogOut onClick={handleSignOut} className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="hidden sm:block w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};
