import React, { useState } from 'react';
import { Menu, X, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, setCurrentPage, currentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className="bg-teal-600 dark:bg-teal-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-3 p-2 rounded-full hover:bg-teal-700 dark:hover:bg-teal-900 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold flex items-center">
              <span className="hidden sm:inline">Personal Finance</span>
              <span className="sm:hidden">Finance</span>
              <span className="ml-2 font-light">Wallet</span>
            </h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-teal-700 dark:hover:bg-teal-900 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="ml-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-teal-800 dark:bg-teal-600 flex items-center justify-center font-medium">
                E
              </div>
              <span className="ml-2 hidden sm:block">Eric</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
        
        {/* Mobile sidebar close button */}
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-800 text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto transition-all duration-300">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;