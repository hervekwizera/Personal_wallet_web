import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import AccountCard from '../components/dashboard/AccountCard';
import BalanceChart from '../components/dashboard/BalanceChart';
import TransactionsList from '../components/dashboard/TransactionsList';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';

const Dashboard: React.FC = () => {
  const { 
    accounts, 
    transactions, 
    categories,
    getTotalBalance,
    getAccountBalance
  } = useFinance();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('thisMonth');
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate total income and expenses for the current month
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const monthlyTransactions = transactions.filter(
    t => new Date(t.date) >= startOfMonth && new Date(t.date) <= endOfMonth
  );
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = getTotalBalance();

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of your finances</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200">
            <Plus size={18} className="mr-1" />
            New Transaction
          </button>
        </div>
      </header>
      
      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transform transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <CreditCard className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transform transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="text-green-600 dark:text-green-300" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Income</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transform transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <TrendingDown className="text-red-600 dark:text-red-300" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Accounts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Your Accounts</h2>
          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium flex items-center">
            <Plus size={16} className="mr-1" />
            Add Account
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map(account => (
            <AccountCard 
              key={account.id} 
              account={account} 
              balance={getAccountBalance(account.id) + account.initialBalance} 
            />
          ))}
        </div>
      </div>
      
      {/* Charts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Income vs Expenses</h2>
            <div className="h-80">
              <BalanceChart />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Expenses by Category</h2>
            <div className="h-80">
              <ExpensePieChart />
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
            <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium">
              View All
            </button>
          </div>
          
          <TransactionsList transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;