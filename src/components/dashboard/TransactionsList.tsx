import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowUpDown as ArrowsUpDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const { accounts, categories } = useFinance();
  
  const getAccountName = (id: string): string => {
    const account = accounts.find(a => a.id === id);
    return account ? account.name : 'Unknown';
  };
  
  const getCategoryName = (id: string): string => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Uncategorized';
  };
  
  const getCategoryColor = (id: string): string => {
    const category = categories.find(c => c.id === id);
    return category ? category.color : '#CBD5E1';
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight size={18} className="text-green-500" />;
      case 'expense':
        return <ArrowDownRight size={18} className="text-red-500" />;
      case 'transfer':
        return <ArrowsUpDown size={18} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {transactions.length === 0 && (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          <p>No transactions found.</p>
        </div>
      )}
      
      {transactions.map(transaction => (
        <div key={transaction.id} className="py-4 flex items-center">
          <div className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            {getTransactionIcon(transaction.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {transaction.description}
            </p>
            <div className="flex text-xs text-gray-500 dark:text-gray-400">
              <span>{getAccountName(transaction.accountId)}</span>
              <span className="mx-1">•</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
          
          <div className="ml-4 text-right">
            <p className={`
              text-sm font-medium
              ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : ''}
              ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : ''}
              ${transaction.type === 'transfer' ? 'text-blue-600 dark:text-blue-400' : ''}
            `}>
              {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
              {formatCurrency(transaction.amount)}
            </p>
            
            {transaction.type !== 'transfer' && (
              <span 
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs" 
                style={{ 
                  backgroundColor: `${getCategoryColor(transaction.categoryId)}20`,
                  color: getCategoryColor(transaction.categoryId) 
                }}
              >
                {getCategoryName(transaction.categoryId)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;