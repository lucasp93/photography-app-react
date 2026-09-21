import './App.css'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainHeader from './components/MainHeader';
import MainFooter from './components/MainFooter';
import AppRoutes from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainHeader />
      <AppRoutes />
      <MainFooter name="Photography App" year={2026} />
    </BrowserRouter>
  )
}

export default App;
