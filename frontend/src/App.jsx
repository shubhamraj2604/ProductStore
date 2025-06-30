import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes , Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import { useThemeStore } from './store/useThemeStore.js'
import CartPage from './pages/CartPage.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const {theme} = useThemeStore();
  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300 bg-gradient-to-b from-black to-gray-900' >
      <Navbar />
       <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/product/:id" element={<ProductPage />}/>
      <Route path="/cart" element={<CartPage />} />

      </Routes>
      <Toaster />
    
    </div>
  )
}

export default App