import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const NAVY   = '#1e1b4b'
const PURPLE = '#7c3aed'

const CATEGORIES = [
  { label: 'Tous les produits', cat: '' },
  { label: 'Boites',            cat: 'Board' },
  { label: 'Sacs',              cat: 'Bags' },
  { label: 'Cartes',            cat: 'Autocollants' },
  { label: 'Papier',            cat: 'Paper' },
]

function Navbar() {
  const { itemCount } = useCart()
  const navigate      = useNavigate()
  const [scrolled, setScrolled]     = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (cat) => {
    cat ? navigate(`/products?category=${cat}`) : navigate('/products')
    setDrawerOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                       px-4 py-2 transition-all duration-300`}
        style={{
          borderBottom: `1px solid rgba(124,58,237,0.15)`,
          background: scrolled ? 'rgba(245,243,255,0.97)' : 'rgba(245,243,255,0.93)',
          backdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 2px 20px rgba(30,27,75,0.08)' : 'none',
        }}>

        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.jpg" alt="BrandPack" className="h-10 w-10 rounded-full object-contain" />
        </Link>

        <Link to="/"
          className="flex-1 text-center text-xl font-black italic transition-colors"
          style={{ color: NAVY }}>
          BrandPack
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center rounded-full h-10 w-10 transition-colors"
            style={{ color: NAVY }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Catégories">
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <button onClick={() => navigate('/cart')}
            className="relative flex items-center justify-center rounded-full h-10 w-10 transition-colors"
            style={{ color: NAVY }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title="Mon panier">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px]
                               font-bold flex items-center justify-center rounded-full shadow-lg"
                style={{ background: PURPLE }}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ background: 'rgba(30,27,75,0.4)' }}
          onClick={() => setDrawerOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-64 z-50 flex flex-col
                       transition-transform duration-300 ease-in-out shadow-2xl
                       ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: NAVY }}>

        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid rgba(124,58,237,0.25)` }}>
          <span className="text-white font-black italic text-base">Catégories</span>
          <button onClick={() => setDrawerOpen(false)}
            className="transition-colors rounded-full p-1"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1">
          {CATEGORIES.map(({ label, cat }) => (
            <button key={label} onClick={() => goTo(cat)}
              className="w-full flex items-center justify-between px-4 py-3
                         rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
              {label}
              <ChevronRight size={14} style={{ color: 'rgba(124,58,237,0.5)' }} />
            </button>
          ))}
        </div>

        <div className="px-6 py-4" style={{ borderTop: `1px solid rgba(124,58,237,0.2)` }}>
          <p className="text-xs text-center italic" style={{ color: 'rgba(255,255,255,0.25)' }}>
            BrandPack — Algérie
          </p>
        </div>
      </div>
    </>
  )
}

export default Navbar