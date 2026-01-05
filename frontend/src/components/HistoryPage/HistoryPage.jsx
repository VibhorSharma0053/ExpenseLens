import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  Bell,
  Settings,
  LogOut,
  User,
  BarChart3,
  PieChart,
  Upload,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Smartphone,
  Zap,
  DollarSign,
  CreditCard,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  TrendingUp,
  FileText,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

// --- NEW Sidebar Component ---
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

// Top Header Component
const TopHeader = ({ onSearch, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="bg-white border-b border-[#C2F0E7] px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all your transactions</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-[#C2F0E7] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-transparent transition-all"
            />
          </div>

          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-[#C2F0E7] rounded-full transition-all duration-300"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>

          <button className="p-2 hover:bg-[#C2F0E7] rounded-full transition-all duration-300 relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00C4B4] rounded-full"></span>
          </button>

          <button className="px-6 py-2 bg-[#00C4B4] hover:bg-[#5EE0D9] text-white rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all duration-300 transform hover:scale-105">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Summary Cards Component
const SummaryCard = ({ title, amount, count, trend, icon: Icon, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border-2 border-[#C2F0E7] hover:border-[#00C4B4] hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <Icon className="w-6 h-6 text-[#00C4B4]" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${trend.isPositive ? 'text-[#00C4B4]' : 'text-rose-400'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{amount}</p>
        <p className="text-xs text-gray-500">{count} transactions</p>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, setFilters, onClose }) => {
  const categories = ['All', 'Food & Dining', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Others'];
  const types = ['All', 'Credit', 'Debit'];
  const dateRanges = ['All Time', 'Today', 'This Week', 'This Month', 'Last Month', 'Last 3 Months', 'Custom'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9] rounded-xl flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Filters</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#C2F0E7] rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilters({ ...filters, category })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filters.category === category
                      ? 'bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#C2F0E7]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Transaction Type</label>
            <div className="flex gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, type })}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filters.type === type
                      ? 'bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#C2F0E7]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Date Range</label>
            <div className="grid grid-cols-3 gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setFilters({ ...filters, dateRange: range })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filters.dateRange === range
                      ? 'bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#C2F0E7]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Amount Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Amount</label>
                <input
                  type="number"
                  placeholder="₹0"
                  className="w-full px-4 py-2 bg-gray-50 border border-[#C2F0E7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-transparent"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Amount</label>
                <input
                  type="number"
                  placeholder="₹10,000"
                  className="w-full px-4 py-2 bg-gray-50 border border-[#C2F0E7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-transparent"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={() => setFilters({ category: 'All', type: 'All', dateRange: 'All Time', minAmount: '', maxAmount: '' })}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ transaction, onSelect, isSelected }) => {
  const categoryIcons = {
    'Food & Dining': Coffee,
    'Shopping': ShoppingBag,
    'Transport': Car,
    'Bills': Home,
    'Entertainment': Smartphone,
    'Salary': DollarSign,
    'Refund': ArrowUpRight,
    'Others': MoreHorizontal
  };

  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
  const isIncome = transaction.type === 'Credit';

  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
        isSelected ? 'bg-[#C2F0E7] shadow-md' : 'hover:bg-[#C2F0E7]'
      }`}
      onClick={() => onSelect(transaction.id)}
    >
      <div className="flex items-center space-x-4 flex-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-5 h-5 text-[#00C4B4] bg-white border-[#C2F0E7] rounded focus:ring-[#00C4B4] cursor-pointer"
        />

        <div className={`w-12 h-12 ${isIncome ? 'bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]' : 'bg-[#FFF0F5]'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${isIncome ? 'text-white' : 'text-rose-400'}`} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#00C4B4] transition-colors">
            {transaction.description}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs text-gray-500">{transaction.date}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{transaction.category}</span>
            {transaction.utr && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">UTR: {transaction.utr}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className={`text-lg font-bold ${isIncome ? 'text-[#00C4B4]' : 'text-gray-900'}`}>
            {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isIncome ? 'bg-[#C2F0E7] text-[#00C4B4]' : 'bg-[#FFF0F5] text-rose-400'
          }`}>
            {transaction.type}
          </span>
        </div>

        <button className="p-2 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Showing page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-[#C2F0E7] hover:text-[#00C4B4]'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {[...Array(Math.min(5, totalPages))].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === pageNum
                  ? 'bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-[#C2F0E7]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-[#C2F0E7] hover:text-[#00C4B4]'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main History Component
const HistoryPage = () => {
  const [activePage, setActivePage] = useState('history');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    type: 'All',
    dateRange: 'All Time',
    minAmount: '',
    maxAmount: ''
  });

  const [transactions] = useState([
    { id: 1, description: 'Salary Credit', category: 'Salary', amount: 85000, type: 'Credit', date: 'Jan 01, 2026, 9:00 AM', utr: '525973216821' },
    { id: 2, description: 'Zomato Food Order', category: 'Food & Dining', amount: 485, type: 'Debit', date: 'Jan 03, 2026, 2:30 PM', utr: '525973216822' },
    { id: 3, description: 'Amazon Shopping', category: 'Shopping', amount: 2340, type: 'Debit', date: 'Jan 02, 2026, 6:45 PM', utr: '525973216823' },
    { id: 4, description: 'Uber Ride', category: 'Transport', amount: 156, type: 'Debit', date: 'Jan 02, 2026, 3:20 PM', utr: '525973216824' },
    { id: 5, description: 'Electricity Bill', category: 'Bills', amount: 1240, type: 'Debit', date: 'Jan 01, 2026, 11:00 AM', utr: '525973216825' },
    { id: 6, description: 'Freelance Payment', category: 'Salary', amount: 12000, type: 'Credit', date: 'Dec 30, 2025, 4:15 PM', utr: '525973216826' },
    { id: 7, description: 'Swiggy Food Delivery', category: 'Food & Dining', amount: 320, type: 'Debit', date: 'Dec 29, 2025, 8:30 PM', utr: '525973216827' },
    { id: 8, description: 'Netflix Subscription', category: 'Entertainment', amount: 649, type: 'Debit', date: 'Dec 28, 2025, 12:00 PM', utr: '525973216828' },
    { id: 9, description: 'Flipkart Shopping', category: 'Shopping', amount: 1850, type: 'Debit', date: 'Dec 27, 2025, 3:45 PM', utr: '525973216829' },
    { id: 10, description: 'Refund from Meesho', category: 'Refund', amount: 234, type: 'Credit', date: 'Dec 26, 2025, 10:20 AM', utr: '525973216830' },
  ]);

  const handleSelectTransaction = (id) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Updated margin-left to ml-72 to fit the new wider sidebar */}
      <div className="ml-72">
        <TopHeader onSearch={setSearchQuery} onRefresh={() => console.log('Refresh')} />
        
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Income"
              amount={`₹${totalIncome.toLocaleString()}`}
              count={transactions.filter(t => t.type === 'Credit').length}
              trend={{ isPositive: true, value: '+18%' }}
              icon={ArrowUpRight}
              bgColor="bg-gradient-to-br from-white to-gray-50"
            />
            <SummaryCard
              title="Total Expenses"
              amount={`₹${totalExpense.toLocaleString()}`}
              count={transactions.filter(t => t.type === 'Debit').length}
              trend={{ isPositive: false, value: '-12%' }}
              icon={ArrowDownRight}
              bgColor="bg-gradient-to-br from-[#FFF0F5] to-white"
            />
            <SummaryCard
              title="Net Balance"
              amount={`₹${(totalIncome - totalExpense).toLocaleString()}`}
              count={transactions.length}
              trend={{ isPositive: true, value: '+25%' }}
              icon={DollarSign}
              bgColor="bg-gradient-to-br from-[#C2F0E7] to-white"
            />
            <SummaryCard
              title="Avg Transaction"
              amount={`₹${Math.round((totalIncome + totalExpense) / transactions.length).toLocaleString()}`}
              count={transactions.length}
              trend={null}
              icon={BarChart3}
              bgColor="bg-gradient-to-br from-white to-gray-50"
            />
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#C2F0E7] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-bold text-gray-900">All Transactions</h3>
                {selectedTransactions.length > 0 && (
                  <span className="px-3 py-1 bg-[#C2F0E7] text-[#00C4B4] text-sm font-semibold rounded-full">
                    {selectedTransactions.length} selected
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {selectedTransactions.length > 0 && (
                  <button className="px-4 py-2 bg-[#FFF0F5] text-rose-400 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-all flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Clear Selection</span>
                  </button>
                )}

                <button 
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-[#C2F0E7] text-[#00C4B4] rounded-xl text-sm font-semibold hover:bg-[#00C4B4] hover:text-white transition-all"
                >
                  {selectedTransactions.length === transactions.length ? 'Deselect All' : 'Select All'}
                </button>

                <button 
                  onClick={() => setShowFilterPanel(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#00C4B4]/30 transition-all flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onSelect={handleSelectTransaction}
                  isSelected={selectedTransactions.includes(transaction.id)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {showFilterPanel && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilterPanel(false)}
        />
      )}
    </div>
  );
};

export default HistoryPage;