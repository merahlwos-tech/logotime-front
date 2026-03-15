import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'
import { useSEO } from '../../utils/UseSEO'
import { useLang } from '../../context/LanguageContext'

const PURPLE      = '#6C2BD9'
const PURPLE_DEEP = '#1E0A4A'
const YELLOW      = '#FFD600'

const CATS_FR = [
  { key: 'Tous',         label: 'Tous' },
  { key: 'Board',        label: 'Boites' },
  { key: 'Bags',         label: 'Sacs' },
  { key: 'Autocollants', label: 'Cartes' },
  { key: 'Paper',        label: 'Papier' },
]
const CATS_AR = [
  { key: 'Tous',         label: 'الكل' },
  { key: 'Board',        label: 'صناديق' },
  { key: 'Bags',         label: 'أكياس' },
  { key: 'Autocollants', label: 'بطاقات' },
  { key: 'Paper',        label: 'ورق' },
]

function ProductsPage() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const { lang, isRTL }         = useLang()
  const activeCategory = searchParams.get('category') || 'Tous'
  const fontCls = lang === 'ar' ? 'font-arabic' : ''
  const cats = lang === 'ar' ? CATS_AR : CATS_FR

  useSEO({
    title: 'Catalogue — Logo Time',
    description: "Tous les emballages personnalisés Logo Time — boites, sacs, cartes, papier.",
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => products.filter(p =>
    activeCategory === 'Tous' || p.category === activeCategory
  ), [products, activeCategory])

  return (
    <div className={fontCls} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: '#F8F7FF', minHeight: '100dvh', paddingTop: 72 }}>

      {/* Header section */}
      <div style={{
        background: `linear-gradient(160deg, ${PURPLE_DEEP} 0%, ${PURPLE} 100%)`,
        padding: '28px 20px 48px',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,214,0,0.18)',
          border: '1px solid rgba(255,214,0,0.4)',
          color: YELLOW, fontSize: 11, fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '5px 14px', borderRadius: 50, marginBottom: 12,
        }}>
          {lang === 'ar' ? '✦ منتجاتنا' : '✦ Nos produits'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
          {lang === 'ar' ? 'كل مجموعتنا' : 'Notre catalogue'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 }}>
          {lang === 'ar'
            ? 'تغليف مخصص لعلامتك التجارية'
            : "Emballages sur mesure pour votre marque"}
        </p>
      </div>

      {/* Category filter pills */}
      <div style={{
        padding: '0 16px',
        marginTop: -20,
        display: 'flex', gap: 8, overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
      }}>
        {cats.map(c => {
          const active = activeCategory === c.key
          return (
            <a key={c.key}
              href={c.key === 'Tous' ? '/products' : `/products?category=${c.key}`}
              style={{
                flexShrink: 0,
                padding: '10px 18px',
                borderRadius: 50,
                fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
                background: active ? YELLOW : 'white',
                color: active ? PURPLE_DEEP : PURPLE,
                border: active ? 'none' : `2px solid rgba(108,43,217,0.2)`,
                boxShadow: active ? '0 4px 12px rgba(255,214,0,0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {c.label}
            </a>
          )
        })}
      </div>

      {/* Products grid */}
      <div style={{ padding: '20px 16px 100px' }}>
        <ProductGrid products={filtered} loading={loading}
          emptyMessage={lang === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'Aucun produit dans cette catégorie.'} />
      </div>
    </div>
  )
}

export default ProductsPage