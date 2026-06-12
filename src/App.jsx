import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Main site
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Admin
import LoginPage from './admin/LoginPage'
import DashboardPage from './admin/DashboardPage'
import OrdersPage from './admin/OrdersPage'
import AdminProductsPage from './admin/AdminProductsPage'
import ProtectedRoute from './admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Main site ── */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* ── Admin ── */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute><AdminProductsPage /></ProtectedRoute>
        } />
        {/* Redirect /admin/* unknown paths to dashboard */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
