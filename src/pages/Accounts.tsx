import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Account, AccountType } from '../types';
import { formatCurrency } from '../utils/formatters';

const Accounts: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, getAccountBalance } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  const initialFormState = {
    name: '',
    type: 'bank' as AccountType,
    currency: 'USD',
    initialBalance: 0,
    color: '#3B82F6'
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialBalance' ? parseFloat(value) : value
    }));
  };
  
  const handleAddAccount = () => {
    setIsFormOpen(true);
    setEditingAccount(null);
    setFormData(initialFormState);
  };
  
  const handleEditAccount = (account: Account) => {
    setIsFormOpen(true);
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      currency: account.currency,
      initialBalance: account.initialBalance,
      color: account.color || '#3B82F6'
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      updateAccount({
        ...editingAccount,
        ...formData
      });
    } else {
      addAccount(formData);
    }
    
    setIsFormOpen(false);
    setEditingAccount(null);
    setFormData(initialFormState);
  };
  
  const handleDeleteAccount = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      deleteAccount(id);
    }
  };
  
  const accountTypes: { [key in AccountType]: string } = {
    bank: 'Bank Account',
    cash: 'Cash',
    mobile_money: 'Mobile Money',
    credit_card: 'Credit Card',
    investment: 'Investment'
  };
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Accounts</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage all your financial accounts</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={handleAddAccount}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add Account
          </button>
        </div>
      </header>
      
      {/* Account Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            {editingAccount ? 'Edit Account' : 'Add New Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Main Bank Account"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {Object.entries(accountTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Balance
                </label>
                <input
                  type="number"
                  id="initialBalance"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-10 p-0 border-0 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={handleInputChange}
                    name="color"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
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
                {editingAccount ? 'Update Account' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Accounts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map(account => (
                <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: account.color || '#3B82F6' }} 
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {accountTypes[account.type]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                    {account.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(getAccountBalance(account.id) + account.initialBalance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {accounts.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No accounts found. Add your first account to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;