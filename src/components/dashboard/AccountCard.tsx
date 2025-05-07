import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Account } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AccountCardProps {
  account: Account;
  balance: number;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, balance }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-750 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
    >
      {/* Background color indicator */}
      <div 
        className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300"
        style={{ backgroundColor: account.color }}
      />
      
      <div className="pl-3">
        <h3 className="font-medium text-gray-800 dark:text-white">{account.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {account.type.charAt(0).toUpperCase() + account.type.slice(1).replace('_', ' ')}
        </p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(balance)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{account.currency}</p>
          </div>
          
          <button className="text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;