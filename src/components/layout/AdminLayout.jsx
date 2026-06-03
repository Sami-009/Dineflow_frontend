// AdminLayout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Utensils, ClipboardList, LogOut, ArrowLeft, User, TrendingUp } from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/menu');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: 'Dashboard Overview',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Manage Menu Items',
      path: '/admin/menu',
      icon: Utensils,
    },
    {
      label: 'Manage Orders Queue',
      path: '/admin/orders',
      icon: ClipboardList,
    },
    {
      label: 'Reports Page',
      path: '/admin/reports',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Dark theme */}
      <aside className="w-64 bg-slate-900 flex flex-col h-full flex-shrink-0 shadow-xl border-r border-slate-800">
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
          <span className="h-9 w-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/20">
            DF
          </span>
          <span className="text-lg font-bold text-white tracking-wide">
            DineFlow Admin
          </span>
        </div>

        {/* User Info Card */}
        <div className="p-4 mx-4 my-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-slate-200 truncate">
              {user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              Role: {user?.role || 'admin'}
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all-300 ${
                  active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            to="/menu"
            className="flex items-center space-x-3 px-4 py-2.5 text-xs font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Customer Side</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-medium text-red-400 rounded-lg hover:bg-red-950/30 hover:text-red-300 transition-all-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Header bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-800">
            {navItems.find((n) => isActive(n.path))?.label || 'Admin Panel'}
          </h1>
          <div className="text-xs text-gray-400 font-medium">
            System Status: <span className="text-emerald-500 font-semibold">Online</span>
          </div>
        </header>

        {/* View content window */}
        <main className="flex-grow p-8 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
