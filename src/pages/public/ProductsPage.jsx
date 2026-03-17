import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'
import { useSEO } from '../../utils/UseSEO'
import { useLang } from '../../context/LanguageContext'

function ProductsPage() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const { lang, isRTL }         = useLang()
  const activeCategory = searchParams.get('category') || 'Tous'
  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  useSEO({
    title: 'Catalogue — Logo Time',
    description: "Tous les emballages personnalisés Logo Time — boites, sacs, cartes, papier.",
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const fetchProducts = () => {
    setError(false)
    setLoading(true)
    api.get('/products')
      .then(res => setProducts(res.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => products.filter(p =>
    activeCategory === 'Tous' || p.category === activeCategory
  ), [products, activeCategory])

  if (error) {
    return (
      <div
        className={fontCls}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          background: '#F8F7FF', minHeight: '100dvh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '72px 24px 100px', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', marginBottom: 8 }}>
          {lang === 'ar' ? 'جاري تحميل المنتجات…' : 'Chargement du catalogue…'}
        </h2>
        <p style={{ fontSize: 14, color: '#6B6B8A', marginBottom: 28, maxWidth: 300, lineHeight: 1.6 }}>
          {lang === 'ar'
            ? 'الخادم يستيقظ، انتظر لحظة ثم أعد المحاولة.'
            : 'Le serveur se réveille, patientez quelques secondes puis réessayez.'}
        </p>
        <button
          onClick={fetchProducts}
          style={{
            background: '#6C2BD9', color: 'white', border: 'none',
            padding: '14px 32px', borderRadius: 12, fontSize: 15,
            fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(108,43,217,0.35)',
          }}
        >
          {lang === 'ar' ? '🔄 إعادة المحاولة' : '🔄 Réessayer'}
        </button>
      </div>
    )
  }

  return (
    <div className={fontCls} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: '#F8F7FF', minHeight: '100dvh', paddingTop: 72 }}>
      <div style={{ padding: '20px 16px 100px' }}>
        <ProductGrid
          products={filtered}
          loading={loading}
          emptyMessage={lang === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'Aucun produit dans cette catégorie.'}
        />
      </div>
    </div>
  )
}

export default ProductsPage