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
  const { lang, isRTL }         = useLang()
  const activeCategory = searchParams.get('category') || 'Tous'
  const fontCls = lang === 'ar' ? 'font-arabic' : ''

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