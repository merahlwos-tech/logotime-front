import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { useSEO } from '../../utils/UseSEO'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const PURPLE_DEEP = '#1E0A4A'
const YELLOW      = '#FFD600'

/* ─── Données ─── */
const CAT_IMAGES = [
  { label_fr: 'Boites',                  label_ar: 'علب',        cat: 'Board',        image: '/boite.webp',  imagePC: '/boitePC.webp',  desc_fr: 'Boîtes rigides & luxe',      desc_ar: 'علب صلبة وفاخرة' },
  { label_fr: 'Sacs',                    label_ar: 'أكياس',          cat: 'Bags',         image: '/sacs.webp',   imagePC: '/sacsPC.webp',   desc_fr: 'Sacs shopping brandés',       desc_ar: 'أكياس تسوق مخصصة' },
  { label_fr: 'Cartes et Autocollants',  label_ar: 'بطاقات وملصقات', cat: 'Autocollants', image: '/carte.webp',  imagePC: '/cartePC.webp',  desc_fr: 'Étiquettes & sceaux custom',  desc_ar: 'بطاقات وملصقات مخصصة' },
  { label_fr: 'Papier',                  label_ar: 'ورق',            cat: 'Paper',        image: '/papier.webp', imagePC: '/papierPC.webp', desc_fr: 'Papier de soie & emballage',  desc_ar: 'ورق التغليف والحرير' },
  { label_fr: 'Packs',                   label_ar: 'العروض',          cat: 'Pack',         image: '/main.webp',   imagePC: '/mainPC.webp',   desc_fr: 'Packs tout-en-un · livraison gratuite', desc_ar: 'عروض شاملة · توصيل مجاني', isPack: true },
]

const STEPS_FR = [
  { n: '1', title: 'Choisissez votre produit',   desc: "Parcourez nos catégories et choisissez le produit qui correspond à vos besoins, puis précisez la taille et la quantité." },
  { n: '2', title: 'Personnalisez votre design', desc: "Téléchargez votre propre fichier de conception et choisissez le nombre de couleurs ainsi que les autres options d'impression." },
  { n: '3', title: 'Soumettez votre demande',    desc: "Ajoutez le produit à votre panier, renseignez vos informations de livraison et confirmez votre commande. On s'occupe du reste !" },
]
const STEPS_AR = [
  { n: '1', title: 'اختر منتجك',   desc: 'تصفّح فئاتنا واختر المنتج الذي يناسب احتياجاتك، ثم حدّد الحجم والكمية.' },
  { n: '2', title: 'خصّص تصميمك', desc: 'ارفع ملف تصميمك الخاص واختر عدد الألوان وخيارات الطباعة الأخرى.' },
  { n: '3', title: 'قدّم طلبك',   desc: 'أضف المنتج إلى سلتك، أدخل معلومات التوصيل وأكّد طلبك. نحن نتكفل بالباقي!' },
]

const FAQS_FR = [
  { q: "Quelle est la qualité de votre impression ?",      a: "Oui, bien sûr ! Nous sommes une société d'impression qui offre une qualité d'impression parmi les meilleures du marché. Votre choix de travailler avec nous rendra votre emballage vraiment unique." },
  { q: "Livrez-vous dans toute l'Algérie ?",               a: "Oui, nous livrons dans les 69 wilayas. Le délai est généralement de 2 à 5 jours ouvrables." },
  { q: "Quel est le mode de paiement accepté ?",           a: "Paiement à la livraison (cash). Les clients qui paient à l'avance sont prioritaires sur les commandes." },
  { q: "Puis-je commander des emballages personnalisés ?", a: "Oui ! Nos produits peuvent être personnalisés avec votre logo. Commandez directement sur le site et nous ferons de votre emballage une véritable œuvre d'art." },
  { q: "Comment suivre ma commande ?",                     a: "Notre équipe vous contacte par téléphone après confirmation pour vous informer de la livraison." },
]
const FAQS_AR = [
  { q: 'ما هي جودة طباعتكم؟',                  a: 'نعم بالتأكيد! نحن شركة طباعة نوفر جودة طباعة ممتازة من بين الأفضل في السوق. اختيارك للعمل معنا سيجعل تغليفك مميزاً حقاً.' },
  { q: 'هل تُوصّلون لكل الجزائر؟',             a: 'نعم، نوصّل لـ 69 ولاية. المدة عادةً من 2 إلى 5 أيام عمل.' },
  { q: 'ما طريقة الدفع المقبولة؟',              a: 'الدفع عند الاستلام (نقداً). الأولوية في الطلبيات لمن يدفع مسبقاً.' },
  { q: 'هل يمكنني طلب تغليف مخصص بشعاري؟',    a: 'نعم! يمكن تخصيص منتجاتنا بشعارك الخاص. اطلب منتجك في الموقع وسنجعل تغليفك تحفة فنية.' },
  { q: 'كيف أتابع طلبي؟',                       a: 'يتصل بك فريقنا هاتفياً بعد التأكيد لإعلامك بموعد التسليم.' },
]

