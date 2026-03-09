import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import SizeSelector from '../../Components/public/SizeSelector'
import QuantitySelector from '../../Components/public/QuantitySelector'
import toast from 'react-hot-toast'

const NAVY   = '#1e1b4b'
const PURPLE = '#7c3aed'
const CAT_LABELS = { Board: 'Boites', Bags: 'Sacs', Autocollants: 'Cartes', Paper: 'Papier' }

function ProductDetailPage() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [doubleSided, setDoubleSided]   = useState(false)
  const [quantity, setQuantity]         = useState(100)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data)
        if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0].size)
        setDoubleSided(res.data.doubleSided ?? false)
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg,#f5f3ff,#ede9fe,#e0e7ff)' }}>
      <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
    </div>
  )

  if (!product) return null

  const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize)
  const basePrice       = selectedSizeObj?.price ?? 0
  const extraPrice      = (doubleSided && product.doubleSided) ? (product.doubleSidedPrice ?? 0) : 0
  const unitPrice       = basePrice + extraPrice
  const totalPrice      = unitPrice * quantity
  const images          = product.images?.length > 0 ? product.images : ['/placeholder.jpg']
  const catLabel        = CAT_LABELS[product.category] || product.category

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Veuillez sélectionner une taille'); return }
    addToCart({ ...product, computedPrice: unitPrice }, selectedSize, quantity, doubleSided)
    toast.success(`${product.name} ajouté au panier !`)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error('Veuillez sélectionner une taille'); return }
    addToCart({ ...product, computedPrice: unitPrice }, selectedSize, quantity, doubleSided)
    navigate('/cart')
  }

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 50%,#e0e7ff 100%)' }}>

      {/* ── Image pleine largeur ── */}
      <div className="relative w-full" style={{ height: '65vh', minHeight: 360 }}>
        <img src={images[currentImage]} alt={product.name}
          className="w-full h-full object-cover" />

        {/* Overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom,rgba(30,27,75,0.1) 0%,rgba(30,27,75,0.6) 100%)' }} />

        {/* Bouton retour */}
        <button onClick={() => navigate(-1)}
          className="absolute top-20 left-5 flex items-center gap-2 px-4 py-2 rounded-full
                     text-white text-sm font-medium backdrop-blur-sm transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <ArrowLeft size={16} /> Retour
        </button>

        {/* Badge catégorie */}
        <div className="absolute top-20 right-5">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: PURPLE }}>
            {catLabel}
          </span>
        </div>

        {/* Flèches */}
        {images.length > 1 && (<>
          <button onClick={() => setCurrentImage(i => i === 0 ? images.length - 1 : i - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentImage(i => i === images.length - 1 ? 0 : i + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ChevronRight size={20} />
          </button>
        </>)}

        {/* Titre + prix en bas */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-white font-black italic text-3xl sm:text-4xl drop-shadow-lg mb-1">
            {product.name}
          </h1>
          <p className="text-white font-black text-xl drop-shadow">
            {unitPrice.toLocaleString('fr-DZ')}
            <span className="text-sm font-normal opacity-70 ml-1">DA / unité</span>
          </p>
        </div>

        {/* Dots miniatures */}
        {images.length > 1 && (
          <div className="absolute bottom-5 right-6 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === currentImage ? 'white' : 'rgba(255,255,255,0.35)' }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Panneau d'options ── */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-7">

        {/* Tailles */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NAVY }}>
            Taille
            {selectedSize && <span style={{ color: PURPLE }} className="ml-2">— {selectedSize}</span>}
          </p>
          <SizeSelector sizes={product.sizes || []} selected={selectedSize}
            onChange={size => setSelectedSize(size)} />
        </div>

        {/* Couleurs */}
        {product.colors?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NAVY }}>
              Couleurs disponibles
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(c => (
                <span key={c} className="px-3 py-1 rounded-full text-sm font-medium border"
                  style={{ borderColor: 'rgba(124,58,237,0.3)', color: PURPLE, background: 'rgba(124,58,237,0.06)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Double impression */}
        {product.doubleSided && (
          <div className="rounded-2xl border-2 p-4 cursor-pointer transition-all"
            style={{
              borderColor: doubleSided ? PURPLE : '#e5e7eb',
              background:  doubleSided ? 'rgba(124,58,237,0.04)' : '#f9fafb',
            }}
            onClick={() => setDoubleSided(d => !d)}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-6 rounded-full transition-colors"
                  style={{ background: doubleSided ? PURPLE : '#d1d5db' }}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all
                                   ${doubleSided ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: NAVY }}>Impression des deux côtés</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {product.doubleSidedPrice > 0
                    ? `+${product.doubleSidedPrice.toLocaleString('fr-DZ')} DA / unité`
                    : 'Inclus'}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Quantité */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NAVY }}>
            Quantité
          </p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        {/* Total */}
        <div className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total estimé</p>
            <p className="text-xs text-gray-400 mt-0.5">{quantity} unités × {unitPrice.toLocaleString('fr-DZ')} DA</p>
          </div>
          <p className="font-black text-2xl" style={{ color: PURPLE }}>
            {totalPrice.toLocaleString('fr-DZ')}
            <span className="text-sm font-normal text-gray-400 ml-1">DA</span>
          </p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl
                       font-black text-base transition-all hover:bg-purple-50 border-2"
            style={{ borderColor: PURPLE, color: PURPLE }}>
            <ShoppingBag size={20} />
            Ajouter au panier
          </button>
          <button onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl
                       text-white font-black text-base transition-all hover:opacity-90 shadow-lg"
            style={{ background: PURPLE }}>
            <Zap size={20} />
            Commander maintenant
          </button>
        </div>

        {/* Livraison */}
        <div className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <span className="text-2xl">🚚</span>
          <div>
            <p className="font-bold text-sm" style={{ color: NAVY }}>Livraison dans toute l'Algérie</p>
            <p className="text-gray-500 text-xs mt-0.5">Paiement à la livraison · 2 à 5 jours ouvrables</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage