import ProductCard from './ProductCard.jsx'

function ProductGrid({ products, loading, emptyMessage = 'Aucun article trouvé.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-charcoal rounded-2xl overflow-hidden shadow-dark">
            <div className="aspect-[3/4] bg-mauve/20 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-mauve/20 animate-pulse rounded-full w-1/2" />
              <div className="h-4 bg-mauve/20 animate-pulse rounded-full w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-mauve rounded-full flex items-center
                        justify-center mb-6 shadow-fairy">
          <span className="text-3xl">🛍️</span>
        </div>
        <p className="font-display text-mauve text-2xl font-bold italic mb-2">Aucun article</p>
        <p className="font-body text-text-soft text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, i) => (
        <div key={product._id} className="animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid