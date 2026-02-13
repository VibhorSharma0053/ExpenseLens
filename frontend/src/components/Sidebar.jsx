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
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-purple-100 flex flex-col z-50 transition-all duration-300">
      
      {/* --- Logo Header --- */}
      <div className="p-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
          <div className="relative">
            {/* Glow effect changed from Teal to Purple */}
            <div className="absolute inset-0 bg-[#6739B7] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="bg-gradient-to-br from-[#6739B7] to-[#9575CD] p-2 rounded-xl relative shadow-lg shadow-purple-200">
               <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6739B7] to-[#9575CD]">
            ExpenseLens
          </span>
        </div>
      </div>

      {/* --- Navigation Menu --- */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                active
                  ? 'bg-purple-50 text-[#6739B7] font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#6739B7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  className={`w-5 h-5 transition-colors duration-300 ${
                    active ? 'text-[#6739B7]' : 'text-gray-400 group-hover:text-[#6739B7]'
                  }`} 
                />
                <span>{item.label}</span>
              </div>
              
              {/* Active Indicator Dot */}
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#6739B7] shadow-[0_0_8px_rgba(103,57,183,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* --- User Profile Footer --- */}
      <div className="p-4 border-t border-purple-50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors group">
          {/* User Avatar Background */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#6739B7] to-[#9575CD] rounded-full flex items-center justify-center shadow-md shadow-purple-200 group-hover:shadow-purple-300 transition-all">
            <User className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate group-hover:text-[#6739B7] transition-colors">
              {user?.name || 'User'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </div>
          </div>
          
          <button onClick={logout} className="p-2 hover:bg-red-50 rounded-lg transition-colors group/logout">
            <LogOut className="w-4 h-4 text-gray-400 group-hover/logout:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;