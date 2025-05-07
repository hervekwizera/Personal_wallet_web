import React, { useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { mockChartData } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

// This is a placeholder component that would use an actual chart library in a real app
const ExpensePieChart: React.FC = () => {
  const { categories } = useFinance();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // In a real app, you would use a proper chart library like Chart.js
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    // Get mock data
    const categoryData = mockChartData.category;
    const total = categoryData.data.reduce((sum, value) => sum + value, 0);
    
    // Center of the pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Draw pie chart
    let startAngle = 0;
    
    categoryData.data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Get corresponding category and its color
      const categoryName = categoryData.labels[index];
      const category = categories.find(c => c.name === categoryName);
      const color = category ? category.color : `hsl(${index * 60}, 70%, 60%)`;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.fill();
      
      startAngle = endAngle;
    });
    
    // Draw center circle for donut chart effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    ctx.fill();
    
    // Draw total in center
    ctx.fillStyle = theme === 'dark' ? '#F9FAFB' : '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Total Expenses', centerX, centerY - 15);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(formatCurrency(total), centerX, centerY + 15);
    
    // Draw legend
    const legendItems = categoryData.labels.map((label, i) => ({
      label,
      value: categoryData.data[i],
      color: categories.find(c => c.name === label)?.color || `hsl(${i * 60}, 70%, 60%)`
    }));
    
    const legendX = width - 150;
    const legendY = 30;
    const legendSpacing = 25;
    
    legendItems.forEach((item, i) => {
      const y = legendY + i * legendSpacing;
      
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 16, 16);
      
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
      ctx.textAlign = 'left';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${item.label}`, legendX + 24, y + 13);
    });
    
  }, [categories, theme]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={500} height={280} className="max-w-full" />
    </div>
  );
};

export default ExpensePieChart;