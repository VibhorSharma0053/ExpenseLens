import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { useTransactions, useDeleteTransaction } from '../hooks/useData';
import { 
  Search, RefreshCw, Download, ArrowUpRight, ArrowDownRight, 
  DollarSign, BarChart3, TrendingUp, X,
  Coffee, ShoppingBag, Car, Home, Smartphone, CreditCard, Edit2, Trash2, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

const SummaryCard = ({ title, amount, count, trend, icon: Icon, bgColor }) => (
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

const TransactionRow = ({ transaction, onSelect, isSelected, onDelete, onEdit }) => {
  const icons = { 'Food & Dining': Coffee, 'Shopping': ShoppingBag, 'Transport': Car, 'Bills': Home, 'Entertainment': Smartphone, 'Salary': DollarSign, 'Refund': ArrowUpRight };
  const Icon = icons[transaction.category] || CreditCard;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group hover:bg-gray-50 ${isSelected ? 'bg-[#C2F0E7]/30 border-2 border-[#00C4B4]' : 'border-2 border-transparent'}`}>
      <div className="flex items-center space-x-4 flex-1">
        <input type="checkbox" checked={isSelected} onChange={() => onSelect(transaction.id)} className="w-5 h-5 text-[#00C4B4] rounded focus:ring-[#00C4B4] cursor-pointer" />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.type === 'CREDIT' ? 'bg-gradient-to-br from-[#00C4B4] to-[#5EE0D9]' : 'bg-[#FFF0F5]'}`}>
          <Icon className={`w-6 h-6 ${transaction.type === 'CREDIT' ? 'text-white' : 'text-rose-400'}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
          <p className="text-xs text-gray-500">{new Date(transaction.transaction_date).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === 'CREDIT' ? 'bg-[#00C4B4]/10 text-[#00C4B4]' : 'bg-rose-500/10 text-rose-500'}`}>{transaction.category}</span>
          <p className="text-xs text-gray-500 mt-1">{transaction.type}</p>
        </div>
        <div className="text-right min-w-[100px]">
          <p className={`text-lg font-bold ${transaction.type === 'CREDIT' ? 'text-[#00C4B4]' : 'text-gray-900'}`}>₹{transaction.amount.toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(transaction)} className="p-2 hover:bg-[#C2F0E7] rounded-lg transition-all"><Edit2 className="w-4 h-4 text-[#00C4B4]" /></button>
          <button onClick={() => onDelete(transaction.id)} className="p-2 hover:bg-rose-100 rounded-lg transition-all"><Trash2 className="w-4 h-4 text-rose-400" /></button>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#C2F0E7]">
      <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center space-x-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg text-gray-700 hover:bg-[#C2F0E7] disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
        <span className="px-4 py-2 bg-gradient-to-r from-[#00C4B4] to-[#5EE0D9] text-white rounded-lg font-medium">{currentPage}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg text-gray-700 hover:bg-[#C2F0E7] disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
      </div>
    </div>
);

const History = () => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { transactions, loading, error, pagination, refetch } = useTransactions({ page: currentPage, page_size: 20, search: searchQuery });
  const { deleteTransaction } = useDeleteTransaction();

  const handleSelectTransaction = (id) => setSelectedTransactions(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const handleSelectAll = () => setSelectedTransactions(selectedTransactions.length === transactions.length ? [] : transactions.map(t => t.id));
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(id);
      if (result.success) refetch();
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300">
      <Sidebar />
      <div className="ml-72 transition-all duration-300">
        <TopHeader title="Transaction History" subtitle="View and manage all your transactions">
          <div className="flex items-center space-x-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-[#C2F0E7] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4]" 
                />
             </div>
             <button onClick={() => refetch()} className="p-2 hover:bg-[#C2F0E7] rounded-full"><RefreshCw className="w-6 h-6 text-gray-600" /></button>
             <button onClick={() => alert('Exporting...')} className="px-6 py-2 bg-[#00C4B4] text-white rounded-full font-medium flex items-center space-x-2 shadow-lg"><Download className="w-4 h-4" /><span>Export</span></button>
          </div>
        </TopHeader>
        
        <div className="p-8">
          {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>
          ) : error ? (
             <div className="text-center py-20 text-red-500">Error: {error}</div>
          ) : (
             <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <SummaryCard title="Total Income" amount={`₹${totalIncome.toLocaleString()}`} count={transactions.filter(t => t.type === 'CREDIT').length} trend={{ isPositive: true, value: '+18%' }} icon={ArrowUpRight} bgColor="bg-gradient-to-br from-white to-gray-50" />
                    <SummaryCard title="Total Expenses" amount={`₹${totalExpense.toLocaleString()}`} count={transactions.filter(t => t.type === 'DEBIT').length} trend={{ isPositive: false, value: '-12%' }} icon={ArrowDownRight} bgColor="bg-gradient-to-br from-[#FFF0F5] to-white" />
                    <SummaryCard title="Net Balance" amount={`₹${(totalIncome - totalExpense).toLocaleString()}`} count={transactions.length} trend={{ isPositive: true, value: '+25%' }} icon={DollarSign} bgColor="bg-gradient-to-br from-[#C2F0E7] to-white" />
                    <SummaryCard title="Avg Transaction" amount={`₹${Math.round((totalIncome + totalExpense) / transactions.length || 0).toLocaleString()}`} count={transactions.length} trend={null} icon={BarChart3} bgColor="bg-gradient-to-br from-white to-gray-50" />
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-[#C2F0E7] shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-bold text-gray-900">All Transactions</h3>
                            {selectedTransactions.length > 0 && <span className="px-3 py-1 bg-[#C2F0E7] text-[#00C4B4] text-sm font-semibold rounded-full">{selectedTransactions.length} selected</span>}
                        </div>
                        <div className="flex items-center space-x-3">
                            {selectedTransactions.length > 0 && <button onClick={() => setSelectedTransactions([])} className="px-4 py-2 bg-[#FFF0F5] text-rose-400 rounded-xl text-sm font-semibold flex items-center space-x-2"><X className="w-4 h-4" /><span>Clear</span></button>}
                            <button onClick={handleSelectAll} className="px-4 py-2 bg-[#C2F0E7] text-[#00C4B4] rounded-xl text-sm font-semibold">{selectedTransactions.length === transactions.length ? 'Deselect All' : 'Select All'}</button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {transactions.map((transaction) => (
                            <TransactionRow key={transaction.id} transaction={transaction} onSelect={handleSelectTransaction} isSelected={selectedTransactions.includes(transaction.id)} onDelete={handleDelete} onEdit={() => {}} />
                        ))}
                    </div>
                    
                    {transactions.length === 0 && <div className="text-center py-12"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No transactions found</p></div>}
                    
                    {Math.ceil(pagination.total / pagination.page_size) > 1 && (
                        <Pagination currentPage={currentPage} totalPages={Math.ceil(pagination.total / pagination.page_size)} onPageChange={setCurrentPage} />
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