import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import SizeSelector from '../../Components/public/SizeSelector'
import QuantitySelector from '../../Components/public/QuantitySelector'
import toast from 'react-hot-toast'
import { trackViewContent } from '../../utils/pixel'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data)
        const first = res.data.sizes?.find((s) => s.stock > 0)
        if (first) setSelectedSize(first.size)
        // ── Meta Pixel : ViewContent ──
        trackViewContent(res.data)
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-sf-cream flex items-center justify-center pt-20">
      <div className="w-10 h-10 border-3 border-sf-beige-dark border-t-sf-rose
                      rounded-full animate-spin" />
    </div>
  )

  if (!product) return null

  const maxStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 1
  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Veuillez sélectionner une taille 👆'); return }
    addToCart(product, selectedSize, quantity)
    toast.success(`${product.name} ajouté au panier ! 🛍️`)
  }

  return (
    <div className="min-h-screen bg-sf-cream pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sf-text-soft hover:text-sf-text
                     transition-colors text-sm font-body group">
          <ArrowLeft size={16}
            className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Galerie */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[3/4] bg-sf-beige rounded-2xl overflow-hidden group">
              <img src={images[currentImage]} alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700
                           group-hover:scale-105" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((i) => i === 0 ? images.length - 1 : i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90
                               rounded-full flex items-center justify-center shadow-soft
                               opacity-0 group-hover:opacity-100 transition-opacity
                               hover:bg-white">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCurrentImage((i) => i === images.length - 1 ? 0 : i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90
                               rounded-full flex items-center justify-center shadow-soft
                               opacity-0 group-hover:opacity-100 transition-opacity
                               hover:bg-white">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-body
                                 font-600 text-sf-text shadow-soft">
                  {product.category}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all
                                ${i === currentImage ? 'border-sf-rose shadow-rose' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-6 animate-fade-up">
            <div>
              <p className="sf-label mb-2">{product.brand}</p>
              <h1 className="font-display text-sf-text text-4xl sm:text-5xl leading-tight mb-4">
                {product.name}
              </h1>
              <p className="font-body font-700 text-sf-text text-3xl">
                {(product.price ?? 0).toLocaleString('fr-DZ')}
                <span className="text-base text-sf-text-soft font-400 ml-2">DA</span>
              </p>
            </div>

            <div className="h-px bg-sf-beige" />

            <div>
              <p className="font-body text-sf-text-soft text-sm font-600 uppercase
                             tracking-wider mb-3">
                Taille
                {selectedSize && <span className="ml-2 text-sf-rose-dark">{selectedSize}</span>}
              </p>
              <SizeSelector sizes={product.sizes || []} selected={selectedSize}
                onChange={(size) => { setSelectedSize(size); setQuantity(1) }} />
              {selectedSize && (
                <p className="text-sf-text-light text-xs font-body mt-2">
                  {maxStock} disponible{maxStock > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div>
              <p className="font-body text-sf-text-soft text-sm font-600 uppercase
                             tracking-wider mb-3">Quantité</p>
              <QuantitySelector value={quantity} min={1} max={maxStock}
                onChange={setQuantity} />
            </div>

            <button onClick={handleAddToCart}
              className="btn-primary w-full py-4 text-base rounded-2xl">
              <ShoppingBag size={18} />
              Ajouter au panier
            </button>

            {product.description && (
              <>
                <div className="h-px bg-sf-beige" />
                <div>
                  <p className="font-body text-sf-text-soft text-sm font-600 uppercase
                                 tracking-wider mb-3">Description</p>
                  <p className="font-body text-sf-text-soft leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              </>
            )}

            <div className="bg-sf-sage-soft rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-body font-700 text-sf-text text-sm">
                  Livraison dans toute l'Algérie
                </p>
                <p className="font-body text-sf-text-soft text-xs mt-0.5">
                  Paiement à la livraison · 2 à 5 jours ouvrables
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage