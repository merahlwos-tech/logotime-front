import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, Shield, Star, MapPin, Phone } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'
import { useSEO } from '../../utils/UseSEO'

const NAVY        = '#1E0A4A'
const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const YELLOW      = '#FFD600'

const CONTENT = {
  fr: {
    hero_badge:    'Emballage sur mesure · Algérie',
    hero_title:    'Qui sommes-nous ?',
    hero_sub:      "Logo Time, votre partenaire d'emballage en Algérie — cartons, sacs, autocollants et papier.",
    mission_tag:   'Notre mission',
    mission_h2:    "L'emballage au service de votre image",
    mission_p:     "Chez Logo Time, nous croyons que l'emballage est le premier contact de votre client avec votre marque. C'est pourquoi nous proposons des solutions d'emballage de qualité — cartons solides, sacs élégants, autocollants personnalisés et papiers créatifs — pour les professionnels et particuliers partout en Algérie.",
    mission_quote: "L'emballage, c'est notre art",
    products_tag:  'Ce que nous vendons',
    products_h2:   'Nos catégories',
    products: [
      { emoji: '📦', label: 'Boites',       desc: "Boites d'emballage solides, toutes tailles" },
      { emoji: '🛍️', label: 'Sacs',          desc: 'Sacs kraft, plastique, luxe et personnalisés' },
      { emoji: '🏷️', label: 'Autocollants', desc: 'Stickers sur-mesure pour votre marque' },
      { emoji: '📄', label: 'Papier',        desc: "Papier kraft, calque, cadeau et d'impression" },
    ],
    values_tag: 'Nos valeurs',
    values_h2:  'Ce qui nous définit',
    values: [
      { icon: Package, title: 'Qualité',    desc: 'Des matériaux solides et durables pour protéger vos produits.' },
      { icon: Shield,  title: 'Fiabilité',  desc: 'Commandes traitées avec soin, emballages conformes à votre demande.' },
      { icon: Truck,   title: 'Livraison',  desc: "Livraison dans les 69 wilayas d'Algérie, rapidement." },
      { icon: Star,    title: 'Sur-mesure', desc: 'Personnalisation disponible : logo, couleur, taille selon vos besoins.' },
    ],
    contact_tag: 'Contactez-nous',
    contact_h2:  'Nous sommes en Algérie',
    contact_loc: 'Livraison dans les 69 wilayas',
    contact_pay: 'Paiement à la livraison',
    cta:         'Découvrir la boutique',
  },
  ar: {
    hero_badge:    'تغليف مخصص · الجزائر',
    hero_title:    'من نحن؟',
    hero_sub:      'لوقو تايم، شريككم في التغليف بالجزائر — كراتين، أكياس، ملصقات وورق.',
    mission_tag:   'مهمتنا',
    mission_h2:    'التغليف في خدمة صورتك',
    mission_p:     'في لوقو تايم، نؤمن بأن التغليف هو أول تواصل بين عميلك وعلامتك التجارية. لذلك نقدم حلول تغليف عالية الجودة — كراتين متينة، أكياس أنيقة، ملصقات مخصصة وأوراق إبداعية — للمهنيين والأفراد في كل أنحاء الجزائر.',
    mission_quote: 'التغليف هو فنّنا',
    products_tag:  'ما نبيعه',
    products_h2:   'فئاتنا',
    products: [
      { emoji: '📦', label: 'صناديق', desc: 'صناديق تغليف متينة بجميع المقاسات' },
      { emoji: '🛍️', label: 'أكياس',  desc: 'أكياس كرافت، بلاستيك، فاخرة ومخصصة' },
      { emoji: '🏷️', label: 'ملصقات',desc: 'ستيكرات مخصصة لعلامتك التجارية' },
      { emoji: '📄', label: 'ورق',     desc: 'ورق كرافت، شفاف، هدايا وطباعة' },
    ],
    values_tag: 'قيمنا',
    values_h2:  'ما يميّزنا',
    values: [
      { icon: Package, title: 'الجودة',    desc: 'مواد متينة وصلبة لحماية منتجاتك.' },
      { icon: Shield,  title: 'الموثوقية', desc: 'طلبات تُعالج بعناية، تغليف مطابق لطلبك.' },
      { icon: Truck,   title: 'التوصيل',   desc: 'توصيل إلى 69 ولاية جزائرية بسرعة.' },
      { icon: Star,    title: 'حسب الطلب', desc: 'تخصيص متاح: شعار، لون، مقاس حسب احتياجاتك.' },
    ],
    contact_tag: 'تواصل معنا',
    contact_h2:  'نحن في الجزائر',
    contact_loc: 'توصيل إلى 69 ولاية',
    contact_pay: 'الدفع عند الاستلام',
    cta:         'اكتشف المتجر',
  },
}

function AboutPage() {
  const { lang, isRTL } = useLang()
  const c       = CONTENT[lang] ?? CONTENT.fr
  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  /* ── Scroll to top on mount ── */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  useSEO({
    title: 'À propos — Logo Time',
    description: "Logo Time — votre partenaire en emballages personnalisés en Algérie. Boites, sacs, cartes, papier. Livraison dans les 69 wilayas.",
  })

  return (
    <div className={fontCls} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: '#F8F7FF', minHeight: '100dvh', paddingTop: 72 }}>

      {/* ══ HERO ══ */}
      <section style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${PURPLE} 60%, #8B45E8 100%)`,
        padding: '48px 24px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(255,214,0,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 220, height: 220, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,214,0,0.18)', border: '1px solid rgba(255,214,0,0.4)',
            color: YELLOW, fontSize: 11, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '5px 16px', borderRadius: 50, marginBottom: 24,
          }}>
            <Package size={12} />
            {c.hero_badge}
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            {c.hero_title}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            {c.hero_sub}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
            {[
              { val: '69',  label: lang === 'ar' ? 'ولاية' : 'Wilayas' },
              { val: '100%',label: lang === 'ar' ? 'مخصص' : 'Personnalisé' },
              { val: '2-5j', label: lang === 'ar' ? 'توصيل' : 'Livraison' },
            ].map(s => (
              <div key={s.val} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: YELLOW, lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* ══ MISSION ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center" style={{ marginBottom: 56 }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: PURPLE, display: 'block', marginBottom: 10 }}>
              {c.mission_tag}
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: NAVY, marginBottom: 16, lineHeight: 1.2 }}>
              {c.mission_h2}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5B5B7A' }}>
              {c.mission_p}
            </p>
          </div>

          <div style={{
            borderRadius: 20, padding: 36, textAlign: 'center',
            background: `linear-gradient(135deg, ${PURPLE} 0%, #8B45E8 100%)`,
            boxShadow: '0 8px 32px rgba(108,43,217,0.3)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
              background: YELLOW, color: PURPLE_DARK,
              padding: '6px 20px', borderRadius: 50,
              fontWeight: 800, fontSize: 13,
              whiteSpace: 'nowrap',
            }}>
              📦 Logo Time
            </div>
            <p style={{ fontSize: 56, marginBottom: 16, marginTop: 8 }}>📦</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'white', lineHeight: 1.3 }}>
              "{c.mission_quote}"
            </p>
          </div>
        </div>

        {/* ══ CATÉGORIES ══ */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: PURPLE, display: 'block', marginBottom: 8 }}>
              {c.products_tag}
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: PURPLE }}>
              {c.products_h2}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.products.map(({ emoji, label, desc }) => (
              <div key={label} style={{
                borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                background: 'white', boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                border: '2px solid rgba(255,214,0,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,43,217,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)' }}
              >
                <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>{emoji}</span>
                <p style={{ fontWeight: 800, fontSize: 14, color: NAVY, marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 11, color: '#6B6B8A', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ VALEURS ══ */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: PURPLE, display: 'block', marginBottom: 8 }}>
              {c.values_tag}
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: PURPLE }}>
              {c.values_h2}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {c.values.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{
                  borderRadius: 16, padding: '20px 24px',
                  background: 'white', boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                  border: '1px solid rgba(108,43,217,0.1)',
                  alignItems: 'flex-start',
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255,214,0,0.35)',
                }}>
                  <Icon size={22} color={PURPLE_DARK} />
                </div>
                <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: NAVY, marginBottom: 4 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6B6B8A', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CONTACT CTA ══ */}
        <div style={{
          borderRadius: 24, overflow: 'hidden',
          background: `linear-gradient(135deg, ${NAVY} 0%, ${PURPLE} 100%)`,
          padding: '48px 32px', textAlign: 'center',
          boxShadow: '0 8px 40px rgba(108,43,217,0.25)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(255,214,0,0.15) 0%, transparent 65%)', borderRadius: '50%' }} />

          <span style={{
            display: 'inline-block',
            background: 'rgba(255,214,0,0.2)', border: '1px solid rgba(255,214,0,0.4)',
            color: YELLOW, fontSize: 11, fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '5px 16px', borderRadius: 50, marginBottom: 20,
          }}>
            {c.contact_tag}
          </span>

          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: 'white', marginBottom: 20 }}>
            {c.contact_h2}
          </h2>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
              <MapPin size={16} color={YELLOW} />
              {c.contact_loc}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
              <Phone size={16} color={YELLOW} />
              {c.contact_pay}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 10,
                background: YELLOW, color: PURPLE_DARK,
                fontWeight: 800, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(255,214,0,0.4)',
              }}>
              {c.cta} →
            </Link>
            <a href="https://wa.me/213554691650" target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 10,
                background: '#25D366', color: 'white',
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
              }}>
              WhatsApp
            </a>
          </div>
        </div>

      </div>

      <div style={{ height: 40 }} />
    </div>
  )
}

export default AboutPage