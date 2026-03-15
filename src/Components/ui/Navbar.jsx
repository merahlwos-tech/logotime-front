import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLang } from '../../context/LanguageContext'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const YELLOW      = '#FFD600'

/* ── Search icon SVG ── */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const GridIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

function Navbar() {
  const { itemCount }               = useCart()
  const { t, lang, setLang, isRTL } = useLang()
  const [scrolled, setScrolled]     = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const location                    = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  const NAV_ITEMS = [
    { to: '/',        label: lang === 'ar' ? 'الرئيسية' : 'Accueil',  icon: <HomeIcon /> },
    { to: '/products',label: lang === 'ar' ? 'منتجات'  : 'Catalogue', icon: <GridIcon /> },
    { to: '/about',   label: lang === 'ar' ? 'من نحن'  : 'À propos',  icon: <InfoIcon /> },
  ]

  return (
    <>
      {/* ── TOP HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${fontCls}`}
        style={{
          background: PURPLE,
          padding: '14px 20px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled ? '0 4px 20px rgba(108,43,217,0.25)' : 'none',
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div style={{
            width: 40, height: 40,
            borderRadius: 10,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <img src="/icon.webp" alt="Logo Time"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display='none'; e.target.parentElement.style.background=YELLOW; e.target.parentElement.innerHTML='<span style="font-size:18px;font-weight:900;color:#4A1A9E;display:flex;align-items:center;justify-content:center;width:100%;height:100%">L</span>' }}
            />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
            Logo Time
          </span>
        </Link>

        {/* Actions droite */}
        <div className="flex items-center gap-1.5">
          {/* Toggle langue */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 10,
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 800,
              fontFamily: lang === 'fr' ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            }}
            title={lang === 'fr' ? 'Switch to Arabic' : 'Passer en Français'}
          >
            {lang === 'fr' ? 'عر' : 'FR'}
          </button>

          {/* Search */}
          <button
            onClick={() => setShowSearch(s => !s)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none', borderRadius: 10,
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
            }}
          >
            <SearchIcon />
          </button>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 10, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}>
              <BagIcon />
            </div>
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 9, height: 9,
                background: YELLOW, borderRadius: '50%',
                border: `2px solid ${PURPLE}`,
              }} />
            )}
          </Link>
        </div>
      </header>

      {/* ── SEARCH BAR ── */}
      {showSearch && (
        <div
          className="fixed left-0 right-0 z-40 px-4 py-3"
          style={{ top: 72, background: PURPLE_DARK }}
        >
          <input
            autoFocus
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${fontCls}`}
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            onBlur={() => setShowSearch(false)}
          />
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 ${fontCls}`}
        style={{
          background: 'white',
          borderTop: '1px solid rgba(108,43,217,0.1)',
          padding: '10px 20px 20px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          maxWidth: 420, margin: '0 auto',
        }}>
          {/* Home */}
          <Link to="/" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            textDecoration: 'none',
            color: location.pathname === '/' ? PURPLE : 'rgba(30,10,74,0.35)',
            fontSize: 10, fontWeight: 600,
          }}>
            <HomeIcon />
            {lang === 'ar' ? 'الرئيسية' : 'Accueil'}
          </Link>

          {/* Catalogue */}
          <Link to="/products" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            textDecoration: 'none',
            color: location.pathname === '/products' ? PURPLE : 'rgba(30,10,74,0.35)',
            fontSize: 10, fontWeight: 600,
          }}>
            <GridIcon />
            {lang === 'ar' ? 'منتجات' : 'Catalogue'}
          </Link>

          {/* Centre — Panier */}
          <Link to="/cart" style={{ position: 'relative', top: -18 }}>
            <div style={{
              width: 56, height: 56, background: YELLOW,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,214,0,0.5)',
              color: PURPLE_DARK, border: '4px solid #F8F7FF',
            }}>
              <BagIcon />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 18, height: 18, background: PURPLE, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 10, fontWeight: 800,
                }}>
                  {itemCount}
                </span>
              )}
            </div>
          </Link>

          {/* À propos */}
          <Link to="/about" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            textDecoration: 'none',
            color: location.pathname === '/about' ? PURPLE : 'rgba(30,10,74,0.35)',
            fontSize: 10, fontWeight: 600,
          }}>
            <InfoIcon />
            {lang === 'ar' ? 'من نحن' : 'À propos'}
          </Link>

          {/* Langue */}
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(30,10,74,0.35)',
              fontSize: 10, fontWeight: 600,
              fontFamily: lang === 'fr' ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{lang === 'fr' ? 'ع' : 'A'}</span>
            {lang === 'fr' ? 'عربي' : 'FR'}
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar