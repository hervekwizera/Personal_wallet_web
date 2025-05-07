import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Account, 
  Transaction, 
  Category, 
  Budget, 
  AccountType 
} from '../types';
import { mockAccounts, mockTransactions, mockCategories, mockBudgets } from '../data/mockData';

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getCategoryTotal: (categoryId: string, period?: { start: Date; end: Date }) => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load initial data (from localStorage in a real app, or mock data for demonstration)
  useEffect(() => {
    // In a real app, you'd fetch from localStorage or an API
    setAccounts(mockAccounts);
    setTransactions(mockTransactions);
    setCategories(mockCategories);
    setBudgets(mockBudgets);
  }, []);

  // Save data whenever it changes (in a real app)
  useEffect(() => {
    // In a real app, you'd save to localStorage or an API
    // localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts, transactions, categories, budgets]);

  // Account methods
  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      id: crypto.randomUUID(),
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  // Transaction methods
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Category methods
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  // Budget methods
  const addBudget = (budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: crypto.randomUUID(),
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Utility functions
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      return total + getAccountBalance(account.id);
    }, 0);
  };

  const getAccountBalance = (accountId: string) => {
    return transactions
      .filter(t => t.accountId === accountId)
      .reduce((balance, t) => {
        return t.type === 'income' ? balance + t.amount : balance - t.amount;
      }, 0);
  };

  const getCategoryTotal = (
    categoryId: string, 
    period?: { start: Date; end: Date }
  ) => {
    let filteredTransactions = transactions.filter(t => t.categoryId === categoryId);
    
    if (period) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.date >= period.start && t.date <= period.end
      );
    }
    
    return filteredTransactions.reduce((total, t) => total + t.amount, 0);
  };

  const value = {
    accounts,
    transactions,
    categories,
    budgets,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getTotalBalance,
    getAccountBalance,
    getCategoryTotal
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};