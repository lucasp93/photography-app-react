import './App.css'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainHeader />
        <AppRoutes />
        <MainFooter name="Photography App" year={2026} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
