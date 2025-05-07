export type AccountType = 'bank' | 'cash' | 'mobile_money' | 'credit_card' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  icon?: string;
  color?: string;
  initialBalance: number;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  tags?: string[];
  targetAccountId?: string; // For transfers between accounts
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  parentId?: string; // For subcategories
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  accountId?: string; // Optional: budget for specific account
}

export interface TimeRange {
  start: Date;
  end: Date;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ReportFilter {
  accounts: string[];
  categories: string[];
  dateRange: DateRange;
  transactionTypes: TransactionType[];
}