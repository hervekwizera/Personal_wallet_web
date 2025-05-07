import React, { useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { mockChartData } from '../../data/mockData';

// This is a placeholder component that would use an actual chart library in a real app
const BalanceChart: React.FC = () => {
  const { transactions } = useFinance();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // In a real app, you would use a proper chart library like Chart.js
  // This is just a simple visualization for demonstration
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    // Get mock data
    const incomeData = mockChartData.monthly.income;
    const expenseData = mockChartData.monthly.expense;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const maxValue = Math.max(...incomeData, ...expenseData);
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
    incomeData.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 80);
      const x = 60 + index * (barWidth * 2 + barSpacing);
      const y = height - 40 - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw expense bars
    ctx.fillStyle = theme === 'dark' ? '#F87171' : '#EF4444';
    expenseData.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 80);
      const x = 60 + barWidth + index * (barWidth * 2 + barSpacing);
      const y = height - 40 - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw month labels
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    months.forEach((month, index) => {
      const x = 60 + barWidth / 2 + index * (barWidth * 2 + barSpacing);
      ctx.fillText(month, x + barWidth / 2, height - 20);
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
    
  }, [theme, transactions]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={500} height={280} className="max-w-full" />
    </div>
  );
};

export default BalanceChart;