import React, { useState } from "react";
import { useAnalyticsSummary, useMonthlyTrend } from "../hooks/useData";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  DollarSign, BarChart3, PieChart, Upload, Download, Filter, RefreshCw,
  Coffee, ShoppingBag, ChevronDown
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from "react-router-dom";

// Stats Card Component
const StatsCard = ({ title, amount, change, isPositive, icon: Icon, iconBg, isDarkMode }) => {
  return (
    <div className={`rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
        isDarkMode ? "bg-slate-800 border-slate-700 hover:border-[#00C4B4]" : "bg-white border-[#C2F0E7] hover:border-[#00C4B4]"
      } hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className={iconBg.includes('gradient') ? 'text-white' : 'text-rose-400'} size={28} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              isPositive ? "bg-[#00C4B4]/10 text-[#00C4B4]" : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-semibold">{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          {title}
        </p>
        <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {amount}
        </p>
      </div>
    </div>
  );
};

// Spending Chart Component
const SpendingChart = ({ isDarkMode, trendsData }) => {
  return (
    <div className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-[#C2F0E7]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Monthly Spending
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Last 6 months
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trendsData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e5e7eb"} />
          <XAxis dataKey="month" stroke={isDarkMode ? "#94a3b8" : "#6b7280"} />
          <YAxis stroke={isDarkMode ? "#94a3b8" : "#6b7280"} />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              border: `1px solid ${isDarkMode ? "#334155" : "#e5e7eb"}`,
              borderRadius: "0.5rem"
            }}
          />
          <Bar dataKey="total_spent" fill="#00C4B4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Category Distribution Component
const CategoryDistribution = ({ isDarkMode, categories }) => {
  const COLORS = ['#00C4B4', '#5EE0D9', '#99F6E4', '#CCFBF1', '#0F766E'];

  return (
    <div className={`rounded-2xl p-6 border-2 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-[#C2F0E7]"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Category Distribution
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {categories.slice(0, 5).map((cat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                {cat.category}
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                ₹{cat.total_amount.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Use state to manage theme locally for now (could be moved to context later)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { summary, loading: summaryLoading } = useAnalyticsSummary();
  const { trends, loading: trendsLoading } = useMonthlyTrend(6);

  // Format trends data for chart
  const trendsData = trends?.map(t => ({
    month: t.month,
    total_spent: t.total_spent,
    total_received: t.total_received
  })) || [];

  if (summaryLoading || trendsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}>
      <Sidebar />
      
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Dashboard" subtitle="Welcome back! Here's your financial overview" />

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Income"
              amount={`₹${summary?.total_received?.toLocaleString() || '0'}`}
              change="+18%"
              isPositive={true}
              icon={ArrowUpRight}
              iconBg="bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Total Expenses"
              amount={`₹${summary?.total_spent?.toLocaleString() || '0'}`}
              change="-12%"
              isPositive={false}
              icon={ArrowDownRight}
              iconBg="bg-[#FFF0F5]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Net Savings"
              amount={`₹${summary?.net_balance?.toLocaleString() || '0'}`}
              change="+25%"
              isPositive={true}
              icon={DollarSign}
              iconBg="bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]"
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Transactions"
              amount={summary?.transaction_count || '0'}
              change="+8%"
              isPositive={true}
              icon={BarChart3}
              iconBg="bg-gradient-to-br from-[#5EE0D9] to-[#00C4B4]"
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SpendingChart isDarkMode={isDarkMode} trendsData={trendsData} />
            </div>
            <div>
              <CategoryDistribution isDarkMode={isDarkMode} categories={summary?.categories || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;