const WHY_FR = [
  { icon: '🚀', title: "Les plus rapides du marché",  desc: "Livraison en 2 à 5 jours ouvrables partout en Algérie. Les délais les plus courts du secteur." },
  { icon: '💎', title: "Qualité & meilleurs prix",    desc: "Matériaux premium, finitions soignées, aux tarifs les plus compétitifs du marché." },
  { icon: '🤝', title: "Une marque de confiance",     desc: "Des centaines de clients satisfaits à travers toute l'Algérie nous font confiance chaque jour." },
]
const WHY_AR = [
  { icon: '🚀', title: 'الأسرع في السوق',          desc: 'توصيل خلال 2 إلى 5 أيام عمل في كل أنحاء الجزائر.' },
  { icon: '💎', title: 'جودة بأفضل الأسعار',        desc: 'مواد فاخرة وتشطيبات راقية بأسعار لا تُنافَس في السوق.' },
  { icon: '🤝', title: 'علامة تجارية موثوقة',       desc: 'مئات العملاء الراضين من كل أنحاء الجزائر يثقون بنا يومياً.' },
]
/* ─── FAQ Item ─── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'white', borderRadius: 10,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      marginBottom: 10, overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 18px', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left',
        }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1E0A4A', fontFamily: 'inherit' }}>{q}</span>
        <span style={{
          color: PURPLE, fontSize: 22, flexShrink: 0,
          transition: 'transform 0.3s',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid #F0EEF9' }}>
          <p style={{ fontSize: 13, color: '#5B5B7A', lineHeight: 1.6, paddingTop: 12 }}>{a}</p>
        </div>
      )}
    </div>
  )
}


/* ─── Before / After — deux photos côte à côte, effet au hover ─── */
function BeforeAfterSlider({ lang }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>

      {/* ── AVANT ── */}
      <div style={{ position: 'relative', flex: 1, borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.25s', cursor: 'default' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 0 0 3px #ef4444, 0 8px 32px #ef444455'
          e.currentTarget.querySelector('.before-overlay').style.background = 'rgba(220,38,38,0.45)'
          e.currentTarget.querySelector('.before-icon').style.opacity = '1'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
          e.currentTarget.querySelector('.before-overlay').style.background = 'transparent'
          e.currentTarget.querySelector('.before-icon').style.opacity = '0'
        }}
      >
        <img src="/before.webp" alt="Avant" draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'filter 0.3s' }}
          onError={e => { e.target.src = '/boite.webp' }}
        />
        <div className="before-overlay" style={{ position: 'absolute', inset: 0, background: 'transparent', transition: 'background 0.3s', pointerEvents: 'none' }} />
        <div className="before-icon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <span style={{ fontSize: 72, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>❌</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 14px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>❌</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.6)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'قبل' : 'Avant'}
          </span>
        </div>
      </div>

      {/* ── APRÈS ── */}
      <div style={{ position: 'relative', flex: 1, borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transition: 'transform 0.25s', cursor: 'default' }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 0 0 3px #10b981, 0 8px 32px #10b98155'
          e.currentTarget.querySelector('.after-overlay').style.background = 'rgba(16,185,129,0.35)'
          e.currentTarget.querySelector('.after-icon').style.opacity = '1'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
          e.currentTarget.querySelector('.after-overlay').style.background = 'transparent'
          e.currentTarget.querySelector('.after-icon').style.opacity = '0'
        }}
      >
        <img src="/after.webp" alt="Après" draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'filter 0.3s' }}
          onError={e => { e.target.src = '/sacs.webp' }}
        />
        <div className="after-overlay" style={{ position: 'absolute', inset: 0, background: 'transparent', transition: 'background 0.3s', pointerEvents: 'none' }} />
        <div className="after-icon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <span style={{ fontSize: 72, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>✅</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 14px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.6)', letterSpacing: '0.5px' }}>
            {lang === 'ar' ? 'بعد' : 'Après'}
          </span>
        </div>
      </div>

    </div>
  )
}


const API = import.meta.env.VITE_API_URL || ''

/* ─── Retours clients ─── */
function ClientReviews({ lang }) {
  const [photos, setPhotos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${API}/github/reviews`)
      .then(r => r.json())
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading || photos.length === 0) return null

  return (
    <div style={{ padding: '0 20px 48px' }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', marginBottom: 20 }}>
        {lang === 'ar' ? 'عملاؤنا :' : 'Nos clients :'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {photos.slice(0, 4).map((photo, i) => (
          <div key={i}
            onClick={() => setSelected(photo)}
            style={{
              borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
              aspectRatio: '1/1', background: '#f3f4f6',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,43,217,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <img src={photo.url} alt={`retour client ${i+1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        ))}
      </div>


      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <img src={selected.url} alt="retour client"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          />
          <button onClick={() => setSelected(null)}
            style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

function HomePage() {
  const { lang, isRTL } = useLang()
  const navigate        = useNavigate()

  useSEO({
    title: 'Logo Time — Emballage Premium Algérien | Boites, Sacs, Cartes, Papier',
    description: "Logo Time — Emballages sur mesure pour votre business en Algérie. Boites, sacs, autocollants, papier d'emballage. Livraison dans les 58 wilayas.",
  })

  const steps = lang === 'ar' ? STEPS_AR : STEPS_FR
  const faqs  = lang === 'ar' ? FAQS_AR  : FAQS_FR
  const why   = lang === 'ar' ? WHY_AR   : WHY_FR
  const fontCls = lang === 'ar' ? 'font-arabic' : ''

  return (
    <div className={fontCls} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'transparent', minHeight: '100dvh', paddingTop: 72 }}>

      {/* ══════════════════════════════════
          HERO — Mobile + Desktop
      ══════════════════════════════════ */}

      {/* ── DESKTOP HERO ── */}
      <section className="hidden md:block" style={{
        background: `linear-gradient(135deg, #2d1a6e 0%, #6C2BD9 45%, #a0359e 75%, #c23b8a 100%)`,
        backgroundImage: `
          radial-gradient(ellipse at 0% 0%, rgba(90,60,190,0.85) 0%, transparent 55%),
          radial-gradient(ellipse at 100% 0%, rgba(210,60,140,0.7) 0%, transparent 50%),
          linear-gradient(135deg, #2d1a6e 0%, #6C2BD9 45%, #a0359e 75%, #c23b8a 100%)
        `,
        position: 'relative', overflow: 'hidden', minHeight: 520,
      }}>
        {/* Déco */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,214,0,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 60px', display: 'flex', alignItems: 'center', gap: 48, position: 'relative', zIndex: 1 }}
          dir={isRTL ? 'rtl' : 'ltr'}>

          {/* Texte gauche */}
          <div style={{ flex: '0 0 48%', minWidth: 0, maxWidth: '48%' }}>
            <div className="animate-fade-up" style={{
              display: 'inline-block',
              background: 'rgba(255,214,0,0.18)', border: '1px solid rgba(255,214,0,0.4)',
              color: YELLOW, fontSize: 11, fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 50, marginBottom: 24,
            }}>
              {lang === 'ar' ? '✦ تغليف فاخر' : '✦ Emballage Premium'}
            </div>

            <h1 className="animate-fade-up" style={{
              fontSize: 'clamp(28px, 3.2vw, 42px)', fontWeight: 900, lineHeight: 1.15,
              color: 'white', marginBottom: 20, animationDelay: '0.1s',
            }}>
              {lang === 'ar'
                ? <>{`حلول تغليف `}<br /><span style={{ color: YELLOW }}>سريعة واحترافية</span></>
                : <>Solutions<br />d'emballage<br /><span style={{ color: YELLOW }}>rapides & pro.</span></>}
            </h1>

            <p className="animate-fade-up" style={{
              color: 'rgba(255,255,255,0.72)', fontSize: 16, lineHeight: 1.7,
              maxWidth: 360, marginBottom: 36, animationDelay: '0.2s',
            }}>
              {lang === 'ar'
                ? 'التغليف الذي يعكس علامتك التجارية. مصنوع في الجزائر، يُوصَّل في كل مكان.'
                : "L'emballage qui reflète votre marque. Produit en Algérie, livré partout."}
            </p>

            <div className="animate-fade-up" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animationDelay: '0.3s' }}>
              <a href={`https://wa.me/213772793771`} target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                  background: '#25D366', color: '#1E0A4A', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                }}>
                WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="animate-fade-up" style={{
              display: 'flex', gap: 40, marginTop: 48, paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.15)',
              animationDelay: '0.4s',
            }}>
              {[
                { val: '69',   label: lang === 'ar' ? 'ولاية' : 'Wilayas' },
                { val: '100%', label: lang === 'ar' ? 'جودة ممتازة' : 'Qualité premium' },
                { val: '2-5j',  label: lang === 'ar' ? 'توصيل' : 'Livraison' },
              ].map(s => (
                <div key={s.val} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: YELLOW, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image droite */}
          <div style={{ flex: '0 0 48%', minWidth: 0, maxWidth: '48%' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', aspectRatio: '4/3' }}>
              <img src="/mainPC.webp" alt="Emballage premium Logo Time"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = '/main.webp' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE HERO ── */}
      <section className="block md:hidden" style={{
        background: 'linear-gradient(135deg, #2d1a6e 0%, #6C2BD9 45%, #a0359e 75%, #c23b8a 100%)',
        padding: '36px 24px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,214,0,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div className="animate-fade-up" style={{
          display: 'inline-block',
          background: 'rgba(255,214,0,0.18)', border: '1px solid rgba(255,214,0,0.4)',
          color: YELLOW, fontSize: 11, fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '5px 14px', borderRadius: 50, marginBottom: 20,
        }}>
          {lang === 'ar' ? '✦ تغليف فاخر' : '✦ Emballage Premium'}
        </div>

        <h1 className="animate-fade-up" style={{
          fontSize: 'clamp(28px, 8vw, 36px)', fontWeight: 900, lineHeight: 1.15,
          color: 'white', marginBottom: 14, position: 'relative', zIndex: 1,
          animationDelay: '0.1s',
        }}>
          {lang === 'ar'
            ? <>{`حلول تغليف `}<span style={{ color: YELLOW }}>سريعة واحترافية</span></>
            : <>Solutions d'emballage<br /><span style={{ color: YELLOW }}>rapides & pro.</span></>}
        </h1>

        <p className="animate-fade-up" style={{
          color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6,
          maxWidth: 280, marginBottom: 28, position: 'relative', zIndex: 1,
          animationDelay: '0.2s',
        }}>
          {lang === 'ar'
            ? 'التغليف الذي يعكس علامتك التجارية. مصنوع في الجزائر، يُوصَّل في كل مكان.'
            : "L'emballage qui reflète votre marque. Produit en Algérie, livré partout."}
        </p>

        <div className="animate-fade-up" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, boxShadow: '0 16px 40px rgba(0,0,0,0.3)', animationDelay: '0.25s' }}>
          <img src="/mainPC.webp" alt="Emballage premium Logo Time"
            style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.src = '/main.webp' }}
          />
        </div>


      </section>

      {/* ══════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════ */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFD600 0%, #FFC400 100%)',
          borderRadius: 16, padding: '22px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120,
            background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
          }} />
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 900, color: PURPLE_DARK }}>
              {lang === 'ar' ? 'توصيل مجاني!' : 'Livraison gratuite !'}
            </h4>
            <p style={{ fontSize: 12, color: PURPLE_DARK, opacity: 0.75, marginTop: 3 }}>
              {lang === 'ar' ? 'من 400 وحدة مشتراة' : 'À partir de 400 unités achetées'}
            </p>
          </div>
          <div style={{
            background: PURPLE, color: 'white',
            fontSize: 22, fontWeight: 900,
            padding: '12px 16px', borderRadius: 12,
            flexShrink: 0, textAlign: 'center',
            lineHeight: 1.2, zIndex: 1,
          }}>
            <small style={{ fontSize: 11, fontWeight: 600, display: 'block', opacity: 0.8 }}>
              {lang === 'ar' ? 'من' : 'dès'}
            </small>
            {lang === 'ar' ? '400 وحدة' : '400 unités'}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          CATÉGORIES
      ══════════════════════════════════ */}
      {/* ── CATÉGORIES MOBILE ── */}
      <section id="categories-section" className="block md:hidden" style={{ padding: '28px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A' }}>
              {lang === 'ar' ? 'الفئات' : 'Catégories'}
            </h2>
            <p style={{ fontSize: 12, color: '#6B6B8A', marginTop: 2 }}>
              {lang === 'ar' ? 'حلول مخصصة لعلامتك التجارية' : 'Solutions sur mesure pour votre marque'}
            </p>
          </div>

        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CAT_IMAGES.map(({ label_fr, label_ar, cat, image, desc_fr, desc_ar, isPack }) => {
            const label = lang === 'ar' ? label_ar : label_fr
            const desc  = lang === 'ar' ? desc_ar  : desc_fr
            return (
              <Link key={cat} to={`/products?category=${cat}`} style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative', height: 160, borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                  boxShadow: isPack ? '0 4px 20px rgba(16,185,129,0.25)' : '0 2px 16px rgba(0,0,0,0.08)',
                  border: isPack ? '2px solid rgba(16,185,129,0.5)' : '2px solid transparent',
                }}>
                  <img src={image} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14,
                    background: isPack ? 'linear-gradient(to top, rgba(4,60,40,0.75) 0%, transparent 60%)' : 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
                  }}>
                    {isPack && (
                      <span style={{ alignSelf: 'flex-start', background: '#10b981', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 50, marginBottom: 6, letterSpacing: '0.5px' }}>
                        🚚 {lang === 'ar' ? 'توصيل مجاني' : 'Livraison gratuite'}
                      </span>
                    )}
                    <h4 style={{ fontSize: 17, fontWeight: 800, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{label}</h4>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── CATÉGORIES DESKTOP ── */}
      <section id="categories-section" className="hidden md:block" style={{ padding: '48px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1E0A4A' }}>
              {lang === 'ar' ? 'الفئات' : 'Nos catégories'}
            </h2>
            <p style={{ fontSize: 14, color: '#6B6B8A', marginTop: 4 }}>
              {lang === 'ar' ? 'حلول مخصصة لعلامتك التجارية' : 'Solutions sur mesure pour votre marque'}
            </p>
          </div>

        </div>

        {/* Grille desktop : 4 colonnes pour les catégories, Pack centré sur 2 colonnes en dessous */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>

          {/* Ligne 1 — 4 catégories normales */}
          {CAT_IMAGES.filter(c => !c.isPack).map(({ label_fr, label_ar, cat, image, imagePC, desc_fr, desc_ar }) => {
            const label = lang === 'ar' ? label_ar : label_fr
            const desc  = lang === 'ar' ? desc_ar  : desc_fr
            return (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ textDecoration: 'none', display: 'block', height: 380 }}>
                <div
                  style={{ position: 'relative', height: '100%', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(108,43,217,0.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)' }}
                >
                  <img src={imagePC || image} alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                    onError={e => { e.target.onerror = null; e.target.src = image }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = ''}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,5,50,0.75) 0%, rgba(20,5,50,0.1) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 6 }}>{label}</h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}

          {/* Ligne 2 — Pack centré sur 2 colonnes (colonnes 2 et 3 sur 4) */}
          {CAT_IMAGES.filter(c => c.isPack).map(({ label_fr, label_ar, cat, image, imagePC, desc_fr, desc_ar }) => {
            const label = lang === 'ar' ? label_ar : label_fr
            const desc  = lang === 'ar' ? desc_ar  : desc_fr
            return (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ textDecoration: 'none', display: 'block', height: 260, gridColumn: '2 / 4' }}>
                <div
                  style={{ position: 'relative', height: '100%', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 4px 24px rgba(16,185,129,0.2)', border: '2px solid rgba(16,185,129,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(16,185,129,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(16,185,129,0.2)' }}
                >
                  <img src={imagePC || image} alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                    onError={e => { e.target.onerror = null; e.target.src = image }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = ''}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,60,40,0.82) 0%, rgba(4,60,40,0.1) 55%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 28, alignItems: 'center', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', background: '#10b981', color: 'white', fontSize: 12, fontWeight: 800, padding: '5px 16px', borderRadius: 50, marginBottom: 12, letterSpacing: '0.5px' }}>
                      🚚 {lang === 'ar' ? 'توصيل مجاني' : 'Livraison gratuite'}
                    </span>
                    <h4 style={{ fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>
                      🎁 {label}
                    </h4>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════
          POURQUOI NOUS
      ══════════════════════════════════ */}
      <div style={{ padding: '28px 20px 24px' }}>
        <div style={{
          background: PURPLE, borderRadius: 24,
          padding: '28px 20px',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', textAlign: 'center', marginBottom: 6 }}>
            {lang === 'ar' ? 'لماذا تختارنا؟' : 'Pourquoi nous choisir ?'}
          </h3>
          <div style={{ width: 40, height: 4, background: YELLOW, borderRadius: 2, margin: '0 auto 24px' }} />
          <div className="grid md:grid-cols-3 gap-4">
            {why.map((w, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: 18,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 50, height: 50, flexShrink: 0,
                  background: YELLOW, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                }}>
                  {w.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E0A4A', marginBottom: 3 }}>{w.title}</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          AVANT / APRÈS SLIDER
      ══════════════════════════════════ */}
      <div style={{ padding: '28px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', marginBottom: 6 }}>
          {lang === 'ar' ? 'لماذا التغليف مهم؟' : 'Pourquoi un emballage ?'}
        </h3>
        <BeforeAfterSlider lang={lang} />
      </div>

      {/* ══════════════════════════════════
          COMMENT COMMANDER
      ══════════════════════════════════ */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{
          background: 'white', borderRadius: 24,
          padding: '28px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', textAlign: 'center', marginBottom: 6 }}>
            {lang === 'ar' ? 'كيف تطلب؟' : 'Comment commander ?'}
          </h3>
          <div style={{ width: 40, height: 4, background: YELLOW, borderRadius: 2, margin: '0 auto 24px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map(({ n, title, desc }, i) => (
              <div key={n}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16,
                  flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: YELLOW, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: PURPLE_DARK, fontSize: 20, fontWeight: 900,
                    boxShadow: '0 4px 12px rgba(255,214,0,0.4)',
                    flexShrink: 0,
                  }}>
                    {n}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E0A4A', marginBottom: 4 }}>{title}</h4>
                    <p style={{ fontSize: 13, color: '#5B5B7A', lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: 2, height: 24,
                    background: 'rgba(108,43,217,0.15)',
                    margin: '8px 0 8px 23px',
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <button className="btn-yellow" onClick={() => navigate('/products')}>
              {lang === 'ar' ? 'ابدأ طلبي' : 'Démarrer ma commande'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <div style={{ padding: '0 20px 40px' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1E0A4A', marginBottom: 20 }}>
          {lang === 'ar' ? 'الأسئلة الشائعة' : 'Questions fréquentes'}
        </h3>
        {faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
      </div>

      {/* ══════════════════════════════════
          RETOURS CLIENTS
      ══════════════════════════════════ */}
      <ClientReviews lang={lang} />

    </div>
  )
}

export default HomePage