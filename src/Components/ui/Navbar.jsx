import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useLang } from '../../context/LanguageContext'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const YELLOW      = '#FFD600'

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

function Navbar() {
  const { itemCount }             = useCart()
  const { lang, setLang, isRTL }  = useLang()
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  const NAV_LINKS = [
    { to: '/products?category=Board',        label: lang === 'ar' ? 'العلب'  : 'Boites' },
    { to: '/products?category=Bags',         label: lang === 'ar' ? 'الأكياس'   : 'Sacs' },
    { to: '/products?category=Autocollants', label: lang === 'ar' ? 'البطاقات'  : 'Cartes' },
    { to: '/products?category=Paper',        label: lang === 'ar' ? 'الورق'     : 'Papier' },
    { to: '/products?category=Pack',         label: lang === 'ar' ? 'العروض'    : 'Packs',  isPack: true },
    { to: '/about',                          label: lang === 'ar' ? 'من نحن'    : 'À propos' },
  ]

  return (
    <header
      className={fontCls}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'linear-gradient(135deg, #2d1a6e 0%, #6C2BD9 45%, #a0359e 75%, #c23b8a 100%)',
        padding: '14px 20px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: scrolled ? '0 4px 20px rgba(108,43,217,0.25)' : 'none',
        transition: 'box-shadow 0.3s',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
          <img src="/icon.webp" alt="Logo Time"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentElement.style.background = YELLOW
              e.target.parentElement.style.display = 'flex'
              e.target.parentElement.style.alignItems = 'center'
              e.target.parentElement.style.justifyContent = 'center'
              e.target.parentElement.innerHTML = '<span style="font-size:18px;font-weight:900;color:#4A1A9E">L</span>'
            }}
          />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
          Logo Time
        </span>
      </Link>

      {/* Nav desktop */}
      <nav className="hidden lg:flex items-center gap-1">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to}
            style={{
              padding: '6px 12px', borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              color: l.isPack ? YELLOW : 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              transition: 'color 0.15s, background 0.15s',
              ...(l.isPack ? { fontWeight: 800 } : {}),
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.color = l.isPack ? YELLOW : 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent' }}
          >
            {l.isPack && <span style={{ marginRight: 3 }}>🎁</span>}
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Actions droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Toggle langue — jaune */}
        <button
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          style={{
            background: YELLOW,
            border: 'none', borderRadius: 10,
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: PURPLE_DARK, cursor: 'pointer',
            fontSize: 12, fontWeight: 900,
            fontFamily: lang === 'fr' ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
            boxShadow: '0 2px 8px rgba(255,214,0,0.4)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          {lang === 'fr' ? 'عر' : 'FR'}
        </button>

        {/* Cart — jaune */}
        <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
          <div style={{
            background: YELLOW,
            borderRadius: 10, width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: PURPLE_DARK,
            boxShadow: '0 2px 8px rgba(255,214,0,0.4)',
            transition: 'transform 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <BagIcon />
          </div>
          {itemCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 18, height: 18,
              background: PURPLE_DARK, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 10, fontWeight: 900,
              border: `2px solid ${PURPLE}`,
            }}>
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}

export default Navbar