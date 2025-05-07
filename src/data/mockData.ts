import { Account, Transaction, Category, Budget, AccountType } from '../types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Main Bank Account',
    type: 'bank',
    currency: 'USD',
    color: '#3B82F6',
    initialBalance: 5000
  },
  {
    id: '2',
    name: 'Savings',
    type: 'bank',
    currency: 'USD',
    color: '#10B981',
    initialBalance: 10000
  },
  {
    id: '3',
    name: 'Cash Wallet',
    type: 'cash',
    currency: 'USD',
    color: '#F59E0B',
    initialBalance: 500
  },
  {
    id: '4',
    name: 'Mobile Money',
    type: 'mobile_money',
    currency: 'USD',
    color: '#8B5CF6',
    initialBalance: 750
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    type: 'income',
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Freelance',
    type: 'income',
    color: '#3B82F6'
  },
  {
    id: '3',
    name: 'Groceries',
    type: 'expense',
    color: '#F59E0B'
  },
  {
    id: '4',
    name: 'Rent',
    type: 'expense',
    color: '#EF4444'
  },
  {
    id: '5',
    name: 'Entertainment',
    type: 'expense',
    color: '#8B5CF6'
  },
  {
    id: '6',
    name: 'Transportation',
    type: 'expense',
    color: '#EC4899'
  },
  {
    id: '7',
    name: 'Utilities',
    type: 'expense',
    color: '#6366F1'
  },
  {
    id: '8',
    name: 'Investments',
    type: 'expense',
    color: '#14B8A6'
  }
];

// Generate mock transactions for the last 30 days
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Salary income
  transactions.push({
    id: '1',
    accountId: '1',
    categoryId: '1',
    amount: 4500,
    description: 'Monthly Salary',
    date: new Date(now.getFullYear(), now.getMonth(), 1),
    type: 'income'
  });
  
  // Freelance income
  transactions.push({
    id: '2',
    accountId: '1',
    categoryId: '2',
    amount: 1200,
    description: 'Website Development Project',
    date: new Date(now.getFullYear(), now.getMonth(), 15),
    type: 'income'
  });
  
  // Expense transactions
  const expenseCategories = mockCategories.filter(c => c.type === 'expense');
  const accounts = ['1', '3', '4'];
  
  // Generate 20 random expense transactions
  for (let i = 1; i <= 20; i++) {
    const randomCategoryIndex = Math.floor(Math.random() * expenseCategories.length);
    const randomCategory = expenseCategories[randomCategoryIndex];
    
    const randomAccountIndex = Math.floor(Math.random() * accounts.length);
    const randomAccount = accounts[randomAccountIndex];
    
    const randomDay = Math.floor(Math.random() * 30) + 1;
    const randomAmount = Math.floor(Math.random() * 200) + 10;
    
    const transactionDescriptions = [
      'Grocery shopping',
      'Dinner out',
      'Movie tickets',
      'Gas station',
      'Online purchase',
      'Coffee shop',
      'Pharmacy',
      'Clothing store',
      'Electronics'
    ];
    
    const randomDescriptionIndex = Math.floor(Math.random() * transactionDescriptions.length);
    
    transactions.push({
      id: `expense-${i}`,
      accountId: randomAccount,
      categoryId: randomCategory.id,
      amount: randomAmount,
      description: transactionDescriptions[randomDescriptionIndex],
      date: new Date(now.getFullYear(), now.getMonth(), randomDay),
      type: 'expense'
    });
  }
  
  // Add a transfer transaction
  transactions.push({
    id: 'transfer-1',
    accountId: '1',
    categoryId: '8',
    targetAccountId: '2',
    amount: 1000,
    description: 'Transfer to savings',
    date: new Date(now.getFullYear(), now.getMonth(), 5),
    type: 'transfer'
  });
  
  return transactions;
};

export const mockTransactions: Transaction[] = generateMockTransactions();

export const mockBudgets: Budget[] = [
  {
    id: '1',
    categoryId: '3',
    amount: 500,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  },
  {
    id: '2',
    categoryId: '5',
    amount: 300,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  },
  {
    id: '3',
    categoryId: '6',
    amount: 200,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  },
  {
    id: '4',
    categoryId: '7',
    amount: 150,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  }
];

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to get pre-defined time ranges
export const getTimeRanges = (): { [key: string]: { start: Date; end: Date; label: string } } => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  
  return {
    thisMonth: { start: startOfMonth, end: endOfMonth, label: 'This Month' },
    lastMonth: { start: startOfLastMonth, end: endOfLastMonth, label: 'Last Month' },
    thisWeek: { start: startOfWeek, end: endOfWeek, label: 'This Week' },
    thisYear: { start: startOfYear, end: endOfYear, label: 'This Year' },
    custom: { start: startOfMonth, end: now, label: 'Custom' }
  };
};

// Sample chart data for demonstrations
export const mockChartData = {
  monthly: {
    income: [4500, 5200, 4800, 5100, 4900, 5300],
    expense: [3800, 4100, 3900, 4200, 4000, 4300]
  },
  category: {
    labels: ['Groceries', 'Rent', 'Entertainment', 'Transportation', 'Utilities', 'Investments'],
    data: [500, 1500, 300, 200, 150, 1000]
  }
};