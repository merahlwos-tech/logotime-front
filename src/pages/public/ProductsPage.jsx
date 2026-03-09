import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const NAVY   = '#1e1b4b'
const PURPLE = '#7c3aed'

// value = valeur DB, label = affiché
const CATEGORIES = [
  { value: 'Tous',        label: 'Tous',    emoji: '🛍️' },
  { value: 'Board',       label: 'Boites',  emoji: '📦' },
  { value: 'Bags',        label: 'Sacs',    emoji: '🛍️' },
  { value: 'Autocollants',label: 'Cartes',  emoji: '🎴' },
  { value: 'Paper',       label: 'Papier',  emoji: '📄' },
]

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const activeCategory = searchParams.get('category') || 'Tous'

  const activeCat = CATEGORIES.find(c => c.value === activeCategory) || CATEGORIES[0]

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => products.filter(p => {
    const matchCat    = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [products, activeCategory, search])

  const setCategory = cat => {
    if (cat === 'Tous') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams)
  }

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%)' }}>

      {/* En-tête */}
      <div className="pt-28 pb-10 px-6"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: PURPLE }}>
            Boutique
          </p>
          <h1 className="font-black italic text-5xl mb-1" style={{ color: NAVY }}>
            {activeCat.emoji} {activeCat.label}
          </h1>
          <p className="text-sm text-gray-400">
            {loading ? '...' : `${filtered.length} produit${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filtres sticky */}
      <div className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(245,243,255,0.9)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 justify-between flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold
                           transition-all duration-200"
                style={{
                  background: activeCategory === cat.value ? PURPLE : 'white',
                  color:      activeCategory === cat.value ? 'white' : NAVY,
                  border:     `2px solid ${activeCategory === cat.value ? PURPLE : 'transparent'}`,
                  boxShadow:  activeCategory === cat.value ? '0 2px 12px rgba(124,58,237,0.3)' : 'none',
                }}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="bg-white rounded-full text-sm pl-8 pr-8 py-2 outline-none w-44 transition-all"
              style={{ border: `2px solid rgba(124,58,237,0.2)` }} />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProductGrid products={filtered} loading={loading}
          emptyMessage="Aucun produit dans cette catégorie." />
      </div>
    </div>
  )
}

export default ProductsPage