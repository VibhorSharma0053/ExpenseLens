import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Upload,
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  DollarSign,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Smartphone,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Bell,
  Settings,
  LogOut,
  User,
  X,
  Download,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// --- NEW Sidebar Component ---
const Sidebar = ({ activePage, setActivePage, isDarkMode }) => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", id: "dashboard" },
    { icon: PieChart, label: "Analytics", id: "analytics" },
    { icon: Upload, label: "Upload PDF", id: "upload" },
    { icon: Calendar, label: "History", id: "history" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const baseClasses =
    "fixed left-0 top-0 h-screen w-72 border-r flex flex-col z-50 transition-colors duration-300";
  const themeClasses = isDarkMode
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-teal-100";

  return (
    <div className={`${baseClasses} ${themeClasses}`}>
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
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
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
              activePage === item.id
                ? "bg-teal-500/10 text-teal-500 font-semibold"
                : isDarkMode
                ? "text-slate-400 hover:bg-slate-800 hover:text-teal-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-teal-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`w-5 h-5 ${
                  activePage === item.id
                    ? "text-teal-500"
                    : isDarkMode
                    ? "text-slate-500 group-hover:text-teal-400"
                    : "text-gray-400 group-hover:text-teal-500"
                }`}
              />
              <span>{item.label}</span>
            </div>
            {activePage === item.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            )}
          </button>
        ))}
      </nav>

      <div
        className={`p-4 border-t ${
          isDarkMode ? "border-slate-700" : "border-teal-50"
        }`}
      >
        <div
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${
            isDarkMode ? "hover:bg-slate-800" : "hover:bg-teal-50"
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-300 rounded-full flex items-center justify-center shadow-md shadow-teal-200">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-bold truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              John Doe
            </div>
            <div className="text-xs text-gray-500 truncate">
              john@expenselens.com
            </div>
          </div>
          <LogOut
            className={`w-4 h-4 ${
              isDarkMode
                ? "text-slate-500 group-hover:text-teal-400"
                : "text-gray-400 group-hover:text-teal-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// Top Header Component
const TopHeader = ({ isDarkMode, toggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div
      className={`border-b px-8 py-4 transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-[#C2F0E7]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Welcome back! Here's your financial overview
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className={`pl-10 pr-4 py-2 w-64 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-transparent transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-gray-50 border-[#C2F0E7] text-gray-900"
              }`}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isDarkMode
                ? "hover:bg-slate-800 text-yellow-400"
                : "hover:bg-[#C2F0E7] text-gray-600"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-full transition-all duration-300 ${
                isDarkMode ? "hover:bg-slate-800" : "hover:bg-[#C2F0E7]"
              }`}
            >
              <Bell
                className={`w-6 h-6 ${
                  isDarkMode ? "text-slate-300" : "text-gray-600"
                }`}
              />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#00C4B4] rounded-full"></span>
            </button>
          </div>

          {/* Upload Button */}
          <button className="px-6 py-2 bg-[#00C4B4] hover:bg-[#5EE0D9] text-white rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all duration-300 transform hover:scale-105">
            <Upload className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({
  title,
  amount,
  change,
  isPositive,
  icon: Icon,
  iconBg,
  isDarkMode,
}) => {
  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
        isDarkMode
          ? "bg-slate-800 border-slate-700 hover:border-[#00C4B4] hover:shadow-[#00C4B4]/20"
          : "bg-white border-[#C2F0E7] hover:border-[#00C4B4] hover:shadow-[#00C4B4]/10"
      } hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
        >
          <Icon
            className={`w-6 h-6 ${
              iconBg === "bg-[#FFF0F5]" ? "text-rose-400" : "text-white"
            }`}
          />
        </div>
        <div
          className={`flex items-center space-x-1 text-sm font-semibold ${
            isPositive ? "text-[#00C4B4]" : "text-rose-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p
          className={`text-sm mb-1 ${
            isDarkMode ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {amount}
        </p>
      </div>
    </div>
  );
};

// --- Improved Spending Chart Component ---
const SpendingChart = ({ isDarkMode }) => {
  const [timeRange, setTimeRange] = useState('6M'); // State for toggle

  // Mock Data
  const data = [
    { name: 'Jan', amount: 12500, avg: 10000 },
    { name: 'Feb', amount: 18000, avg: 10000 },
    { name: 'Mar', amount: 15000, avg: 10000 },
    { name: 'Apr', amount: 9500, avg: 10000 },
    { name: 'May', amount: 22000, avg: 10000 },
    { name: 'Jun', amount: 17500, avg: 10000 },
  ];

  // Custom Tooltip for Hover Effect
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-700 text-white' 
            : 'bg-white/90 border-teal-100 text-gray-900'
        }`}>
          <p className="text-sm font-semibold mb-1">{label}</p>
          <p className="text-lg font-bold text-[#00C4B4]">
            ₹{payload[0].value.toLocaleString()}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Total Spent
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#C2F0E7]'
    }`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Spending Analysis
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <span className="text-[#00C4B4] font-semibold">+12.5%</span> vs last month
          </p>
        </div>

        {/* Time Range Toggles */}
        <div className={`flex items-center p-1 rounded-xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-100'
        }`}>
          {['6M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                timeRange === range
                  ? 'bg-[#00C4B4] text-white shadow-md shadow-teal-500/20'
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5EE0D9" />
                <stop offset="100%" stopColor="#00C4B4" />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDarkMode ? '#334155' : '#F3F4F6'} 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ 
                fill: isDarkMode ? '#94A3B8' : '#6B7280', 
                fontSize: 12,
                fontWeight: 500 
              }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ 
                fill: isDarkMode ? '#94A3B8' : '#6B7280', 
                fontSize: 12 
              }} 
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: isDarkMode ? '#334155' : '#F3F4F6', opacity: 0.4 }} 
            />
            
            <Bar 
              dataKey="amount" 
              fill="url(#barGradient)" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="url(#barGradient)"
                  className="transition-opacity duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Category Distribution Component
