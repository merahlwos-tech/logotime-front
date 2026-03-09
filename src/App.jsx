import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { trackPageView } from './utils/pixel'
import Navbar from './Components/ui/Navbar'
import Footer from './Components/ui/Footer'
import PrivateRoute from './Components/ui/PrivateRoute'
import AdminLayout from './Components/admin/AdminLayout'
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import ConfirmationPage from './pages/public/ConfirmationPage'
import AboutPage from './pages/public/AboutPage'
import TagProductsPage from './pages/public/TagProductsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import { Link } from 'react-router-dom'
import { useCart } from './context/CartContext'

function PageTracker() {
  const location = useLocation()
  useEffect(() => { trackPageView() }, [location.pathname])
  return null
}

// Bottom nav — 3 boutons : Home / Shop / Workshop
function BottomNav() {
  const location      = useLocation()
  const { itemCount } = useCart()

  const links = [
    { to: '/',         icon: 'home',          label: 'Home' },
    { to: '/products', icon: 'storefront',    label: 'Shop' },
    { to: '/cart',     icon: 'auto_fix_high', label: 'Workshop', badge: itemCount },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-2
                    border-t border-mauve/20 bg-bg-light/95 backdrop-blur-md
                    px-4 pb-4 pt-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
      {links.map(({ to, icon, label, badge }) => {
        const active = location.pathname === to
        return (
          <Link key={to} to={to}
            className={`flex flex-1 flex-col items-center justify-center gap-1
                        transition-colors duration-200
                        ${active ? 'text-primary' : 'text-mauve/60 hover:text-mauve'}`}>
            <div className="relative flex h-8 items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                {icon}
              </span>
              {badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-white
                                 text-[9px] font-bold flex items-center justify-center rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[10px] font-medium leading-normal">{label}</p>
          </Link>
        )
      })}
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right"
            toastOptions={{
              style: {
                background: '#221610',
                color: '#ce8db1',
                border: '1px solid rgba(75,32,56,0.5)',
                borderRadius: '12px',
                fontFamily: 'Public Sans, sans-serif',
                fontSize: '14px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              },
              success: { iconTheme: { primary: '#ec5b13', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ce8db1', secondary: '#221610' } },
            }}
          />
          <Routes>
            <Route path="/"             element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products"     element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/tag/:tag"     element={<PublicLayout><TagProductsPage /></PublicLayout>} />
            <Route path="/cart"         element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
            <Route path="/about"        element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/admin/login"  element={<AdminLoginPage />} />
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index           element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders"   element={<AdminOrdersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App