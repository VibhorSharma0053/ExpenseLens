import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { useTransactions, useDeleteTransaction } from '../hooks/useData';
import { 
  Search, RefreshCw, Download, ArrowUpRight, ArrowDownRight, 
  DollarSign, BarChart3, TrendingUp, X,
  Coffee, ShoppingBag, Car, Home, Smartphone, CreditCard, Edit2, Trash2, FileText, ChevronLeft, ChevronRight, Info
} from 'lucide-react';

// --- Theme Constants ---
const THEME = {
  primary: '#6739B7', // Deep Royal Purple
  secondary: '#9575CD', // Soft Lavender
  success: '#00C853', // Emerald Green
  danger: '#FF5252', // Coral Red
  background: '#F5F5FA', // Light Purple Grey
  gradient_primary: 'from-[#6739B7] to-[#9575CD]',
  gradient_success: 'from-[#00C853] to-[#69F0AE]',
  gradient_danger: 'from-[#FF5252] to-[#FF8A80]',
};

// --- Sub-Components ---

const SummaryCard = ({ title, amount, count, trend, icon: Icon, colorTheme }) => {
  const styles = {
    purple: { bg: "bg-white", iconBg: "bg-purple-50", iconColor: "text-[#6739B7]", border: "border-purple-100" },
    green: { bg: "bg-white", iconBg: "bg-green-50", iconColor: "text-[#00C853]", border: "border-green-100" },
    red: { bg: "bg-white", iconBg: "bg-red-50", iconColor: "text-[#FF5252]", border: "border-red-100" },
    blue: { bg: "bg-white", iconBg: "bg-blue-50", iconColor: "text-[#2979FF]", border: "border-blue-100" },
  };

  const currentStyle = styles[colorTheme] || styles.purple;

  return (
    <div className={`${currentStyle.bg} rounded-2xl p-6 border ${currentStyle.border} hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${currentStyle.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
          <Icon className={`w-6 h-6 ${currentStyle.iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-bold ${trend.isPositive ? 'text-[#00C853]' : 'text-[#FF5252]'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{amount}</p>
        <p className="text-xs text-gray-400 font-medium">{count} transactions</p>
      </div>
    </div>
  );
};

const TransactionRow = ({ transaction, onSelect, isSelected, onDelete, onEdit }) => {
  const icons = { 'Food & Dining': Coffee, 'Shopping': ShoppingBag, 'Transport': Car, 'Bills': Home, 'Entertainment': Smartphone, 'Salary': DollarSign, 'Refund': ArrowUpRight };
  const Icon = icons[transaction.category] || CreditCard;

  const isCredit = transaction.type === 'CREDIT';

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover:bg-white hover:shadow-md ${isSelected ? 'bg-purple-50 border border-[#6739B7]' : 'bg-white border border-transparent hover:border-purple-100'}`}>
      <div className="flex items-center space-x-4 flex-1">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={() => onSelect(transaction.id)} 
          className="w-5 h-5 text-[#6739B7] rounded focus:ring-[#6739B7] cursor-pointer border-gray-300" 
        />
        
        {/* Icon with Color Coding */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
          isCredit 
            ? `bg-gradient-to-br ${THEME.gradient_success}` 
            : `bg-gradient-to-br from-gray-100 to-gray-200`
        }`}>
          <Icon className={`w-6 h-6 ${isCredit ? 'text-white' : 'text-gray-500'}`} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(transaction.transaction_date).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
            isCredit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {transaction.category}
          </span>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">{transaction.type}</p>
        </div>

        <div className="text-right min-w-[100px]">
          <p className={`text-lg font-bold ${isCredit ? 'text-[#00C853]' : 'text-gray-900'}`}>
            {isCredit ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(transaction)} className="p-2 hover:bg-purple-50 rounded-lg transition-all text-gray-400 hover:text-[#6739B7]">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(transaction.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all text-gray-400 hover:text-[#FF5252]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
      <p className="text-sm font-medium text-gray-500">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="p-2 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-[#6739B7] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className={`px-4 py-2 bg-gradient-to-r ${THEME.gradient_primary} text-white rounded-lg font-bold shadow-md shadow-purple-200`}>
          {currentPage}
        </span>
        
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="p-2 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-[#6739B7] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
);

// --- Main History Page ---

const History = () => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // State for Toast Notification
  const [showExportToast, setShowExportToast] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  
  const { transactions, loading, error, pagination, refetch } = useTransactions({ 
    page: currentPage, 
    page_size: 20, 
    search: debouncedSearch 
  });

  const { deleteTransaction } = useDeleteTransaction();

  const handleSelectTransaction = (id) => setSelectedTransactions(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const handleSelectAll = () => setSelectedTransactions(selectedTransactions.length === transactions.length ? [] : transactions.map(t => t.id));
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(id);
      if (result.success) refetch();
    }
  };

  // Toast Handler
  const handleExportClick = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const totalIncome = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#F5F5FA] font-sans transition-all duration-300 relative">
      
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
        <TopHeader title="Transaction History" subtitle="View and manage all your transactions">
          <div className="flex items-center space-x-4">
             {/* Search Bar */}
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6739B7] transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..." 
                  className="pl-10 pr-4 py-2.5 w-64 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6739B7]/20 focus:border-[#6739B7] transition-all focus:w-80 shadow-sm" 
                />
             </div>
             
             {/* Action Buttons */}
             <button 
                onClick={() => refetch()} 
                className="p-2.5 bg-white border border-gray-200 hover:border-[#6739B7] hover:text-[#6739B7] rounded-xl transition-all shadow-sm"
             >
                <RefreshCw className="w-5 h-5" />
             </button>
             
             <button 
                onClick={handleExportClick} 
                className={`px-6 py-2.5 bg-gradient-to-r ${THEME.gradient_primary} text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all active:scale-95`}
             >
                <Download className="w-4 h-4" />
                <span>Export</span>
             </button>
          </div>
        </TopHeader>
        
        <div className="p-8">
          {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6739B7]"></div></div>
          ) : error ? (
             <div className="text-center py-20 text-[#FF5252]">Error: {error}</div>
          ) : (
             <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <SummaryCard 
                        title="Total Income" 
                        amount={`₹${totalIncome.toLocaleString()}`} 
                        count={transactions.filter(t => t.type === 'CREDIT').length} 
                        trend={{ isPositive: true, value: '+18%' }} 
                        icon={ArrowUpRight} 
                        colorTheme="green"
                    />
                    <SummaryCard 
                        title="Total Expenses" 
                        amount={`₹${totalExpense.toLocaleString()}`} 
                        count={transactions.filter(t => t.type === 'DEBIT').length} 
                        trend={{ isPositive: false, value: '-12%' }} 
                        icon={ArrowDownRight} 
                        colorTheme="red"
                    />
                    <SummaryCard 
                        title="Net Balance" 
                        amount={`₹${(totalIncome - totalExpense).toLocaleString()}`} 
                        count={transactions.length} 
                        trend={{ isPositive: true, value: '+25%' }} 
                        icon={DollarSign} 
                        colorTheme="purple"
                    />
                    <SummaryCard 
                        title="Avg Transaction" 
                        amount={`₹${Math.round((totalIncome + totalExpense) / (transactions.length || 1)).toLocaleString()}`} 
                        count={transactions.length} 
                        trend={null} 
                        icon={BarChart3} 
                        colorTheme="blue"
                    />
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-bold text-gray-900">All Transactions</h3>
                            {selectedTransactions.length > 0 && (
                                <span className="px-3 py-1 bg-purple-100 text-[#6739B7] text-sm font-bold rounded-full">
                                    {selectedTransactions.length} selected
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            {selectedTransactions.length > 0 && (
                                <button 
                                    onClick={() => setSelectedTransactions([])} 
                                    className="px-4 py-2 bg-red-50 text-[#FF5252] hover:bg-red-100 rounded-xl text-sm font-bold flex items-center space-x-2 transition-colors"
                                >
                                    <X className="w-4 h-4" /><span>Clear</span>
                                </button>
                            )}
                            <button 
                                onClick={handleSelectAll} 
                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-[#6739B7] hover:text-white transition-all"
                            >
                                {selectedTransactions.length === transactions.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <TransactionRow 
                                key={transaction.id} 
                                transaction={transaction} 
                                onSelect={handleSelectTransaction} 
                                isSelected={selectedTransactions.includes(transaction.id)} 
                                onDelete={handleDelete} 
                                onEdit={() => {}} 
                            />
                        ))}
                    </div>
                    
                    {transactions.length === 0 && (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <FileText className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-900 font-bold text-lg">No transactions found</p>
                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search query</p>
                        </div>
                    )}
                    
                    {Math.ceil(pagination.total / pagination.page_size) > 1 && (
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={Math.ceil(pagination.total / pagination.page_size)} 
                            onPageChange={setCurrentPage} 
                        />
                    )}
                </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;