import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, lazy, Suspense } from 'react'
import { CartProvider }     from './context/CartContext'
import { AuthProvider }     from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { trackPageView }    from './utils/metaPixel'
import Navbar        from './Components/ui/Navbar'
import Footer        from './Components/ui/Footer'
import PrivateRoute  from './Components/ui/PrivateRoute'
import AdminLayout   from './Components/admin/AdminLayout'

// Retry automatique si un chunk ne se charge pas (ex: après redéploiement Cloudflare)
function lazyWithRetry(importFn) {
  return lazy(() =>
    importFn().catch(() => {
      // Chunk introuvable → recharger la page pour récupérer les nouveaux assets
      window.location.reload()
      return new Promise(() => {}) // suspend le rendu le temps du reload
    })
  )
}

const HomePage          = lazyWithRetry(() => import('./pages/public/HomePage'))
const ProductsPage      = lazyWithRetry(() => import('./pages/public/ProductsPage'))
const ProductDetailPage = lazyWithRetry(() => import('./pages/public/ProductDetailPage'))
const CartPage          = lazyWithRetry(() => import('./pages/public/CartPage'))
const ConfirmationPage  = lazyWithRetry(() => import('./pages/public/ConfirmationPage'))
const AboutPage         = lazyWithRetry(() => import('./pages/public/AboutPage'))
const ServerOverloadPage= lazyWithRetry(() => import('./pages/public/ServerOverloadPage'))
const AdminLoginPage    = lazyWithRetry(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboardPage= lazyWithRetry(() => import('./pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazyWithRetry(() => import('./pages/admin/AdminProductsPage'))
const AdminOrdersPage   = lazyWithRetry(() => import('./pages/admin/AdminOrdersPage'))
const AdminOrderDetailPage = lazyWithRetry(() => import('./pages/admin/AdminOrderDetailPage'))
const AdminImagesPage      = lazyWithRetry(() => import('./pages/admin/AdminImagesPage'))

function PageLoader() {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F8F7FF',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '4px solid rgba(108,43,217,0.2)',
        borderTopColor: '#6C2BD9',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function PageViewTracker() {
  const location = useLocation()
  useEffect(() => { trackPageView() }, [location.pathname])
  return null
}

const WA_NUMBER = '213554691650'

function WhatsAppButton() {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')
  if (isAdmin) return null
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="md:!hidden"
      style={{
        position: 'fixed', bottom: 24, left: 20, zIndex: 50,
        width: 52, height: 52, borderRadius: '50%',
        background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
        transition: 'transform 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16.003 2C8.28 2 2 8.28 2 16c0 2.47.65 4.79 1.78 6.8L2 30l7.38-1.75A14 14 0 0 0 16.003 30C23.72 30 30 23.72 30 16S23.72 2 16.003 2zm0 2.5A11.5 11.5 0 0 1 27.5 16c0 6.35-5.15 11.5-11.497 11.5a11.47 11.47 0 0 1-5.88-1.62l-.42-.25-4.38 1.04 1.07-4.25-.27-.43A11.47 11.47 0 0 1 4.5 16 11.5 11.5 0 0 1 16.003 4.5zm-3.19 5.36c-.27-.62-.55-.63-.81-.64l-.69-.01c-.24 0-.62.09-.95.44s-1.24 1.21-1.24 2.95 1.27 3.42 1.45 3.66c.18.24 2.46 3.9 6.06 5.3 3 1.18 3.6.94 4.25.88.65-.06 2.1-.86 2.4-1.69.3-.83.3-1.54.21-1.69-.09-.15-.33-.24-.69-.42s-2.1-1.04-2.43-1.16c-.33-.12-.57-.18-.81.18s-.93 1.16-1.14 1.4c-.21.24-.42.27-.78.09s-1.52-.56-2.9-1.79c-1.07-.95-1.8-2.13-2.01-2.49s-.02-.55.16-.73c.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.79-1.95-1.1-2.67z"/>
      </svg>
    </a>
  )
}

function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <PageViewTracker />
            <Toaster position="top-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#1E0A4A',
                  border: '1px solid rgba(108,43,217,0.15)',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 4px 24px rgba(108,43,217,0.12)',
                },
                success: { iconTheme: { primary: '#6C2BD9', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <Suspense fallback={<PageLoader />}>
              <WhatsAppButton />
              <Routes>
                <Route path="/"             element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/products"     element={<PublicLayout><ProductsPage /></PublicLayout>} />
                <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
                <Route path="/cart"         element={<PublicLayout><CartPage /></PublicLayout>} />
                <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
                <Route path="/about"        element={<PublicLayout><AboutPage /></PublicLayout>} />
                <Route path="/server-error" element={<ServerOverloadPage />} />
                <Route path="/admin/login"  element={<AdminLoginPage />} />
                <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                  <Route index              element={<AdminDashboardPage />} />
                  <Route path="products"    element={<AdminProductsPage />} />
                  <Route path="orders"      element={<AdminOrdersPage />} />
                  <Route path="orders/:id"  element={<AdminOrderDetailPage />} />
                  <Route path="images"       element={<AdminImagesPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App