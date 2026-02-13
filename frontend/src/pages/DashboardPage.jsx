import React, { useMemo } from "react";
import { useAnalyticsSummary, useMonthlyTrend } from "../hooks/useData"; // Assuming these exist
import Sidebar from "../components/Sidebar"; // Assuming this exists
import TopHeader from "../components/TopHeader"; // Assuming this exists
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  DollarSign, BarChart3, Loader
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Theme Constants ---
// Based on the image: Purple, Pink, Orange, Yellow, Green, Blue
const CHART_COLORS = ['#6739B7', '#E91E63', '#FF9800', '#FFC107', '#00C853', '#2979FF'];

const THEME = {
  primary: '#6739B7', // Deep Royal Purple
  secondary: '#9575CD', // Soft Lavender
  success: '#00C853', // Emerald Green
  danger: '#FF5252', // Coral Red
  warning: '#FFC107', // Sunshine Yellow
  info: '#2979FF', // Electric Blue
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
  // Changed border/shadow from Teal to Purple/Slate
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
            <span className="text-gray-500 capitalize">{entry.name === 'total_received' ? 'Income' : 'Expense'}:</span>
            <span className="text-gray-900 font-bold">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatsCard = ({ title, amount, change, isPositive, icon: Icon, colorTheme }) => {
  // Map color themes to specific gradient styles
  const styles = {
    purple: "from-[#6739B7] to-[#9575CD] text-[#6739B7] bg-purple-50",
    green: "from-[#00C853] to-[#69F0AE] text-[#00C853] bg-green-50",
    red: "from-[#FF5252] to-[#FF8A80] text-[#FF5252] bg-red-50",
    blue: "from-[#2979FF] to-[#82B1FF] text-[#2979FF] bg-blue-50",
  };

  const activeStyle = styles[colorTheme] || styles.purple;
  const gradientClass = activeStyle.split(" ")[0] + " " + activeStyle.split(" ")[1];
  const textClass = activeStyle.split(" ")[2];
  const bgClass = activeStyle.split(" ")[3];

  return (
    <Card className="p-6 relative overflow-hidden group">
      {/* Background Decorative Circle */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradientClass} shadow-lg shadow-gray-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">
          {title}
        </p>
        <p className={`text-3xl font-bold ${textClass}`}>
          {amount}
        </p>
      </div>
    </Card>
  );
};

const IncomeExpenseChart = ({ data, loading }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Income vs Expenses</h3>
          <p className="text-sm text-gray-500">6 Month Trend</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        {loading ? (
            <div className="h-full flex items-center justify-center"><Loader className="animate-spin text-[#6739B7]" /></div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                {/* Updated Gradients: Green for Income, Red for Expense */}
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={THEME.success} stopOpacity={0.2}/><stop offset="95%" stopColor={THEME.success} stopOpacity={0}/></linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={THEME.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={THEME.danger} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total_received" name="Income" stroke={THEME.success} strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="total_spent" name="Expense" stroke={THEME.danger} strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const CategoryDistribution = ({ categories }) => {
  // Safe check for data
  const pieData = (categories || []).slice(0, 5).map(c => ({
    name: c.category,
    value: c.total_amount,
    percentage: c.percentage
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Category Distribution
          </h3>
          <p className="text-sm text-gray-500">Spending breakdown</p>
        </div>
      </div>

      <div className="space-y-4">
        {pieData.length > 0 ? pieData.map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                {cat.name}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(cat.value)}
              </span>
            </div>
            <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                }}
              />
            </div>
          </div>
        )) : (
            <div className="text-center py-10 text-gray-400">No category data available</div>
        )}
      </div>
    </Card>
  );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
  const { summary, loading: summaryLoading } = useAnalyticsSummary();
  const { trends, loading: trendsLoading } = useMonthlyTrend(6);

  const trendsData = useMemo(() => {
    return trends?.map(t => ({
      month: t.month,
      total_spent: t.total_spent,
      total_received: t.total_received
    })) || [];
  }, [trends]);

  if (summaryLoading || trendsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F0F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6739B7]"></div>
      </div>
    );
  }

  return (
    // Background updated to a very soft Lavender/Grey to match the cool tone
    <div className="min-h-screen bg-[#F5F5FA] transition-colors duration-300 font-sans">
      <Sidebar />
      
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Dashboard" subtitle="Welcome back! Here's your financial overview" />

        <div className="p-8 space-y-8">
          {/* Stats Cards - Updated with Color Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Income"
              amount={formatCurrency(summary?.total_received)}
              change="+18%"
              isPositive={true}
              icon={ArrowUpRight}
              colorTheme="green" // Emerald Green
            />
            <StatsCard
              title="Total Expenses"
              amount={formatCurrency(summary?.total_spent)}
              change="-12%"
              isPositive={false}
              icon={ArrowDownRight}
              colorTheme="red" // Coral Red
            />
            <StatsCard
              title="Net Savings"
              amount={formatCurrency(summary?.net_balance)}
              change="+25%"
              isPositive={true}
              icon={DollarSign}
              colorTheme="purple" // Brand Purple
            />
            <StatsCard
              title="Transactions"
              amount={summary?.transaction_count || '0'}
              change="+8%"
              isPositive={true}
              icon={BarChart3}
              colorTheme="blue" // Electric Blue
            />
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseChart data={trendsData} loading={trendsLoading} />
            </div>
            <div>
              <CategoryDistribution categories={summary?.categories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;