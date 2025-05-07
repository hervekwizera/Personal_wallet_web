import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Transaction, Category, Account } from '../types';

const Transactions: React.FC = () => {
  const { transactions, accounts, categories, addTransaction } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const initialFormState = {
    accountId: '',
    categoryId: '',
    amount: 0,
    description: '',
    type: 'expense',
    targetAccountId: '',
    tags: []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(formData);
    setIsFormOpen(false);
    setFormData(initialFormState);
  };
  
  // Filtered transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = accountFilter === 'all' || transaction.accountId === accountFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.categoryId === categoryFilter;
    
    return matchesSearch && matchesAccount && matchesType && matchesCategory;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const getAccountName = (id: string) => {
    const account = accounts.find(a => a.id === id);
    return account ? account.name : 'Unknown Account';
  };
  
  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Uncategorized';
  };
  
  const getCategoryColor = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.color : '#CBD5E1';
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUp size={16} className="text-green-500" />;
      case 'expense':
        return <ArrowDown size={16} className="text-red-500" />;
      case 'transfer':
        return <ChevronsUpDown size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your financial transactions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add Transaction
          </button>
        </div>
      </header>
      
      {/* Transaction Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Add New Transaction
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {formData.type === 'transfer' ? 'From Account' : 'Account'}
                </label>
                <select
                  id="accountId"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {formData.type === 'transfer' && (
                <div>
                  <label htmlFor="targetAccountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Account
                  </label>
                  <select
                    id="targetAccountId"
                    name="targetAccountId"
                    value={formData.targetAccountId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    required={formData.type === 'transfer'}
                  >
                    <option value="">Select Target Account</option>
                    {accounts
                      .filter(account => account.id !== formData.accountId)
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              {formData.type !== 'transfer' && (
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter(category => 
                        formData.type === 'income' 
                          ? category.type === 'income' 
                          : category.type === 'expense'
                      )
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
              {sortedTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2">{getTransactionTypeIcon(transaction.type)}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.type !== 'transfer' ? (
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        style={{ 
                          backgroundColor: `${getCategoryColor(transaction.categoryId)}20`,
                          color: getCategoryColor(transaction.categoryId) 
                        }}
                      >
                        {getCategoryName(transaction.categoryId)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Transfer
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {transaction.type === 'transfer' && transaction.targetAccountId ? (
                      <div className="flex items-center space-x-1">
                        <span>{getAccountName(transaction.accountId)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{getAccountName(transaction.targetAccountId)}</span>
                      </div>
                    ) : (
                      getAccountName(transaction.accountId)
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
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No transactions found. Add your first transaction to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;