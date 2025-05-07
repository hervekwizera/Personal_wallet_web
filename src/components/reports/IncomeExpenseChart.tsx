import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Transaction, DateRange } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface IncomeExpenseChartProps {
  filteredTransactions: Transaction[];
  dateRange: DateRange;
}

// This is a placeholder component that would use an actual chart library in a real app
const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ 
  filteredTransactions,
  dateRange 
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Group transactions by month
  const groupTransactionsByMonth = () => {
    const monthlyData: {
      [key: string]: {
        income: number;
        expense: number;
      }
    } = {};
    
    // Create an array of months between start and end dates
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      monthlyData[monthKey] = { income: 0, expense: 0 };
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Sum transactions by month
    filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth() + 1}`;
      
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else if (transaction.type === 'expense') {
          monthlyData[monthKey].expense += transaction.amount;
        }
      }
    });
    
    return monthlyData;
  };
  
  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'short' });
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    const monthlyData = groupTransactionsByMonth();
    const months = Object.keys(monthlyData).sort();
    
    const incomeValues = months.map(month => monthlyData[month].income);
    const expenseValues = months.map(month => monthlyData[month].expense);
    
    const maxValue = Math.max(...incomeValues, ...expenseValues);
    const barWidth = width / (months.length * 2 + 1);
    const barSpacing = barWidth / 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#D1D5DB';
    ctx.lineWidth = 1;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.stroke();
    
    // Draw income bars
    ctx.fillStyle = theme === 'dark' ? '#34D399' : '#10B981';
    incomeValues.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 80);
      const x = 60 + index * (barWidth * 2 + barSpacing);
      const y = height - 40 - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw income value
      ctx.fillStyle = theme === 'dark' ? '#D1FAE5' : '#047857';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      if (barHeight > 30) {
        ctx.fillText(formatCurrency(value, false), x + barWidth / 2, y + 15);
      }
    });
    
    // Draw expense bars
    ctx.fillStyle = theme === 'dark' ? '#F87171' : '#EF4444';
    expenseValues.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 80);
      const x = 60 + barWidth + index * (barWidth * 2 + barSpacing);
      const y = height - 40 - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw expense value
      ctx.fillStyle = theme === 'dark' ? '#FEE2E2' : '#B91C1C';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      if (barHeight > 30) {
        ctx.fillText(formatCurrency(value, false), x + barWidth / 2, y + 15);
      }
    });
    
    // Draw month labels
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    months.forEach((month, index) => {
      const x = 60 + barWidth + index * (barWidth * 2 + barSpacing);
      ctx.fillText(getMonthName(month), x, height - 20);
    });
    
    // Draw legend
    const legendX = width - 150;
    const legendY = 30;
    
    ctx.fillStyle = theme === 'dark' ? '#34D399' : '#10B981';
    ctx.fillRect(legendX, legendY, 16, 16);
    ctx.fillStyle = theme === 'dark' ? '#F87171' : '#EF4444';
    ctx.fillRect(legendX, legendY + 25, 16, 16);
    
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
    ctx.textAlign = 'left';
    ctx.fillText('Income', legendX + 24, legendY + 13);
    ctx.fillText('Expenses', legendX + 24, legendY + 38);
    
    // Draw net income/expense
    const totalIncome = incomeValues.reduce((sum, value) => sum + value, 0);
    const totalExpense = expenseValues.reduce((sum, value) => sum + value, 0);
    const netAmount = totalIncome - totalExpense;
    
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Net: ${formatCurrency(netAmount)}`, 50, 30);
    
  }, [filteredTransactions, dateRange, theme]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={280} className="max-w-full" />
    </div>
  );
};

export default IncomeExpenseChart;