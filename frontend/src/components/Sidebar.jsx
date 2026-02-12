import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { 
  BarChart3, PieChart, Upload, Calendar, Eye, User, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Determine active page based on current path
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: Upload, label: 'Upload PDF', path: '/upload' },
    { icon: Calendar, label: 'History', path: '/history' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-teal-100 flex flex-col z-50 transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 rounded-xl blur-lg opacity-40"></div>
            <div className="bg-gradient-to-br from-teal-400 to-teal-300 p-2 rounded-xl relative">
               <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
            ExpenseLens
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
              isActive(item.path)
                ? 'bg-teal-50 text-teal-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`} />
              <span>{item.label}</span>
            </div>
            {isActive(item.path) && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-teal-50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-300 rounded-full flex items-center justify-center shadow-md shadow-teal-200">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</div>
          </div>
          <button onClick={logout}>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;