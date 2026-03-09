import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import api from '../../utils/api'
import ProductGrid from '../../Components/public/ProductGrid'

const CATEGORIES = [
  { label: 'Bébé',         emoji: '👶', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80' },
  { label: 'Enfants',      emoji: '🧒', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80' },
  { label: 'Femme',        emoji: '👗', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
  { label: 'Homme',        emoji: '👔', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&q=80' },
  { label: 'Lingerie',     emoji: '🌸', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80' },
  { label: 'Accessoires',  emoji: '👜', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
]

const STEPS = [
  { n: '1', title: 'Choisissez', desc: 'Sélectionnez vos articles dans notre boutique mode.' },
  { n: '2', title: 'Commandez', desc: 'Remplissez vos infos de livraison en quelques secondes.' },
  { n: '3', title: 'Recevez', desc: 'Notre équipe vous livre partout en Algérie.' },
]

const TESTIMONIALS = [
  { name: 'Sara B.',  text: 'Qualité exceptionnelle pour les vêtements bébé, très doux et bien coupés.', stars: 5 },
  { name: 'Nadia K.', text: 'Livraison rapide, emballage soigné. Les vêtements correspondent aux photos.', stars: 5 },
  { name: 'Meriem A.',text: "Super boutique ! J'ai commandé pour toute la famille, tout le monde est ravi.", stars: 5 },
]

function HomePage() {
  const [products, setProducts]         = useState([])
  const [babyProducts, setBabyProducts] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        const all = res.data || []
        setProducts(all.slice(0, 8))
        setBabyProducts(all.filter((p) => p.category === 'Bébé').slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-bg-light">

      {/* ── Hero ── */}
      <header className="px-4 pt-20 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-charcoal aspect-[16/9] md:aspect-[21/9]
                        flex items-center justify-center">
          {/* Background image + overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(75,32,56,0.5), rgba(34,22,16,0.85)),
                                url('/hero-family.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Sparkle */}
          <div className="absolute top-6 right-8 text-gold/40 animate-pulse text-4xl select-none">
            ✨
          </div>
          <div className="absolute bottom-8 left-8 text-gold/20 animate-pulse text-2xl select-none"
            style={{ animationDelay: '1s' }}>✦</div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 animate-fade-up">
              Heritage Meets Magic
            </span>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-4 italic animate-fade-up"
              style={{ animationDelay: '100ms' }}>
              Mode pour toute<br />la famille ✨
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed animate-fade-up"
              style={{ animationDelay: '200ms' }}>
              Des vêtements doux, élégants et confortables.
              Livrés partout en Algérie, paiement à la livraison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: '300ms' }}>
              <Link to="/products" className="btn-primary">
                Découvrir la collection <ArrowRight size={16} />
              </Link>
              <Link to="/products?category=Bébé" className="btn-gold">
                Collection bébé 👶
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 animate-fade-up" style={{ animationDelay: '400ms' }}>
              {[
                { val: '500+', label: 'Clients satisfaits' },
                { val: '58',   label: 'Wilayas livrées' },
                { val: '100%', label: 'Paiement livraison' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-gold text-2xl font-black">{val}</p>
                  <p className="font-body text-white/50 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Catégories ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="sf-label mb-3">Collections</p>
          <h2 className="font-display text-mauve text-4xl md:text-5xl font-black italic">
            Enchanted Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, image }, i) => (
            <Link key={label} to={`/products?category=${label}`}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl
                              fairy-glow transition-transform duration-500 group-hover:-translate-y-2">
                <img src={image} alt={label}
                  className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-mauve/80 to-transparent
                                flex items-end p-4">
                  <p className="text-white text-base font-black italic tracking-wide">{label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Steps — The Path of Creation ── */}
      <section className="bg-mauve/5 py-16 px-4 my-4">
        <div className="max-w-4xl mx-auto scroll-texture border-y-8 border-mauve/20
                        rounded-3xl p-8 md:p-12 shadow-inner relative">
          {/* Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-mauve text-gold
                          px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest
                          shadow-fairy whitespace-nowrap">
            Le chemin de la commande
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-center relative z-10 pt-4">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-mauve text-white flex items-center
                                justify-center mb-4 text-2xl font-black shadow-fairy">
                  {n}
                </div>
                <h3 className="text-mauve font-black text-lg mb-2 italic">{title}</h3>
                <p className="text-mauve/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection Naissance ── */}
      {babyProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="sf-label mb-3">💝 Idées cadeaux</p>
              <h2 className="font-display text-mauve text-4xl md:text-5xl font-black italic">
                Collection Naissance
              </h2>
              <p className="font-body text-text-soft mt-2 text-sm">
                Des pièces douces et délicates pour accueillir bébé
              </p>
            </div>
            <Link to="/products?category=Bébé"
              className="hidden sm:flex items-center gap-2 font-body text-primary
                         text-sm font-bold hover:text-mauve transition-colors group">
              Voir tout
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductGrid products={babyProducts} loading={loading} />
        </section>
      )}

      {/* ── Featured — "Each piece tells a story" ── */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-0 items-center
                        bg-bg-light rounded-3xl overflow-hidden border border-mauve/10
                        shadow-dark">
          <div className="w-full md:w-1/2">
            <img src="/hero-family.jpg" alt="Notre équipe"
              className="w-full h-[360px] object-cover" />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <span className="sf-label mb-4 block">Humain & Authentique</span>
            <h2 className="text-3xl font-black text-mauve italic leading-snug mb-6">
              Chaque article raconte une histoire de famille et d'élégance.
            </h2>
            <p className="text-text-soft mb-8 leading-relaxed text-sm">
              Nous croyons que les vêtements doivent porter l'âme de ceux qui les portent.
              Du nouveau-né aux parents, chaque pièce est choisie avec amour.
            </p>
            <Link to="/about"
              className="text-mauve font-black border-b-2 border-gold pb-1
                         hover:text-primary transition-colors inline-flex items-center gap-2">
              Notre histoire ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ── Nouveautés ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="sf-label mb-3">Sélection</p>
            <h2 className="font-display text-mauve text-4xl md:text-5xl font-black italic">
              Dernières nouveautés
            </h2>
          </div>
          <Link to="/products"
            className="hidden sm:flex items-center gap-2 font-body text-primary
                       text-sm font-bold hover:text-mauve transition-colors group">
            Voir tout
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={products} loading={loading} />
      </section>

      {/* ── Looks & Idées cadeaux ── */}
      <section className="bg-mauve/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="sf-label mb-3">Inspirations</p>
            <h2 className="font-display text-mauve text-4xl md:text-5xl font-black italic">
              Looks & Idées cadeaux
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Look Bébé Printemps', desc: 'Body + Salopette + Chaussons', emoji: '🌸', tag: 'look-bebe-printemps' },
              { title: 'Look Femme Casual',   desc: 'Haut + Pantalon + Sac',        emoji: '🌿', tag: 'look-femme-casual' },
              { title: 'Idées de cadeaux',    desc: 'Sélection spéciale cadeaux',   emoji: '🎁', tag: 'idees-de-cadeaux' },
            ].map(({ title, desc, emoji, tag }, i) => (
              <Link key={title} to={`/tag/${tag}`}
                className="bg-charcoal rounded-2xl p-8 text-center border border-mauve/20
                           hover:shadow-fairy transition-all duration-300 hover:-translate-y-1
                           animate-fade-up block group"
                style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-6xl block mb-6">{emoji}</span>
                <h3 className="font-display text-white text-xl font-black italic mb-2">{title}</h3>
                <p className="font-body text-gold/60 text-sm mb-6">{desc}</p>
                <span className="inline-flex items-center gap-2 bg-primary text-white
                                 font-bold rounded-full px-6 py-2.5 text-sm
                                 group-hover:bg-orange-600 transition-colors">
                  Découvrir <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avis clients ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="sf-label mb-3">Témoignages</p>
          <h2 className="font-display text-mauve text-4xl md:text-5xl font-black italic">
            Nos clients adorent
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, text, stars }, i) => (
            <div key={name}
              className="bg-charcoal rounded-2xl p-6 shadow-dark hover:shadow-fairy
                         transition-all duration-300 animate-fade-up border border-mauve/20"
              style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="font-body text-gold/70 text-sm leading-relaxed mb-4 italic">
                "{text}"
              </p>
              <p className="font-body font-bold text-white text-sm">— {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-mauve py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-white text-4xl md:text-5xl font-black italic mb-4">
            Toute la famille habillée 👨‍👩‍👧‍👦
          </p>
          <p className="font-body text-gold/70 mb-8 text-sm">
            Livraison dans les 58 wilayas · Paiement à la livraison
          </p>
          <Link to="/products" className="btn-primary">
            Découvrir tous les articles <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Spacer pour bottom nav mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}

export default HomePage