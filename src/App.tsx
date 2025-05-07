import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Categories from './pages/Categories';

type Page = 'dashboard' | 'accounts' | 'transactions' | 'budget' | 'reports' | 'categories';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'accounts':
        return <Accounts />;
      case 'transactions':
        return <Transactions />;
      case 'budget':
        return <Budget />;
      case 'reports':
        return <Reports />;
      case 'categories':
        return <Categories />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <FinanceProvider>
        <Layout setCurrentPage={setCurrentPage} currentPage={currentPage}>
          {renderPage()}
        </Layout>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;