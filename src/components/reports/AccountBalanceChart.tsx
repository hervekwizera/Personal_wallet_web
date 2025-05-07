import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Account, DateRange, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AccountBalanceChartProps {
  filteredTransactions: Transaction[];
  accounts: Account[];
  dateRange: DateRange;
}

// This is a placeholder component that would use an actual chart library in a real app
const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({
  filteredTransactions,
  accounts,
  dateRange
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate account balance evolution over time
  const calculateBalanceEvolution = () => {
    // Create data structure to track balance evolution
    const accountBalances: {
      [accountId: string]: {
        name: string;
        color: string;
        initialBalance: number;
        balancePoints: { date: Date; balance: number }[];
      }
    } = {};
    
    // Initialize with account data
    accounts.forEach(account => {
      accountBalances[account.id] = {
        name: account.name,
        color: account.color || '#3B82F6',
        initialBalance: account.initialBalance,
        balancePoints: []
      };
    });
    
    // Create a timeline of dates from start to end
    const dates: Date[] = [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 15); // Every 15 days
    }
    if (dates[dates.length - 1].getTime() !== endDate.getTime()) {
      dates.push(new Date(endDate));
    }
    
    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate balance at each date point for each account
    accounts.forEach(account => {
      let balance = account.initialBalance;
      let transactionIndex = 0;
      
      dates.forEach(date => {
        // Apply all transactions up to this date
        while (
          transactionIndex < sortedTransactions.length && 
          new Date(sortedTransactions[transactionIndex].date) <= date
        ) {
          const transaction = sortedTransactions[transactionIndex];
          
          if (transaction.accountId === account.id) {
            if (transaction.type === 'income') {
              balance += transaction.amount;
            } else if (transaction.type === 'expense') {
              balance -= transaction.amount;
            } else if (transaction.type === 'transfer') {
              balance -= transaction.amount;
            }
          }
          
          if (transaction.type === 'transfer' && transaction.targetAccountId === account.id) {
            balance += transaction.amount;
          }
          
          transactionIndex++;
        }
        
        accountBalances[account.id].balancePoints.push({
          date,
          balance
        });
        
        // Reset for next account
        transactionIndex = 0;
      });
    });
    
    return { accountBalances, dates };
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    const { accountBalances, dates } = calculateBalanceEvolution();
    
    // Find max balance for scaling
    let maxBalance = 0;
    let minBalance = 0;
    
    Object.values(accountBalances).forEach(account => {
      account.balancePoints.forEach(point => {
        maxBalance = Math.max(maxBalance, point.balance);
        minBalance = Math.min(minBalance, point.balance);
      });
    });
    
    // Add padding to max/min values
    maxBalance = maxBalance * 1.1;
    minBalance = minBalance < 0 ? minBalance * 1.1 : 0;
    
    // Calculate y-axis scaling
    const yRange = maxBalance - minBalance;
    const yScale = (height - 80) / yRange;
    
    // Calculate x-axis scaling
    const xOffset = 60;
    const xScale = (width - xOffset - 40) / (dates.length - 1);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.moveTo(xOffset, 20);
    ctx.lineTo(xOffset, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    
    // Draw zero line if we have negative balances
    if (minBalance < 0) {
      const zeroY = height - 40 + minBalance * yScale;
      
      ctx.beginPath();
      ctx.strokeStyle = theme === 'dark' ? '#6B7280' : '#9CA3AF';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(xOffset, zeroY);
      ctx.lineTo(width - 20, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw lines for each account
    Object.values(accountBalances).forEach(account => {
      if (account.balancePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = account.color;
        ctx.lineWidth = 2;
        
        account.balancePoints.forEach((point, index) => {
          const x = xOffset + index * xScale;
          const y = height - 40 - (point.balance - minBalance) * yScale;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw points
        account.balancePoints.forEach((point, index) => {
          const x = xOffset + index * xScale;
          const y = height - 40 - (point.balance - minBalance) * yScale;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = account.color;
          ctx.fill();
        });
      }
    });
    
    // Draw date labels (show only first, middle and last)
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    
    const formatDateLabel = (date: Date) => {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };
    
    if (dates.length >= 1) {
      // First date
      ctx.fillText(formatDateLabel(dates[0]), xOffset, height - 20);
      
      // Middle date if we have at least 3 dates
      if (dates.length >= 3) {
        const middleIndex = Math.floor(dates.length / 2);
        const middleX = xOffset + middleIndex * xScale;
        ctx.fillText(formatDateLabel(dates[middleIndex]), middleX, height - 20);
      }
      
      // Last date
      const lastX = xOffset + (dates.length - 1) * xScale;
      ctx.fillText(formatDateLabel(dates[dates.length - 1]), lastX, height - 20);
    }
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    
    // Min value
    ctx.fillText(formatCurrency(minBalance, false), xOffset - 10, height - 40);
    
    // Max value
    ctx.fillText(formatCurrency(maxBalance, false), xOffset - 10, 30);
    
    // Mid value
    const midValue = minBalance + yRange / 2;
    const midY = height - 40 - (midValue - minBalance) * yScale;
    ctx.fillText(formatCurrency(midValue, false), xOffset - 10, midY);
    
    // Draw legend
    const legendX = width - 180;
    const legendY = 30;
    const legendSpacing = 20;
    
    Object.values(accountBalances).forEach((account, index) => {
      const y = legendY + index * legendSpacing;
      
      ctx.fillStyle = account.color;
      ctx.fillRect(legendX, y, 16, 3);
      
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
      ctx.textAlign = 'left';
      ctx.font = '10px sans-serif';
      ctx.fillText(account.name, legendX + 24, y + 4);
    });
    
  }, [filteredTransactions, accounts, dateRange, theme]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={900} height={280} className="max-w-full" />
    </div>
  );
};

export default AccountBalanceChart;