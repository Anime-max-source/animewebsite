import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import CartDrawer from './components/storefront/CartDrawer'
import StorefrontSidebar from './components/storefront/StorefrontSidebar'
import StorefrontTopBar from './components/storefront/StorefrontTopBar'
import StorefrontFooter from './components/storefront/StorefrontFooter'
import AdminLayout from './components/admin/AdminLayout'

// Storefront Pages
import Home from './pages/storefront/Home'
import ProductDetail from './pages/storefront/ProductDetail'
import Cart from './pages/storefront/Cart'
import Checkout from './pages/storefront/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

// Account Pages
import SignIn from './pages/account/SignIn'
import SignUp from './pages/account/SignUp'
import Account from './pages/account/Account'
import OrderHistory from './pages/account/OrderHistory'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageOrders from './pages/admin/ManageOrders'
import ManageBanners from './pages/admin/ManageBanners'
import Customers from './pages/admin/Customers'
import Messages from './pages/admin/Messages'
import AdminSettings from './pages/admin/AdminSettings'

// Route Guards
import ProtectedBuyerRoute from './routes/ProtectedBuyerRoute'
import ProtectedAdminRoute from './routes/ProtectedAdminRoute'
import { X } from 'lucide-react'

export default function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className={`min-h-screen flex flex-col ${isAdminPath ? 'bg-[#F5F6F8] text-[#111827]' : 'bg-[#E3EFE1] text-[#111111]'}`}>
      {/* Global Slide-out Shopping Cart Drawer */}
      <CartDrawer />

      {isAdminPath ? (
        /* Admin Layout: Light SaaS Theme (#FFFFFF Sidebar, #F5F6F8 Canvas, #EDEDED Borders) */
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/products" element={<ProtectedAdminRoute><ManageProducts /></ProtectedAdminRoute>} />
            <Route path="/admin/orders" element={<ProtectedAdminRoute><ManageOrders /></ProtectedAdminRoute>} />
            <Route path="/admin/content" element={<ProtectedAdminRoute><ManageBanners /></ProtectedAdminRoute>} />
            <Route path="/admin/customers" element={<ProtectedAdminRoute><Customers /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
            <Route path="/admin/messages" element={<ProtectedAdminRoute><Messages /></ProtectedAdminRoute>} />
            <Route path="/admin/login/*" element={<AdminLogin />} />
          </Routes>
        </AdminLayout>
      ) : (
        /* Storefront Layout: Pastel-Green Canvas (#E3EFE1) + Floating Rounded Cards */
        <div className="min-h-screen p-3 sm:p-5 lg:p-6 flex gap-6 max-w-[1700px] w-full mx-auto">
          
          {/* Desktop Floating Left Sidebar */}
          <div className="hidden lg:block">
            <StorefrontSidebar />
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="relative z-10 w-80 max-w-[85vw] bg-white h-full p-4 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div onClick={() => setMobileNavOpen(false)}>
                  <StorefrontSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Main Storefront Area: Top Bar + Content + Footer */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <StorefrontTopBar onMobileMenuToggle={() => setMobileNavOpen(true)} />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

                {/* Account Routes */}
                <Route path="/signin/*" element={<SignIn />} />
                <Route path="/signup/*" element={<SignUp />} />
                <Route path="/account" element={<ProtectedBuyerRoute><Account /></ProtectedBuyerRoute>} />
                <Route path="/orders" element={<ProtectedBuyerRoute><OrderHistory /></ProtectedBuyerRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <StorefrontFooter />
          </div>

        </div>
      )}
    </div>
  )
}
