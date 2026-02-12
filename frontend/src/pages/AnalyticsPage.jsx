import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { 
  useAnalyticsSummary, 
  useMonthlyTrend, 
  useCategoryBreakdown 
} from '../hooks/useData';
import { 
  TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, 
  Activity, Target, ShoppingBag, Download, BarChart3, 
  Coffee, Car, Home, Smartphone, CreditCard, Loader
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

// --- Constants ---
const CHART_COLORS = ['#00C4B4', '#5EE0D9', '#99F6E4', '#CCFBF1', '#0F766E'];

// --- Helper Functions ---
const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  
  if (period === 'Week') {
    start.setDate(end.getDate() - 7);
  } else if (period === 'Month') {
    start.setDate(1); // 1st of current month
  } else if (period === 'Year') {
    start.setMonth(0, 1); // Jan 1st of current year
  }
  return { 
    start_date: start.toISOString(), 
    end_date: end.toISOString() 
  };
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// --- Sub-Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-teal-100 shadow-sm hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-teal-100 rounded-xl shadow-xl z-50">
        <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
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

const OverviewCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, colorClass, loading }) => {
  const isUp = trend === 'up';
  
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
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colorClass} text-white shadow-lg shadow-teal-500/20`}>
              <Icon className="w-6 h-6" />
            </div>
            {trendValue && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isUp ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-500'}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trendValue}
                </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
        </>
      )}
    </Card>
  );
};

// --- Main Analytics Page ---
const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState('Month'); // Week, Month, Year
  const [dateRange, setDateRange] = useState(getDateRange('Month'));

  // 1. Fetch Summary Data (Cards)
  const { summary, loading: summaryLoading, refetch: refetchSummary } = useAnalyticsSummary(dateRange);
  
  // 2. Fetch Trends Data (Chart)
  const { trends, loading: trendsLoading } = useMonthlyTrend(6); // Always show last 6 months trend

  // 3. Fetch Category Breakdown (Pie Chart)
  const { categories, loading: catLoading, refetch: refetchCats } = useCategoryBreakdown(dateRange);

  // Handle Filter Change
  const handleFilterChange = (period) => {
    setTimeFilter(period);
    const newRange = getDateRange(period);
    setDateRange(newRange);
    // Trigger refetches with new dates
    // Note: Hooks update automatically when dependency (dateRange) changes, 
    // but explicit refetch ensures freshness if needed.
  };

  // Process Trends Data for Recharts
  const chartData = useMemo(() => {
    if (!trends) return [];
    return trends.map(t => ({
      name: t.month,
      income: t.total_received,
      expense: t.total_spent
    }));
  }, [trends]);

  // Process Category Data for Pie Chart
  const pieData = useMemo(() => {
    if (!categories) return [];
    return categories.map(c => ({
      name: c._id || 'Uncategorized',
      value: c.total
    }));
  }, [categories]);

  // Calculate generic trends for cards (simple logic vs previous period)
  const getTrend = (current, previous) => {
     // Simplified: In a real app, you'd fetch previous month data to compare
     return { direction: 'up', value: '0%' }; 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] transition-all duration-300">
      <Sidebar />
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Analytics Overview" subtitle={`Report for this ${timeFilter.toLowerCase()}`}>
            <div className="flex items-center gap-4 hidden md:flex">
                <div className="flex items-center gap-2 bg-gray-50 px-1 py-1 rounded-xl border border-gray-100">
                    {['Week', 'Month', 'Year'].map((period) => (
                    <button 
                        key={period} 
                        onClick={() => handleFilterChange(period)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${timeFilter === period ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {period}
                    </button>
                    ))}
                </div>
                <button className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-gray-200">
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
                colorClass="from-teal-400 to-teal-600" 
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Total Income" 
                value={formatCurrency(summary?.total_received)} 
                subtitle={`${summary?.transaction_count || 0} transactions`} 
                icon={ArrowUpRight} 
                trend="up"
                colorClass="from-indigo-400 to-indigo-600" 
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Total Expenses" 
                value={formatCurrency(summary?.total_spent)} 
                subtitle="Spending this period" 
                icon={ShoppingBag} 
                trend="down"
                colorClass="from-rose-400 to-rose-600" 
                loading={summaryLoading}
            />
            <OverviewCard 
                title="Transaction Vol" 
                value={summary?.transaction_count || 0} 
                subtitle="Total Operations" 
                icon={BarChart3} 
                trend="neutral"
                colorClass="from-amber-400 to-amber-600" 
                loading={summaryLoading}
            />
          </div>

          {/* 2. Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Income vs Expense Chart */}
            <Card className="p-6 col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Income vs Expenses</h3>
                        <p className="text-sm text-gray-500">6 Month Trend</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    {trendsLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-teal-500" /></div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00C4B4" stopOpacity={0.2}/><stop offset="95%" stopColor="#00C4B4" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FB7185" stopOpacity={0.2}/><stop offset="95%" stopColor="#FB7185" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="income" stroke="#00C4B4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="expense" stroke="#FB7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            {/* Spending Pie Chart */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Top Categories</h3>
                <p className="text-sm text-gray-500 mb-4">{timeFilter} Breakdown</p>
                <div className="h-[250px] w-full relative">
                    {catLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-teal-500" /></div>
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
                    {/* Center Total */}
                    {!catLoading && pieData.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.total_spent)}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
                        </div>
                    )}
                </div>
                {/* Legend */}
                <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                    {pieData.slice(0, 4).map((entry, index) => (
                        <div key={index} className="flex justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                                <span>{entry.name}</span>
                            </div>
                            <span className="font-semibold">{formatCurrency(entry.value)}</span>
                        </div>
                    ))}
                </div>
            </Card>
          </div>

          {/* 3. Detailed Category Breakdown (Bar Chart) */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <div className="mb-6"><h3 className="text-lg font-bold text-gray-900">Category Deep Dive</h3></div>
              <div className="h-[320px] w-full">
                {catLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-teal-500" /></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#4B5563' }} width={100} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#00C4B4" radius={[0, 4, 4, 0]} barSize={20}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                        </Bar>
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