import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Category, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CategoryDistributionChartProps {
  filteredTransactions: Transaction[];
  categories: Category[];
}

// This is a placeholder component that would use an actual chart library in a real app
const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  filteredTransactions,
  categories
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Group transactions by category
  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    // Initialize totals for all categories to zero
    categories.forEach(category => {
      categoryTotals[category.id] = 0;
    });
    
    // Sum transactions by category
    filteredTransactions.forEach(transaction => {
      if (categoryTotals[transaction.categoryId] !== undefined) {
        categoryTotals[transaction.categoryId] += transaction.amount;
      }
    });
    
    // Convert to array and sort by amount (descending)
    const categoryData = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .sort(([_, amountA], [__, amountB]) => amountB - amountA)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          id: categoryId,
          name: category ? category.name : 'Unknown',
          color: category ? category.color : '#CBD5E1',
          amount
        };
      });
    
    return categoryData;
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    const categoryData = getCategoryData();
    if (categoryData.length === 0) {
      // No data to display
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No expense data available for the selected period', width / 2, height / 2);
      return;
    }
    
    const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
    
    // Center of the pie chart
    const centerX = width / 3;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    // Draw pie chart
    let startAngle = 0;
    
    categoryData.forEach((category) => {
      const sliceAngle = (category.amount / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      ctx.fillStyle = category.color;
      ctx.fill();
      
      // Draw percentage label if slice is large enough
      if (sliceAngle > 0.2) {
        const midAngle = startAngle + sliceAngle / 2;
        const x = centerX + radius * 0.7 * Math.cos(midAngle);
        const y = centerY + radius * 0.7 * Math.sin(midAngle);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round((category.amount / total) * 100)}%`, x, y);
      }
      
      startAngle = endAngle;
    });
    
    // Draw center circle for donut chart effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    ctx.fill();
    
    // Draw total in center
    ctx.fillStyle = theme === 'dark' ? '#F9FAFB' : '#111827';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Total', centerX, centerY - 10);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(formatCurrency(total), centerX, centerY + 10);
    
    // Draw legend
    const legendX = width * 0.6;
    const legendY = height * 0.15;
    const legendSpacing = 25;
    const legendMaxItems = Math.floor((height - legendY * 2) / legendSpacing);
    
    // Show top categories, limited by available space
    const legendItems = categoryData.slice(0, legendMaxItems);
    
    legendItems.forEach((item, i) => {
      const y = legendY + i * legendSpacing;
      
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 16, 16);
      
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#1F2937';
      ctx.textAlign = 'left';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${item.name}`, legendX + 24, y + 8);
      ctx.textAlign = 'right';
      ctx.fillText(`${formatCurrency(item.amount)}`, width - 30, y + 8);
    });
    
  }, [filteredTransactions, categories, theme]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={280} className="max-w-full" />
    </div>
  );
};

export default CategoryDistributionChart;