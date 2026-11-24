import './App.css'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <MainHeader />
          <main className="flex-1 flex flex-col">
            <AppRoutes />
          </main>
          <MainFooter name="Photography App" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
