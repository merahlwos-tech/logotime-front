import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'

const NAVY        = '#1E0A4A'
const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const YELLOW      = '#FFD600'

function ServerOverloadPage() {
  const { t, lang, isRTL } = useLang()
  const navigate = useNavigate()
  const fontCls  = lang === 'ar' ? 'font-arabic' : ''

  return (
    <div
      className={fontCls}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: `linear-gradient(135deg, ${NAVY} 0%, ${PURPLE} 60%, #8B45E8 100%)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Déco cercles */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 350, height: 350, background: 'radial-gradient(circle, rgba(255,214,0,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Icône */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(255,214,0,0.15)',
          border: '2px solid rgba(255,214,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <span style={{ fontSize: 44 }}>📡</span>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: YELLOW }}>
            <img src="/icon.webp" alt="Logo Time"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
            Logo Time
          </span>
        </div>

        <h1 style={{ fontWeight: 900, fontSize: 'clamp(22px, 5vw, 28px)', color: 'white', marginBottom: 14, lineHeight: 1.2 }}>
          {t('serverOverload')}
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>
          {t('serverOverloadDesc')}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(0)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 10,
              background: YELLOW, color: PURPLE_DARK,
              fontWeight: 800, fontSize: 15,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(255,214,0,0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <RefreshCw size={18} />
            {t('retry')}
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 700, fontSize: 15,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Accueil'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServerOverloadPage