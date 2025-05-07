import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowDownUp, 
  PieChart, 
  BarChart3, 
  Tags,
  Settings
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  id: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  setCurrentPage, 
  currentPage 
}) => {
  const { theme } = useTheme();
  
  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
    { name: 'Accounts', icon: <Wallet size={20} />, id: 'accounts' },
    { name: 'Transactions', icon: <ArrowDownUp size={20} />, id: 'transactions' },
    { name: 'Budget', icon: <PieChart size={20} />, id: 'budget' },
    { name: 'Reports', icon: <BarChart3 size={20} />, id: 'reports' },
    { name: 'Categories', icon: <Tags size={20} />, id: 'categories' },
  ];

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' ? 'dark' : ''}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-teal-600 dark:text-teal-400">
            Finance Wallet
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your finances
          </p>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-150 ease-in-out
                    ${currentPage === item.id 
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100 font-medium' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full flex items-center px-4 py-3 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            <Settings size={20} className="mr-3" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;