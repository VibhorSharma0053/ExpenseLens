import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { 
  useAnalyticsSummary, 
  useMonthlyTrend, 
  useCategoryBreakdown,
  useDailyTrend // Custom hook from previous step
} from '../hooks/useData';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Activity, ShoppingBag, Download, BarChart3, 
  Loader, Info, ChevronDown, Calendar, FileX, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

// --- Constants ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const CHART_COLORS = ['#6739B7', '#E91E63', '#FF9800', '#FFC107', '#00C853', '#2979FF'];

const THEME = {
  primary: '#6739B7', 
  secondary: '#9575CD', 
  success: '#00C853', 
  danger: '#FF5252', 
  background: '#F5F5FA'
};

const MONTHS = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
];

// Generate years (Current year down to 2020)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({length: 5}, (_, i) => CURRENT_YEAR - i);

// --- Helpers ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  if (period === 'Week') start.setDate(end.getDate() - 7);
  else if (period === 'Month') start.setDate(1);
  else if (period === 'Year') start.setMonth(0, 1);
  return { start_date: start.toISOString(), end_date: end.toISOString() };
};

// --- Sub-Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-purple-100 rounded-xl shadow-xl z-50">
        <p className="text-sm font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs font-medium mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-500 capitalize">{entry.name}:</span>
            <span className="text-gray-900 font-bold">
              {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DailyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 border border-purple-100 rounded-xl shadow-xl z-50 min-w-[120px]">
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Day {label}</p>
          {payload.map((entry, index) => (
             entry.value > 0 && (
                <div key={index} className="flex justify-between items-center mb-1 gap-4">
                    <span className={`text-xs font-medium ${entry.name === 'Income' ? 'text-[#00C853]' : 'text-[#FF5252]'}`}>
                        {entry.name}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(entry.value)}
                    </span>
                </div>
             )
          ))}
        </div>
      );
    }
    return null;
  };

const OverviewCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, colorTheme, loading }) => {
  const isUp = trend === 'up';
  const styles = {
    purple: "from-[#6739B7] to-[#9575CD]",
    green: "from-[#00C853] to-[#69F0AE]",
    red: "from-[#FF5252] to-[#FF8A80]",
    blue: "from-[#2979FF] to-[#82B1FF]",
    orange: "from-[#FF9800] to-[#FFB74D]"
  };
  const gradientClass = styles[colorTheme] || styles.purple;

  return (
    <Card className="p-6 relative overflow-hidden group">
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradientClass} text-white shadow-lg shadow-gray-200`}>
              <Icon className="w-6 h-6" />
            </div>
            {trendValue && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trendValue}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold text-[#6739B7] mb-2">{value}</div>
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
        </>
      )}
    </Card>
  );
};

// --- Main Analytics Page ---
const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('Month'); 
  const [dateRange, setDateRange] = useState(getDateRange('Month'));
  
  // State for Daily Chart Selectors
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // State for Toast Notification
  const [showExportToast, setShowExportToast] = useState(false);

  // Hooks
  const { summary, loading: summaryLoading } = useAnalyticsSummary(dateRange);
  const { trends, loading: trendsLoading } = useMonthlyTrend(6);
  const { categories, loading: catLoading } = useCategoryBreakdown(dateRange);
  const { dailyData, loading: dailyLoading, hasData: dailyHasData } = useDailyTrend(selectedMonth, selectedYear);

  const handleFilterChange = (period) => {
    setTimeFilter(period);
    setDateRange(getDateRange(period));
  };

  const handleExportClick = () => {
    setShowExportToast(true);
    // Hide after 3 seconds
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const chartData = useMemo(() => {
    if (!trends) return [];
    return trends.map(t => ({
      name: t.month,
      income: t.total_received,
      expense: t.total_spent
    }));
  }, [trends]);

  const pieData = useMemo(() => {
    if (!categories) return [];
    return categories.map(c => ({
      name: c._id || 'Uncategorized',
      value: c.total
    }));
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#F5F5FA] transition-all duration-300 font-sans relative">
      
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed top-24 right-8 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-start gap-4 animate-in fade-in slide-in-from-top-5 duration-300 w-80 border-l-4 border-[#00C853]">
          <div className="p-1 bg-gray-800 rounded-full">
            <Info className="w-5 h-5 text-[#00C853]" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">Coming Soon!</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              We are working hard on the PDF/Excel export feature. It will be available in the next update.
            </p>
          </div>
          <button 
            onClick={() => setShowExportToast(false)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Sidebar />
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Analytics Overview" subtitle={`Report for this ${timeFilter.toLowerCase()}`}>
            <div className="flex items-center gap-4 hidden md:flex">
                <div className="flex items-center gap-2 bg-white px-1 py-1 rounded-xl border border-purple-100 shadow-sm">
                    {['Week', 'Month', 'Year'].map((period) => (
                    <button 
                        key={period} 
                        onClick={() => handleFilterChange(period)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          timeFilter === period 
                            ? 'bg-purple-50 text-[#6739B7] font-bold shadow-sm' 
                            : 'text-gray-500 hover:text-[#6739B7] hover:bg-gray-50'
                        }`}
                    >
                        {period}
                    </button>
                    ))}
                </div>
                
                {/* Export Button with Toast Handler */}
                <button 
                    onClick={handleExportClick}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#6739B7] to-[#9575CD] hover:shadow-lg hover:shadow-purple-500/30 text-white rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </div>
        </TopHeader>
        
        <main className="flex-1 p-8 space-y-8">
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OverviewCard 
                title="Net Balance" 
                value={formatCurrency(summary?.net_balance)} 
                subtitle="Calculated from period" 
                icon={Activity} 
                trend={summary?.net_balance >= 0 ? "up" : "down"} 
                colorTheme="purple"
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Total Income" 
                value={formatCurrency(summary?.total_received)} 
                subtitle={`${summary?.transaction_count || 0} transactions`} 
                icon={ArrowUpRight} 
                trend="up"
                colorTheme="green"
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Total Expenses" 
                value={formatCurrency(summary?.total_spent)} 
                subtitle="Spending this period" 
                icon={ShoppingBag} 
                trend="down"
                colorTheme="red"
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Transaction Vol" 
                value={summary?.transaction_count || 0} 
                subtitle="Total Operations" 
                icon={BarChart3} 
                trend="neutral"
                colorTheme="orange"
                loading={summaryLoading}
            />
          </div>

          {/* 2. Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Income vs Expense Trend (Area Chart) */}
            <Card className="p-6 col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Income vs Expenses Trend</h3>
                        <p className="text-sm text-gray-500">6 Month Timeline</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    {trendsLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#6739B7]" /></div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={THEME.success} stopOpacity={0.2}/><stop offset="95%" stopColor={THEME.success} stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={THEME.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={THEME.danger} stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="income" name="Income" stroke={THEME.success} strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="expense" name="Expense" stroke={THEME.danger} strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            {/* Pie Chart */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Top Categories</h3>
                <p className="text-sm text-gray-500 mb-4">{timeFilter} Breakdown</p>
                <div className="h-[250px] w-full relative">
                    {catLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#6739B7]" /></div>
                    ) : pieData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={5}>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </RePieChart>
                        </ResponsiveContainer>
                    )}
                    {!catLoading && pieData.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.total_spent)}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {pieData.slice(0, 4).map((entry, index) => (
                        <div key={index} className="flex justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                <span className="text-gray-600 font-medium">{entry.name}</span>
                            </div>
                            <span className="font-bold text-gray-900">{formatCurrency(entry.value)}</span>
                        </div>
                    ))}
                </div>
            </Card>
          </div>

          {/* 3. Daily Detailed Analysis (Interactive Day-by-Day Bar Chart) */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Daily Activity Breakdown</h3>
                    <p className="text-sm text-gray-500">Day-wise income and expenses</p>
                </div>
                
                {/* Selectors */}
                <div className="flex gap-3">
                    {/* Month Selector */}
                    <div className="relative">
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="appearance-none bg-purple-50 border border-purple-100 text-[#6739B7] font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6739B7] cursor-pointer"
                        >
                            {MONTHS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6739B7] pointer-events-none" />
                    </div>

                    {/* Year Selector */}
                    <div className="relative">
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="appearance-none bg-white border border-purple-100 text-gray-700 font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6739B7] cursor-pointer"
                        >
                            {YEARS.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
              </div>
              
              <div className="h-[320px] w-full relative">
                {dailyLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#6739B7]" /></div>
                ) : !dailyHasData ? (
                    // --- NO DATA STATE ---
                    <div className="h-full flex flex-col items-center justify-center text-center bg-[#F5F5FA] rounded-xl border border-dashed border-purple-100">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <FileX className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-bold">No Data Found</h4>
                        <p className="text-sm text-gray-500 mt-1">
                            No transactions found for {MONTHS.find(m => m.value === selectedMonth).label} {selectedYear}.
                        </p>
                        <p className="text-xs text-[#6739B7] mt-2 font-medium">Try uploading a PDF for this period.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="day" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 12}} 
                                dy={10} 
                                interval={2} 
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip cursor={{fill: 'rgba(103, 57, 183, 0.05)'}} content={<DailyTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                            <Bar name="Income" dataKey="income" fill={THEME.success} radius={[4, 4, 0, 0]} barSize={8} />
                            <Bar name="Expense" dataKey="expense" fill={THEME.danger} radius={[4, 4, 0, 0]} barSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;