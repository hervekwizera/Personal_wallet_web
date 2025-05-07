import React, { useState } from 'react';
import { Plus, Edit2, Trash, AlertTriangle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Budget as BudgetType, Category } from '../types';
import { formatCurrency } from '../utils/formatters';

const Budget: React.FC = () => {
  const { budgets, categories, accounts, addBudget, updateBudget, deleteBudget, getCategoryTotal } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  
  const initialFormState = {
    categoryId: '',
    amount: 0,
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    startDate: new Date(),
    accountId: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };
  
  const handleAddBudget = () => {
    setIsFormOpen(true);
    setEditingBudget(null);
    setFormData(initialFormState);
  };
  
  const handleEditBudget = (budget: BudgetType) => {
    setIsFormOpen(true);
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      startDate: budget.startDate,
      accountId: budget.accountId || ''
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBudget) {
      updateBudget({
        ...editingBudget,
        ...formData,
        accountId: formData.accountId || undefined
      });
    } else {
      addBudget({
        ...formData,
        accountId: formData.accountId || undefined
      });
    }
    
    setIsFormOpen(false);
    setEditingBudget(null);
    setFormData(initialFormState);
  };
  
  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };
  
  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };
  
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };
  
  const getAccountName = (id?: string) => {
    if (!id) return 'All Accounts';
    const account = accounts.find(a => a.id === id);
    return account ? account.name : 'Unknown';
  };
  
  // Get the current date range based on budget period
  const getBudgetDateRange = (budget: BudgetType) => {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    let start: Date, end: Date;
    
    switch (budget.period) {
      case 'weekly':
        // Get first day of current week (Sunday)
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case 'monthly':
        // First day of current month
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of month
        break;
      case 'yearly':
        // First day of current year
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    return { start, end };
  };
  
  // Calculate the current spending and progress for each budget
  const budgetsWithProgress = budgets.map(budget => {
    const dateRange = getBudgetDateRange(budget);
    const spent = getCategoryTotal(budget.categoryId, dateRange);
    const progress = (spent / budget.amount) * 100;
    const isOverBudget = progress > 100;
    
    return {
      ...budget,
      spent,
      progress: Math.min(progress, 100), // Cap at 100% for the progress bar
      isOverBudget
    };
  });
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Budget</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your spending limits</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={handleAddBudget}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Create Budget
          </button>
        </div>
      </header>
      
      {/* Budget Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            {editingBudget ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {categories.filter(c => c.type === 'expense').map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Amount
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
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Period
                </label>
                <select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account (Optional)
                </label>
                <select
                  id="accountId"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Accounts</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
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
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetsWithProgress.map(budget => {
          const category = getCategoryById(budget.categoryId);
          
          return (
            <div 
              key={budget.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {getCategoryName(budget.categoryId)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
                    {budget.accountId && ` • ${getAccountName(budget.accountId)}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditBudget(budget)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit2 size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Trash size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Spent: {formatCurrency(budget.spent)}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Budget: {formatCurrency(budget.amount)}
                </span>
              </div>
              
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    budget.isOverBudget 
                      ? 'bg-red-500 dark:bg-red-600' 
                      : budget.progress > 80 
                        ? 'bg-amber-500 dark:bg-amber-600' 
                        : 'bg-teal-500 dark:bg-teal-600'
                  }`}
                  style={{ width: `${budget.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span 
                  className={`text-sm font-medium ${
                    budget.isOverBudget 
                      ? 'text-red-600 dark:text-red-400' 
                      : budget.progress > 80 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {Math.round((budget.spent / budget.amount) * 100)}% Used
                </span>
                
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {budget.isOverBudget 
                    ? formatCurrency(budget.spent - budget.amount) + ' over' 
                    : formatCurrency(budget.amount - budget.spent) + ' left'}
                </span>
              </div>
              
              {budget.isOverBudget && (
                <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center">
                  <AlertTriangle size={16} className="text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Budget exceeded by {formatCurrency(budget.spent - budget.amount)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        {budgetsWithProgress.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any budgets yet.
            </p>
            <button
              onClick={handleAddBudget}
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={18} className="mr-1" />
              Create Your First Budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;