const CategoryDistribution = ({ isDarkMode }) => {
  const categories = [
    {
      name: "Food & Dining",
      amount: "₹12,450",
      percentage: 35,
      color: "from-[#00C4B4] to-[#5EE0D9]",
      icon: Coffee,
    },
    {
      name: "Shopping",
      amount: "₹8,230",
      percentage: 25,
      color: "from-[#5EE0D9] to-[#00C4B4]",
      icon: ShoppingBag,
    },
    {
      name: "Transport",
      amount: "₹5,120",
      percentage: 18,
      color: "from-[#00C4B4] to-[#5EE0D9]",
      icon: Car,
    },
    {
      name: "Bills & Utilities",
      amount: "₹4,890",
      percentage: 15,
      color: "from-[#5EE0D9] to-[#C2F0E7]",
      icon: Home,
    },
    {
      name: "Others",
      amount: "₹2,340",
      percentage: 7,
      color: "from-[#C2F0E7] to-[#5EE0D9]",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-[#C2F0E7]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Spending by Category
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            This month breakdown
          </p>
        </div>
        <button
          className={`p-2 rounded-lg transition-all ${
            isDarkMode ? "hover:bg-slate-700" : "hover:bg-[#C2F0E7]"
          }`}
        >
          <MoreHorizontal
            className={`w-5 h-5 ${
              isDarkMode ? "text-slate-400" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group p-3 rounded-xl transition-all duration-300 cursor-pointer ${
              isDarkMode ? "hover:bg-slate-700" : "hover:bg-[#C2F0E7]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isDarkMode ? "bg-slate-900" : "bg-[#FFF0F5]"
                  }`}
                >
                  <category.icon className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    {category.percentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {category.amount}
                </p>
              </div>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                isDarkMode ? "bg-slate-900" : "bg-gray-100"
              }`}
            >
              <div
                className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500 group-hover:scale-x-105`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Transactions Component
const RecentTransactions = ({ isDarkMode }) => {
  const transactions = [
    {
      id: 1,
      name: "Zomato Food Order",
      category: "Food & Dining",
      amount: "-₹485",
      date: "Today, 2:30 PM",
      type: "expense",
      icon: Coffee,
    },
    {
      id: 2,
      name: "Salary Credit",
      category: "Income",
      amount: "+₹85,000",
      date: "Today, 9:00 AM",
      type: "income",
      icon: DollarSign,
    },
    {
      id: 3,
      name: "Amazon Shopping",
      category: "Shopping",
      amount: "-₹2,340",
      date: "Yesterday, 6:45 PM",
      type: "expense",
      icon: ShoppingBag,
    },
    {
      id: 4,
      name: "Uber Ride",
      category: "Transport",
      amount: "-₹156",
      date: "Yesterday, 3:20 PM",
      type: "expense",
      icon: Car,
    },
    {
      id: 5,
      name: "Electricity Bill",
      category: "Bills",
      amount: "-₹1,240",
      date: "2 days ago",
      type: "expense",
      icon: Home,
    },
    {
      id: 6,
      name: "Freelance Payment",
      category: "Income",
      amount: "+₹12,000",
      date: "3 days ago",
      type: "income",
      icon: DollarSign,
    },
  ];

  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-[#C2F0E7]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Recent Transactions
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Latest activity
          </p>
        </div>
        <button className="text-[#00C4B4] text-sm font-semibold hover:text-[#5EE0D9] transition-colors flex items-center space-x-1">
          <span>View All</span>
          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
        </button>
      </div>

      <div className="space-y-1">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
              isDarkMode ? "hover:bg-slate-700" : "hover:bg-[#C2F0E7]"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                  transaction.type === "income"
                    ? "bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]"
                    : isDarkMode
                    ? "bg-slate-900"
                    : "bg-[#FFF0F5]"
                }`}
              >
                <transaction.icon
                  className={`w-6 h-6 ${
                    transaction.type === "income"
                      ? "text-white"
                      : "text-rose-400"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold group-hover:text-[#00C4B4] transition-colors ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {transaction.name}
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-500" : "text-gray-500"
                  }`}
                >
                  {transaction.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  transaction.type === "income"
                    ? "text-[#00C4B4]"
                    : isDarkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {transaction.amount}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-slate-500" : "text-gray-500"
                }`}
              >
                {transaction.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ isDarkMode }) => {
  const actions = [
    { icon: Upload, label: "Upload PDF", color: "from-[#00C4B4] to-[#5EE0D9]" },
    {
      icon: Download,
      label: "Export Data",
      color: "from-[#5EE0D9] to-[#00C4B4]",
    },
    {
      icon: Filter,
      label: "Set Filters",
      color: "from-[#00C4B4] to-[#5EE0D9]",
    },
    { icon: RefreshCw, label: "Refresh", color: "from-[#5EE0D9] to-[#C2F0E7]" },
  ];

  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-[#C2F0E7]"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 group ${
              isDarkMode
                ? "bg-gradient-to-br hover:from-slate-700 hover:to-slate-600 border-slate-700 hover:border-[#00C4B4]"
                : "bg-gradient-to-br hover:from-[#C2F0E7] hover:to-[#FFF0F5] border-[#C2F0E7] hover:border-[#00C4B4]"
            }`}
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-sm font-medium group-hover:text-[#00C4B4] transition-colors ${
                isDarkMode ? "text-slate-300" : "text-gray-700"
              }`}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isDarkMode={isDarkMode}
      />

      <div className="ml-72 transition-all duration-300">
        <TopHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Income"
              amount="₹85,234"
              change="+18%"
              isPositive={true}
              icon={ArrowUpRight}
              iconBg="bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Total Expenses"
              amount="₹45,234"
              change="-12%"
              isPositive={false}
              icon={ArrowDownRight}
              iconBg="bg-[#FFF0F5]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Net Savings"
              amount="₹40,000"
              change="+25%"
              isPositive={true}
              icon={DollarSign}
              iconBg="bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Transactions"
              amount="284"
              change="+8%"
              isPositive={true}
              icon={BarChart3}
              iconBg="bg-gradient-to-br from-[#5EE0D9] to-[#00C4B4]"
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SpendingChart isDarkMode={isDarkMode} />
            </div>
            <div>
              <QuickActions isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Category and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDistribution isDarkMode={isDarkMode} />
            <RecentTransactions isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
