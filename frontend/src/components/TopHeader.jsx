import React from 'react';
import { Bell } from 'lucide-react';

const TopHeader = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-teal-100 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* This allows pages to inject their own buttons/search bars */}
          {children}

          <button className="p-2 hover:bg-teal-50 rounded-full transition-all duration-300 relative text-gray-500 hover:text-teal-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;