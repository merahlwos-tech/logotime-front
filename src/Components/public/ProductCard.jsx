import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const PURPLE_DEEP = '#1E0A4A'
const YELLOW      = '#FFD600'

const CAT_LABELS_FR = { Board: 'Boites', Bags: 'Sacs', Autocollants: 'Cartes', Paper: 'Papier' }
const CAT_LABELS_AR = { Board: 'صناديق', Bags: 'أكياس', Autocollants: 'بطاقات', Paper: 'ورق' }

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { t, lang, isRTL } = useLang()

  const imageUrl  = product.images?.[0] || '/placeholder.jpg'
  const minPrice  = product.sizes?.length ? Math.min(...product.sizes.map(s => s.price ?? 0)) : 0
  const catLabel  = (lang === 'ar' ? CAT_LABELS_AR : CAT_LABELS_FR)[product.category] || product.category

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: 'white', borderRadius: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,43,217,0.22)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#F0EEF9' }}>
        <img src={imageUrl} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
          loading="lazy"
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = ''}
        />
        {/* Badge catégorie */}
        <span style={{
          position: 'absolute', top: 10,
          left: isRTL ? undefined : 10,
          right: isRTL ? 10 : undefined,
          fontSize: 10, fontWeight: 700,
          padding: '4px 10px', borderRadius: 50,
          background: YELLOW, color: PURPLE_DARK,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {catLabel}
        </span>
        {product.doubleSided && (
          <span style={{
            position: 'absolute', top: 10,
            right: isRTL ? undefined : 10,
            left: isRTL ? 10 : undefined,
            fontSize: 9, fontWeight: 700,
            padding: '3px 8px', borderRadius: 50,
            background: PURPLE_DEEP, color: 'white',
          }}>
            {lang === 'ar' ? 'وجهان' : 'Recto-verso'}
          </span>
        )}
      </div>

      {/* Infos */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: PURPLE_DEEP, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: 12, color: PURPLE, fontWeight: 600, marginBottom: 2 }}>
          {t('fromPrice')} <strong style={{ fontSize: 15 }}>{minPrice.toLocaleString('fr-DZ')}</strong> DA
        </p>
        <button
          onClick={e => { e.stopPropagation(); navigate(`/products/${product._id}`) }}
          style={{
            background: YELLOW, color: PURPLE_DARK,
            border: 'none', borderRadius: 8,
            fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
            padding: '9px 16px', cursor: 'pointer', width: '100%',
            transition: 'background 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = '#F5C800'}
          onMouseLeave={e => e.target.style.background = YELLOW}
        >
          {t('chooseSizes')}
        </button>
      </div>
    </div>
  )
}

export default ProductCard