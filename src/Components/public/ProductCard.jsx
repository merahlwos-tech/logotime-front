import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const hasStock  = product.sizes?.some((s) => s.stock > 0)
  const imageUrl  = product.images?.[0] || '/placeholder.jpg'

  return (
    <Link to={`/products/${product._id}`} className="card-product block group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-mauve/20">
        <img
          src={imageUrl} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-mauve/80 via-transparent to-transparent" />

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full
                           bg-primary text-white shadow-dark">
            {product.category}
          </span>
        </div>

        {/* Nom en overlay bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-white text-base font-bold italic leading-snug
                         group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Épuisé */}
        {!hasStock && (
          <Link to={`/products?category=${product.category}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-charcoal/75 flex flex-col items-center
                       justify-center gap-2">
            <span className="font-body font-bold text-gold/80 text-sm">Épuisé</span>
            <span className="font-body text-primary text-xs underline
                             opacity-0 group-hover:opacity-100 transition-opacity">
              Articles similaires →
            </span>
          </Link>
        )}
      </div>

      {/* Infos bas */}
      <div className="p-4 bg-charcoal">
        <p className="font-body text-gold/50 text-xs mb-1">{product.brand}</p>
        <p className="font-body font-bold text-gold text-base">
          {(product.price ?? 0).toLocaleString('fr-DZ')}
          <span className="text-gold/60 text-xs font-normal ml-1">DA</span>
        </p>
      </div>
    </Link>
  )
}

export default ProductCard