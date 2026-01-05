import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, 
  PieChart, BarChart3, ShoppingBag, Coffee, Car, Home, Smartphone, 
  MoreHorizontal, Eye, Bell, Settings, LogOut, User, Upload, Download, 
  Filter, Target, Activity, Percent, ChevronRight, CreditCard, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

// --- Configuration & Constants ---
const COLORS = {
  primary: '#00C4B4',
  secondary: '#5EE0D9',
  accent: '#2DD4BF',
  danger: '#FB7185',
  warning: '#FBBF24',
  bg: '#F0FDFA',
  text: '#111827',
  grid: '#E5E7EB'
};

const CHART_COLORS = ['#00C4B4', '#5EE0D9', '#99F6E4', '#CCFBF1', '#0F766E'];

// --- Mock Data for Detailed Section ---
const dailyData = Array.from({ length: 15 }, (_, i) => ({
  day: i + 1,
  income: Math.floor(Math.random() * 5000),
  expense: Math.floor(Math.random() * 3000),
  balance: Math.floor(Math.random() * 2000)
}));

const categoryDetailedData = [
  { name: 'Housing', amount: 12000, limit: 12000 },
  { name: 'Food', amount: 8500, limit: 10000 },
  { name: 'Transport', amount: 4200, limit: 5000 },
  { name: 'Shopping', amount: 3800, limit: 3000 }, // Over budget
  { name: 'Entertainment', amount: 2100, limit: 4000 },
];

const topTransactions = [
  { id: 1, name: 'Apple Store', date: 'Oct 24, 2025', amount: 82000, category: 'Electronics', icon: Smartphone },
  { id: 2, name: 'Monthly Rent', date: 'Oct 01, 2025', amount: 15000, category: 'Housing', icon: Home },
  { id: 3, name: 'Supermarket', date: 'Oct 12, 2025', amount: 4500, category: 'Food', icon: ShoppingBag },
  { id: 4, name: 'Uber Rides', date: 'Oct 15, 2025', amount: 850, category: 'Transport', icon: Car },
  { id: 5, name: 'Starbucks', date: 'Oct 28, 2025', amount: 450, category: 'Dining', icon: Coffee },
];

// --- Reusable UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-teal-100 shadow-sm hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-teal-100 rounded-xl shadow-xl z-50">
        <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs font-medium">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-500 capitalize">{entry.name}:</span>
            <span className="text-gray-900">
              {typeof entry.value === 'number' && entry.value > 100 
                ? `₹${entry.value.toLocaleString()}` 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Sidebar Component ---
const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: PieChart, label: 'Analytics', id: 'analytics' },
    { icon: Upload, label: 'Upload PDF', id: 'upload' },
    { icon: Calendar, label: 'History', id: 'history' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-teal-100 flex flex-col z-50">
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
                ? 'bg-teal-50 text-teal-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${activePage === item.id ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500'}`} />
              <span>{item.label}</span>
            </div>
            {activePage === item.id && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-teal-50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors group">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-300 rounded-full flex items-center justify-center shadow-md shadow-teal-200">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">John Doe</div>
            <div className="text-xs text-gray-500 truncate">john@expenselens.com</div>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-teal-500" />
        </div>
      </div>
    </div>
  );
};

// --- Top Header ---
const TopHeader = () => {
  return (
    <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-teal-100 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            Welcome back, John <span className="w-1 h-1 bg-gray-300 rounded-full"></span> Updated 5 mins ago
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-1 py-1 rounded-xl border border-gray-100">
            {['Week', 'Month', 'Year'].map((period) => (
              <button key={period} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${period === 'Month' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {period}
              </button>
            ))}
          </div>

          <button className="p-2.5 hover:bg-teal-50 text-gray-500 hover:text-teal-600 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>

          <button className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-gray-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modern Overview Card ---
const OverviewCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, colorClass }) => {
  const isUp = trend === 'up';
  
  return (
    <Card className="p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colorClass} text-white shadow-lg shadow-teal-500/20`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-500'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
      </div>
    </Card>
  );
};

// --- Overview Charts ---

const IncomeExpenseChart = () => {
  const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
  ];

  return (
    <Card className="p-6 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Income vs Expenses</h3>
          <p className="text-sm text-gray-500">Yearly breakdown</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-400"></span> Income
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span> Expense
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C4B4" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00C4B4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FB7185" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FB7185" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#00C4B4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expense" stroke="#FB7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const SpendingPieChart = () => {
  const data = [
    { name: 'Dining', value: 400 },
    { name: 'Shopping', value: 300 },
    { name: 'Travel', value: 300 },
    { name: 'Bills', value: 200 },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Categories</h3>
      <p className="text-sm text-gray-500 mb-6">Where your money goes</p>
      
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RePieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-gray-900">₹1.2k</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md" style={{ backgroundColor: CHART_COLORS[index] }}></div>
              <span className="text-gray-600 font-medium">{item.name}</span>
            </div>
            <span className="font-bold text-gray-900">₹{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const HeatmapCalendar = () => {
  // Simulating 7 days x 8 weeks
  const weeks = 8;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getIntensity = () => {
    const rand = Math.random();
    if (rand > 0.8) return 'bg-teal-500'; // High
    if (rand > 0.6) return 'bg-teal-400';
    if (rand > 0.4) return 'bg-teal-300';
    if (rand > 0.2) return 'bg-teal-100'; // Low
    return 'bg-gray-100'; // None
  };

  return (
    <Card className="p-6 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Spending Frequency</h3>
          <p className="text-sm text-gray-500">Daily activity map</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-gray-100"></div>
          <div className="w-3 h-3 rounded bg-teal-300"></div>
          <div className="w-3 h-3 rounded bg-teal-500"></div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 pt-6">
          {days.map(day => <span key={day} className="text-xs text-gray-400 h-6 flex items-center">{day}</span>)}
        </div>
        <div className="flex gap-2 flex-1 overflow-x-auto pb-2">
          {[...Array(weeks)].map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 mb-1">W{weekIndex + 1}</span>
              {days.map((_, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`w-8 h-6 rounded-md hover:ring-2 ring-offset-2 ring-teal-400 transition-all cursor-pointer ${getIntensity()}`}
                  title="₹2,400 spent"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const GoalsCard = () => {
  const goals = [
    { name: 'New Laptop', current: 65000, target: 80000, color: 'bg-teal-500' },
    { name: 'Vacation', current: 20000, target: 50000, color: 'bg-indigo-400' },
    { name: 'Emergency Fund', current: 95000, target: 100000, color: 'bg-emerald-400' },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Financial Goals</h3>
        <button className="text-teal-500 hover:bg-teal-50 p-2 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal, idx) => {
          const percent = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={idx} className="group cursor-pointer">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{goal.name}</span>
                <span className="text-sm font-bold text-gray-900">{percent}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${goal.color} transition-all duration-1000 ease-out group-hover:opacity-80`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>₹{goal.current.toLocaleString()}</span>
                <span>Target: ₹{goal.target.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-3 border border-dashed border-teal-200 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors">
        + Add New Goal
      </button>
    </Card>
  );
};

// --- NEW SECTION COMPONENTS (Detailed Analytics) ---

const DetailedComparisonChart = () => {
  return (
    <Card className="p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Daily Evolution</h3>
          <p className="text-sm text-gray-500">Daily Income vs Expense Breakdown (Oct)</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span> Income
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> Expense
          </div>
           <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Balance
          </div>
        </div>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dailyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="day" scale="band" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" barSize={12} fill="#00C4B4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" barSize={12} fill="#FB7185" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const DetailedCategoryChart = () => {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Category Deep Dive</h3>
        <p className="text-sm text-gray-500">Highest spenders this month</p>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryDetailedData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#4B5563' }} width={80} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#F3F4F6'}} content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#00C4B4" radius={[0, 4, 4, 0]} barSize={25}>
               {categoryDetailedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > entry.limit ? '#FB7185' : '#00C4B4'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const BudgetStatus = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Budget vs Actuals</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Monthly Limits</span>
      </div>
      <div className="space-y-5">
        {categoryDetailedData.map((cat, idx) => {
          const percentage = Math.min((cat.amount / cat.limit) * 100, 100);
          const isOver = cat.amount > cat.limit;
          
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{cat.name}</span>
                <span className={`font-bold ${isOver ? 'text-rose-500' : 'text-gray-900'}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-teal-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                <span>Spent: ₹{cat.amount.toLocaleString()}</span>
                <span>Limit: ₹{cat.limit.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
};

const TopExpensesList = () => {
  return (
    <Card className="p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Top 5 Expenses</h3>
          <p className="text-sm text-gray-500">Highest value transactions</p>
        </div>
        <button className="text-sm text-teal-600 font-medium hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pl-2">Transaction</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right pr-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topTransactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-xl text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <tx.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{tx.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {tx.category}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-500">{tx.date}</td>
                <td className="py-4 pr-2 text-right font-bold text-sm text-gray-900">
                  ₹{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// --- Main Layout ---
const Analytics = () => {
  const [activePage, setActivePage] = useState('analytics');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-900">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="ml-72 flex-1 flex flex-col min-w-0">
        <TopHeader />
        
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OverviewCard
              title="Total Balance"
              value="₹1,24,500"
              subtitle="+2.5% from last month"
              icon={Activity}
              trend="up"
              trendValue="12%"
              colorClass="from-teal-400 to-teal-600"
            />
             <OverviewCard
              title="Monthly Savings"
              value="₹42,300"
              subtitle="24% of income"
              icon={Target}
              trend="up"
              trendValue="8%"
              colorClass="from-indigo-400 to-indigo-600"
            />
             <OverviewCard
              title="Total Expenses"
              value="₹18,240"
              subtitle="-5% from last week"
              icon={ShoppingBag}
              trend="down"
              trendValue="5%"
              colorClass="from-rose-400 to-rose-600"
            />
            <OverviewCard
              title="Upcoming Bills"
              value="₹4,200"
              subtitle="Due in 3 days"
              icon={Calendar}
              trend="neutral"
              trendValue="0%"
              colorClass="from-amber-400 to-amber-600"
            />
          </div>

          {/* Overview Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <IncomeExpenseChart />
            <SpendingPieChart />
          </div>

          {/* Secondary Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HeatmapCalendar />
            <GoalsCard />
          </div>

          {/* --- NEW SECTION: DETAILED MONTHLY ANALYTICS --- */}
          <div className="pt-4 border-t border-dashed border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Detailed Monthly Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Row 1: Daily Graph & Category Bar */}
              <DetailedComparisonChart />
              <DetailedCategoryChart />
              
              {/* Row 2: Top Expenses & Budget Progress */}
              <TopExpensesList />
              <BudgetStatus />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Analytics;