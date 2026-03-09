import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

function ProductsPage() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const activeCategory = searchParams.get('category') || 'Tous'

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
    <div className="min-h-screen pt-20"
      style={{ background: 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductGrid products={filtered} loading={loading}
          emptyMessage="Aucun produit dans cette catégorie." />
      </div>
    </div>
  )
}

export default ProductsPage