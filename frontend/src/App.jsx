import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes , Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { useThemeStore } from './store/useThemeStore.js'
import CartPage from './pages/CartPage.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const App = () => {
  const {theme} = useThemeStore();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme]);
  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300'>
      <Navbar />
       <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/product/:id" element={<ProductPage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/cart" element={
        <ProtectedRoute >
          <CartPage />
          </ProtectedRoute>
      }
      />
      </Routes>
      <Toaster />
    
    </div>
  )
}

export default App