import React, { useState, useRef, useEffect } from 'react';
import { Bell, Inbox } from 'lucide-react';

const TopHeader = ({ title, subtitle, children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-purple-100 px-8 py-4 shadow-sm shadow-purple-500/5">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Page-specific actions (Search bars, Export buttons, etc.) */}
          {children}

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-full transition-all duration-300 relative ${
                showNotifications 
                  ? 'bg-purple-100 text-[#6739B7]' 
                  : 'text-gray-500 hover:bg-purple-50 hover:text-[#6739B7]'
              }`}
            >
              <Bell className="w-6 h-6" />
              {/* Notification Dot */}
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5252] rounded-full border border-white ring-1 ring-white"></span>
            </button>

            {/* Notification Dropdown Box */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden transform transition-all duration-200 origin-top-right z-50 animate-in fade-in slide-in-from-top-2">
                
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <span className="text-xs font-medium text-[#6739B7] bg-purple-50 px-2 py-1 rounded-full">
                    0 New
                  </span>
                </div>

                {/* Empty State Body */}
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-[#9575CD]" />
                  </div>
                  <h4 className="text-gray-900 font-bold mb-1">All caught up!</h4>
                  <p className="text-sm text-gray-500">
                    You have no new notifications at the moment.
                  </p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#6739B7] hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;