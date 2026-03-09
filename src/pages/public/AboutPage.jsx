import { Link } from 'react-router-dom'
import { Package, Truck, Shield, Star, MapPin, Phone } from 'lucide-react'

function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-light pt-16">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-charcoal py-24 px-6 text-center">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(75,32,56,0.6), rgba(34,22,16,0.9)),
              url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7mbrzcJIgPI4so6KZXOZrLt625iDsmVMNKbME08QxBZnctKkEtwLSA_NPMWbwFFlExJicldH3lQtemlzfC6Py94SqibdIAC7Vf2nu5nAcIpmIsVUTEoen7_svmTPCAhKw8COVf4swHtfMmCpYgQgjEK6WlkO8k2Wwhgz4kEJ6qNYMCxkWN33k5ECSbnzNe05dgxARO4FWu6NTHuc9Pa3mn_wqtXaLaZ6HqSD4kKJK4zDEoGpIacVMQk3tNO2y3n2YqexR2LJ8dFbg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-3 block">
            Human and Soulful
          </span>
          <h1 className="text-white text-4xl md:text-6xl font-black italic leading-tight mb-5">
            Qui sommes-nous ?
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            BrandPack, votre partenaire d'emballage en Algérie — cartons, sacs, autocollants et papier.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* ── Notre mission ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block">
              Notre mission
            </span>
            <h2 className="text-mauve text-3xl font-black italic mb-5 leading-snug">
              L'emballage au service de votre image
            </h2>
            <p className="text-text-soft leading-relaxed text-sm">
              Chez BrandPack, nous croyons que l'emballage est le premier contact de votre
              client avec votre marque. C'est pourquoi nous proposons des solutions
              d'emballage de qualité — cartons solides, sacs élégants, autocollants
              personnalisés et papiers créatifs — pour les professionnels et particuliers
              partout en Algérie.
            </p>
          </div>
          <div className="bg-mauve/10 rounded-2xl p-8 text-center border border-mauve/20 fairy-glow">
            <span className="text-7xl block mb-4">📦</span>
            <p className="text-mauve text-2xl font-black italic">
              L'emballage, c'est notre art
            </p>
          </div>
        </div>

        {/* ── Nos produits ── */}
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block text-center">
            Ce que nous vendons
          </span>
          <h2 className="text-mauve text-3xl font-black italic text-center mb-10">
            Nos catégories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '📦', label: 'Cartons',       desc: 'Cartons d\'emballage solides, toutes tailles' },
              { emoji: '🛍️', label: 'Sacs',          desc: 'Sacs kraft, plastique, luxe et personnalisés' },
              { emoji: '🏷️', label: 'Autocollants',  desc: 'Stickers sur-mesure pour votre marque' },
              { emoji: '📄', label: 'Papier',         desc: 'Papier kraft, calque, cadeau et d\'impression' },
            ].map(({ emoji, label, desc }) => (
              <div key={label}
                className="bg-charcoal rounded-2xl p-6 text-center border border-mauve/20
                           hover:shadow-fairy transition-all duration-300 hover:-translate-y-1">
                <span className="text-5xl block mb-4">{emoji}</span>
                <p className="text-white font-black italic text-base mb-2">{label}</p>
                <p className="text-gold/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Nos valeurs ── */}
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block text-center">
            Nos valeurs
          </span>
          <h2 className="text-mauve text-3xl font-black italic text-center mb-10">
            Ce qui nous définit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Package, title: 'Qualité',     desc: 'Des matériaux solides et durables pour protéger vos produits.' },
              { icon: Shield,  title: 'Fiabilité',   desc: 'Commandes traitées avec soin, emballages conformes à votre demande.' },
              { icon: Truck,   title: 'Livraison',   desc: 'Livraison dans les 58 wilayas d\'Algérie, rapidement.' },
              { icon: Star,    title: 'Sur-mesure',  desc: 'Personnalisation disponible : logo, couleur, taille selon vos besoins.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-charcoal rounded-2xl p-6 flex gap-4 border border-mauve/20
                           hover:shadow-fairy transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-mauve flex items-center
                                justify-center flex-shrink-0 shadow-fairy">
                  <Icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-white font-black italic text-lg mb-1">{title}</h3>
                  <p className="text-gold/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact / Localisation ── */}
        <div className="bg-mauve rounded-3xl p-8 md:p-12 text-center shadow-fairy">
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-3 block">
            Contactez-nous
          </span>
          <h2 className="text-white text-3xl font-black italic mb-6">
            Nous sommes en Algérie
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <div className="flex items-center gap-3 text-gold/80 text-sm justify-center">
              <MapPin size={16} className="text-gold" />
              <span>Livraison dans les 58 wilayas</span>
            </div>
            <div className="flex items-center gap-3 text-gold/80 text-sm justify-center">
              <Phone size={16} className="text-gold" />
              <span>Paiement à la livraison</span>
            </div>
          </div>
          <Link to="/products" className="bg-primary hover:bg-orange-600 text-white
                                          px-8 py-3 rounded-full font-bold transition-all
                                          hover:scale-105 shadow-dark inline-block">
            Découvrir la boutique
          </Link>
        </div>

      </div>

      {/* Spacer bottom nav */}
      <div className="h-24" />
    </div>
  )
}

export default AboutPage