import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Instagram, Facebook, Heart, Truck, CreditCard } from 'lucide-react'

function AdminSecretAccess() {
  const [clicks, setClicks] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (val.toLowerCase() === 'admin') {
      setShowInput(false); setValue(''); navigate('/admin/login')
    }
  }

  return (
    <div className="relative inline-block">
      <span onClick={handleClick}
        className="text-gold/30 text-xs cursor-default select-none">©</span>
      {showInput && (
        <input autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-mauve border border-gold/30
                     text-white text-xs font-body px-2 py-1 rounded-lg outline-none
                     shadow-fairy"
          placeholder="..." />
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-charcoal mt-auto">

      {/* Bandeau avantages */}
      <div className="bg-mauve/30 border-y border-gold/20 py-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-mauve rounded-full flex items-center justify-center shadow-fairy">
              <Truck size={18} className="text-gold" />
            </div>
            <div>
              <p className="font-body font-bold text-white text-sm">Livraison rapide</p>
              <p className="font-body text-gold/60 text-xs">Dans toutes les wilayas</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-dark">
              <CreditCard size={18} className="text-white" />
            </div>
            <div>
              <p className="font-body font-bold text-white text-sm">Paiement à la livraison</p>
              <p className="font-body text-gold/60 text-xs">100% sécurisé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="overflow-hidden py-3 border-b border-mauve/30">
        <div className="whitespace-nowrap animate-marquee inline-block">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="inline-block mx-10 font-display text-gold/40 italic text-sm font-bold">
              Soft Family Store • Mode & Tendance • Bébé • Enfants • Femme • Homme •
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-mauve rounded-full flex items-center justify-center shadow-fairy">
                <span className="font-display text-gold text-base font-black italic">S</span>
              </div>
              <div>
                <p className="font-display text-white text-xl font-black italic">Soft Family Store</p>
              </div>
            </div>
            <p className="font-body text-gold/60 text-sm leading-relaxed max-w-xs mb-6">
              Mode douce et élégante pour toute la famille, du nouveau-né aux parents.
              Crafted with magic in Algeria ✨
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-mauve rounded-full flex items-center
                                    justify-center hover:bg-mauve-light transition-colors shadow-fairy">
                <Instagram size={16} className="text-gold" />
              </a>
              <a href="#" className="w-9 h-9 bg-mauve rounded-full flex items-center
                                    justify-center hover:bg-mauve-light transition-colors shadow-fairy">
                <Facebook size={16} className="text-gold" />
              </a>
            </div>
          </div>

          {/* Catégories */}
          <div>
            <p className="sf-label mb-4">Catégories</p>
            <ul className="space-y-2">
              {['Bébé', 'Enfants', 'Femme', 'Homme', 'Lingerie', 'Accessoires'].map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`}
                    className="font-body text-gold/60 text-sm hover:text-gold
                               transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infos */}
          <div>
            <p className="sf-label mb-4">Informations</p>
            <ul className="space-y-2">
              <li>
                <Link to="/about"
                  className="font-body text-gold/60 text-sm hover:text-gold transition-colors">
                  Qui sommes-nous
                </Link>
              </li>
              <li className="font-body text-gold/60 text-sm">Livraison 58 wilayas</li>
              <li className="font-body text-gold/60 text-sm">Retour sous 7 jours</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-mauve/30 flex items-center justify-between">
          <p className="font-body text-gold/30 text-xs flex items-center gap-1">
            <AdminSecretAccess />
            {' '}{new Date().getFullYear()} Soft Family Store. Fait avec{' '}
            <Heart size={10} className="text-primary fill-primary" /> en Algérie
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer