import React, { useState } from 'react';
import { Calendar, Filter, Download, ArrowUpDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getTimeRanges } from '../data/mockData';
import { DateRange, ReportFilter } from '../types';
import IncomeExpenseChart from '../components/reports/IncomeExpenseChart';
import CategoryDistributionChart from '../components/reports/CategoryDistributionChart';
import AccountBalanceChart from '../components/reports/AccountBalanceChart';

const Reports: React.FC = () => {
  const { transactions, accounts, categories } = useFinance();
  const timeRanges = getTimeRanges();
  
  const [activeTimeRange, setActiveTimeRange] = useState<string>('thisMonth');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    start: timeRanges.thisMonth.start,
    end: timeRanges.thisMonth.end
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const initialFilter: ReportFilter = {
    accounts: [],
    categories: [],
    dateRange: customDateRange,
    transactionTypes: ['income', 'expense', 'transfer']
  };
  
  const [reportFilter, setReportFilter] = useState<ReportFilter>(initialFilter);
  
  // Handle time range change
  const handleTimeRangeChange = (rangeKey: string) => {
    setActiveTimeRange(rangeKey);
    
    if (rangeKey !== 'custom') {
      setCustomDateRange({
        start: timeRanges[rangeKey].start,
        end: timeRanges[rangeKey].end
      });
      
      setReportFilter(prev => ({
        ...prev,
        dateRange: {
          start: timeRanges[rangeKey].start,
          end: timeRanges[rangeKey].end
        }
      }));
    }
  };
  
  // Handle custom date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDateRange(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
    
    setReportFilter(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: new Date(value)
      }
    }));
  };
  
  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    const dateRange = activeTimeRange === 'custom' ? customDateRange : timeRanges[activeTimeRange];
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const isInDateRange = transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      
      // Apply additional filters if they exist
      const isAccountIncluded = reportFilter.accounts.length === 0 || 
        reportFilter.accounts.includes(t.accountId);
      
      const isCategoryIncluded = reportFilter.categories.length === 0 || 
        reportFilter.categories.includes(t.categoryId);
      
      const isTypeIncluded = reportFilter.transactionTypes.includes(t.type);
      
      return isInDateRange && isAccountIncluded && isCategoryIncluded && isTypeIncluded;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate summary data
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netCashFlow = totalIncome - totalExpenses;
  
  // Format date string for inputs
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name.startsWith('account-')) {
      const accountId = name.replace('account-', '');
      
      setReportFilter(prev => ({
        ...prev,
        accounts: checked 
          ? [...prev.accounts, accountId]
          : prev.accounts.filter(id => id !== accountId)
      }));
    } else if (name.startsWith('category-')) {
      const categoryId = name.replace('category-', '');
      
      setReportFilter(prev => ({
        ...prev,
        categories: checked 
          ? [...prev.categories, categoryId]
          : prev.categories.filter(id => id !== categoryId)
      }));
    } else if (name.startsWith('type-')) {
      const type = name.replace('type-', '') as 'income' | 'expense' | 'transfer';
      
      setReportFilter(prev => ({
        ...prev,
        transactionTypes: checked
          ? [...prev.transactionTypes, type]
          : prev.transactionTypes.filter(t => t !== type)
      }));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setReportFilter(initialFilter);
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400">View your financial reports and analytics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
          >
            <Filter size={18} className="mr-1" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <Download size={18} className="mr-1" />
            Export
          </button>
        </div>
      </header>
      
      {/* Time Range Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-3">
          {Object.entries(timeRanges).map(([key, range]) => (
            <button
              key={key}
              onClick={() => handleTimeRangeChange(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTimeRange === key
                  ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        {activeTimeRange === 'custom' && (
          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="start"
                  name="start"
                  value={formatDateForInput(customDateRange.start)}
                  onChange={handleDateChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="end"
                  name="end"
                  value={formatDateForInput(customDateRange.end)}
                  onChange={handleDateChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Report Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Accounts Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accounts</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {accounts.map(account => (
                  <label key={account.id} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`account-${account.id}`}
                      checked={reportFilter.accounts.includes(account.id)}
                      onChange={handleFilterChange}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{account.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Categories Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`category-${category.id}`}
                      checked={reportFilter.categories.includes(category.id)}
                      onChange={handleFilterChange}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                    />
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }} 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Transaction Types Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Types</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="type-income"
                    checked={reportFilter.transactionTypes.includes('income')}
                    onChange={handleFilterChange}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Income</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="type-expense"
                    checked={reportFilter.transactionTypes.includes('expense')}
                    onChange={handleFilterChange}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Expense</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="type-transfer"
                    checked={reportFilter.transactionTypes.includes('transfer')}
                    onChange={handleFilterChange}
                    className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Transfer</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 ${
          totalIncome > 0 ? 'border-green-500' : 'border-gray-300'
        }`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 ${
          totalExpenses > 0 ? 'border-red-500' : 'border-gray-300'
        }`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border-l-4 ${
          netCashFlow > 0 ? 'border-blue-500' : netCashFlow < 0 ? 'border-red-500' : 'border-gray-300'
        }`}>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Net Cash Flow</h3>
          <p className={`text-2xl font-bold ${
            netCashFlow > 0 
              ? 'text-blue-600 dark:text-blue-400' 
              : netCashFlow < 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-800 dark:text-white'
          }`}>
            {formatCurrency(netCashFlow)}
          </p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Income vs Expenses</h2>
          <div className="h-80">
            <IncomeExpenseChart filteredTransactions={filteredTransactions} dateRange={customDateRange} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Expense Distribution</h2>
          <div className="h-80">
            <CategoryDistributionChart 
              filteredTransactions={filteredTransactions.filter(t => t.type === 'expense')} 
              categories={categories} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Account Balance Evolution</h2>
        <div className="h-80">
          <AccountBalanceChart 
            filteredTransactions={filteredTransactions} 
            accounts={accounts} 
            dateRange={customDateRange}
          />
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Transactions</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(transaction => {
                  const category = categories.find(c => c.id === transaction.categoryId);
                  const account = accounts.find(a => a.id === transaction.accountId);
                  const targetAccount = transaction.targetAccountId 
                    ? accounts.find(a => a.id === transaction.targetAccountId) 
                    : null;
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {category ? (
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: category.color }} 
                            />
                            <span>{category.name}</span>
                          </div>
                        ) : (
                          transaction.type === 'transfer' ? 'Transfer' : 'Uncategorized'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {transaction.type === 'transfer' && targetAccount ? (
                          <div className="flex items-center">
                            <span>{account?.name || 'Unknown'}</span>
                            <ArrowUpDown size={14} className="mx-1 text-gray-400" />
                            <span>{targetAccount.name}</span>
                          </div>
                        ) : (
                          account?.name || 'Unknown'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <span 
                          className={`
                            ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : ''}
                            ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : ''}
                            ${transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' : ''}
                          `}
                        >
                          {transaction.type === 'income' ? '+ ' : transaction.type === 'expense' ? '- ' : ''}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No transactions found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;