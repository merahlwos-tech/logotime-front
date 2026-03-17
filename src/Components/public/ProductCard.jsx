import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const YELLOW      = '#FFD600'
const NAVY        = '#1E0A4A'

function ProductCard({ product }) {
  const { lang } = useLang()

  const minPrice = product.sizes?.length
    ? Math.min(...product.sizes.map(s => s.price ?? 0))
    : 0

  const image = product.images?.[0] || null

  return (
    <Link
      to={`/products/${product._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          transition: 'transform 0.25s, box-shadow 0.25s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(108,43,217,0.18)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'
        }}
      >
        {/* Image */}
        <div style={{ width: '100%', aspectRatio: '4/3', background: '#f3f4f6', overflow: 'hidden' }}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
              📦
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            color: NAVY,
            marginBottom: 6,
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {product.name}
          </h3>

          {minPrice > 0 && (
            <p style={{ fontSize: 12, color: '#6B6B8A', marginBottom: 12 }}>
              {lang === 'ar' ? 'ابتداءً من' : 'à partir de'}{' '}
              <span style={{ fontWeight: 800, color: PURPLE, fontSize: 14 }}>
                {minPrice.toLocaleString('fr-DZ')} DA
              </span>
              {' '}<span style={{ fontSize: 11 }}>/ {lang === 'ar' ? 'وحدة' : 'unité'}</span>
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '10px 0',
            borderRadius: 12,
            background: YELLOW,
            color: PURPLE_DARK,
            fontWeight: 800,
            fontSize: 13,
          }}>
            {lang === 'ar' ? 'اطلب الآن →' : 'Commander →'}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard