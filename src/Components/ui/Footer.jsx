import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'

const PURPLE_DEEP = '#1E0A4A'
const PURPLE      = '#6C2BD9'
const YELLOW      = '#FFD600'
const PHONE       = '+213772793771'
const WA          = '213772793771'

function AdminSecretAccess() {
  const [clicks, setClicks]       = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue]         = useState('')
  const navigate = useNavigate()

  const handleClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }

  const handleChange = e => {
    const val = e.target.value
    setValue(val)
    if (val.toLowerCase() === 'admin') {
      setShowInput(false); setValue(''); navigate('/admin/login')
    }
  }

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="cursor-default select-none"
        style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>©</span>
      {showInput && (
        <input autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-white text-xs px-2 py-1 rounded-lg outline-none shadow-lg"
          style={{ color: PURPLE_DEEP }} placeholder="..." />
      )}
    </div>
  )
}

function Footer() {
  const { t, lang } = useLang()
  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  const LINKS = [
    { label: lang === 'ar' ? 'الرئيسية' : 'Accueil',  to: '/' },
    { label: t('boxes'),                                to: '/products?category=Board' },
    { label: t('bags'),                                 to: '/products?category=Bags' },
    { label: t('cards'),                                to: '/products?category=Autocollants' },
    { label: t('paper'),                                to: '/products?category=Paper' },
    { label: t('about'),                                to: '/about' },
  ]

  return (
    <footer
      className={fontCls}
      style={{ background: 'linear-gradient(135deg, #2d1a6e 0%, #6C2BD9 45%, #a0359e 75%, #c23b8a 100%)', color: 'white', padding: '40px 24px 100px' }}
    >
      {/* Logo & tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
          <img src="/icon.webp" alt="Logo Time"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display='none'; e.target.parentElement.style.background=YELLOW }}
          />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Logo Time</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {lang === 'ar' ? 'تغليف فاخر صنع في الجزائر' : 'Emballage premium made in Algeria'}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 28 }}>
        {lang === 'ar'
          ? 'حلول تغليف مخصصة للعلامات التجارية التي تريد ترك انطباع. مصنوع محلياً، يُوصَّل إلى جميع أنحاء الجزائر.'
          : "Des solutions d'emballage personnalisées pour les marques qui veulent marquer les esprits. Produit localement, livré dans toute l'Algérie."}
      </p>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 28 }} />

      {/* Links grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: YELLOW, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            {lang === 'ar' ? 'التنقل' : 'Navigation'}
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to}
                  style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: YELLOW, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            {lang === 'ar' ? 'التواصل' : 'Contact'}
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
              <span style={{ color: YELLOW }}>📞</span>
              <a href={`tel:${PHONE}`} dir="ltr"
                style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                +213 554 69 16 50
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
              <span style={{ color: YELLOW }}>📍</span>
              {lang === 'ar' ? 'الجزائر' : 'Alger, Algérie'}
            </li>
            <li>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 10,
                  background: '#25D366', color: 'white',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  marginTop: 6,
                }}>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { href: 'https://www.instagram.com/logotime.dz/', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
          { href: `https://wa.me/${WA}`, svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
        ].map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noreferrer"
            style={{
              width: 40, height: 40,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,214,0,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            {s.svg}
          </a>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AdminSecretAccess />
          {' '}{new Date().getFullYear()} Logo Time. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
        </div>
        <a href="https://www.instagram.com/cvkdev/" target="_blank" rel="noreferrer"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
        >
          Developed by CvkDev 🛠️
        </a>
      </div>
    </footer>
  )
}

export default Footer