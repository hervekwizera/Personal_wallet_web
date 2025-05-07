import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const initialFormState = {
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#3B82F6',
    parentId: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddCategory = () => {
    setIsFormOpen(true);
    setEditingCategory(null);
    setFormData(initialFormState);
  };
  
  const handleEditCategory = (category: Category) => {
    setIsFormOpen(true);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      parentId: category.parentId || ''
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      parentId: formData.parentId || undefined
    };
    
    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...categoryData
      });
    } else {
      addCategory(categoryData);
    }
    
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData(initialFormState);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect transactions using this category.')) {
      deleteCategory(id);
    }
  };
  
  // Separate categories by type
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage income and expense categories</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={handleAddCategory}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus size={18} className="mr-1" />
            Add Category
          </button>
        </div>
      </header>
      
      {/* Category Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Groceries"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="h-10 w-10 p-0 border-0 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={handleInputChange}
                    name="color"
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Category (Optional)
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(c => c.type === formData.type && !c.parentId && (!editingCategory || c.id !== editingCategory.id))
                    .map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                <Plus size={14} className="text-white" />
              </span>
              Income Categories
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {incomeCategories.map(category => (
              <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }} 
                  />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {category.name}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Trash2 size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
            
            {incomeCategories.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No income categories found. Add your first income category.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Expense Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-2">
                <Tag size={14} className="text-white" />
              </span>
              Expense Categories
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenseCategories.map(category => (
              <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }} 
                  />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {category.name}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Trash2 size={14} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
            
            {expenseCategories.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No expense categories found. Add your first expense category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;