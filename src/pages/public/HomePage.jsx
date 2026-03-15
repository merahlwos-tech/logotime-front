import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { useSEO } from '../../utils/UseSEO'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const PURPLE_DEEP = '#1E0A4A'
const YELLOW      = '#FFD600'

/* ─── Données ─── */
const CAT_IMAGES = [
  { label_fr: 'Boites',                  label_ar: 'صناديق',        cat: 'Board',        image: '/boite.webp',  desc_fr: 'Boîtes rigides & luxe',         desc_ar: 'صناديق صلبة وفاخرة' },
  { label_fr: 'Sacs',                    label_ar: 'أكياس',          cat: 'Bags',         image: '/sacs.webp',   desc_fr: 'Sacs shopping brandés',          desc_ar: 'أكياس تسوق مخصصة' },
  { label_fr: 'Cartes et Autocollants',  label_ar: 'بطاقات وملصقات', cat: 'Autocollants', image: '/carte.webp',  desc_fr: 'Étiquettes & sceaux custom',     desc_ar: 'بطاقات وملصقات مخصصة' },
  { label_fr: 'Papier',                  label_ar: 'ورق',            cat: 'Paper',        image: '/papier.webp', desc_fr: 'Papier de soie & emballage',     desc_ar: 'ورق التغليف والحرير' },
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
  { q: "Quelle est la quantité minimale (MOQ) ?",      a: "La quantité minimale varie selon le produit. En général, elle commence à 50 unités pour les sacs et 100 unités pour les boîtes. Contactez-nous pour un devis personnalisé." },
  { q: "Livraison partout en Algérie ?",               a: "Oui ! Nous livrons dans les 58 wilayas via nos partenaires logistiques. Délai : 2 à 5 jours ouvrables selon votre région." },
  { q: "Quel est le mode de paiement accepté ?",       a: "Paiement à la livraison (cash). Les clients qui paient à l'avance sont prioritaires sur les commandes." },
  { q: "Puis-je commander des emballages personnalisés ?", a: "Oui ! Nos produits peuvent être personnalisés avec votre logo. Commandez directement sur le site et nous ferons de votre emballage une véritable œuvre d'art." },
]
const FAQS_AR = [
  { q: 'ما هو الحد الأدنى للطلب (MOQ)؟',      a: 'يتفاوت الحد الأدنى حسب المنتج. بشكل عام يبدأ من 50 وحدة للأكياس و100 وحدة للصناديق. تواصل معنا للحصول على عرض أسعار مخصص.' },
  { q: 'هل تُوصّلون لكل الجزائر؟',            a: 'نعم! نوصّل لـ 58 ولاية عبر شركاء اللوجستيك. المدة: 2 إلى 5 أيام عمل.' },
  { q: 'ما طريقة الدفع المقبولة؟',             a: 'الدفع عند الاستلام. الأولوية في الطلبيات لمن يدفع مسبقاً.' },
  { q: 'هل يمكنني طلب تغليف مخصص بشعاري؟',   a: 'نعم! يمكن تخصيص منتجاتنا بشعارك الخاص. اطلب منتجك في الموقع وسنجعل تغليفك تحفة فنية.' },
]

const WHY_FR = [
  { icon: '⚡', title: 'Livraison rapide',        desc: 'Expédition sous 48h partout en Algérie' },
  { icon: '📦', title: 'Qualité professionnelle', desc: 'Matériaux premium, finitions soignées' },
  { icon: '💰', title: 'Prix grossiste',           desc: 'Tarifs dégressifs dès 50 unités' },
]
const WHY_AR = [
  { icon: '⚡', title: 'توصيل سريع',     desc: 'شحن خلال 48 ساعة إلى جميع أنحاء الجزائر' },
  { icon: '📦', title: 'جودة احترافية', desc: 'مواد فاخرة وتشطيبات عالية الجودة' },
  { icon: '💰', title: 'أسعار الجملة',  desc: 'أسعار تنازلية من 50 وحدة' },
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
        <span style={{ fontSize: 13, fontWeight: 600, color: PURPLE_DEEP, fontFamily: 'inherit' }}>{q}</span>
        <span style={{
          color: PURPLE, fontSize: 22, flexShrink: 0,
          transition: 'transform 0.3s',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid #F0EEF9' }}>
          <p style={{ fontSize: 13, color: '#6B6B8A', lineHeight: 1.6, paddingTop: 12 }}>{a}</p>
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
      style={{ background: '#F8F7FF', minHeight: '100dvh', paddingTop: 72 }}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(160deg, ${PURPLE_DEEP} 0%, ${PURPLE} 60%, #8B45E8 100%)`,
        padding: '36px 24px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Déco cercles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(255,214,0,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -40,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="animate-fade-up" style={{
          display: 'inline-block',
          background: 'rgba(255,214,0,0.18)',
          border: '1px solid rgba(255,214,0,0.4)',
          color: YELLOW,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '5px 14px', borderRadius: 50,
          marginBottom: 20,
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
            : <>Solutions d'emballage<br /><span style={{ color: YELLOW }}>rapides &amp; pro.</span></>}
        </h1>

        <p className="animate-fade-up" style={{
          color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6,
          maxWidth: 280, marginBottom: 28, position: 'relative', zIndex: 1,
          animationDelay: '0.2s',
        }}>
          {lang === 'ar'
            ? 'التغليف الذي يعكس علامتك التجارية. مصنوع في الجزائر، يُوصَّل في كل مكان.'
            : "L'emballage qui reflète votre marque. Produit en Algérie, livré partout."}
        </p>

        {/* Hero image */}
        <div className="animate-fade-up" style={{
          width: '100%', borderRadius: 16, overflow: 'hidden',
          marginBottom: 28, boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          position: 'relative', zIndex: 1, animationDelay: '0.25s',
        }}>
          <img
            src="/mainPC.webp"
            alt="Emballage premium Logo Time"
            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.src = '/main.webp' }}
          />
        </div>

        <button
          className="animate-fade-up btn-yellow"
          onClick={() => navigate('/products')}
          style={{ animationDelay: '0.3s' }}
        >
          {lang === 'ar' ? 'اطلب الآن' : 'Commander maintenant'}
          <span style={{ fontSize: 18 }}>→</span>
        </button>
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
              {lang === 'ar' ? 'من 500 وحدة مشتراة' : 'À partir de 500 unités achetées'}
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
            500 u.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          CATÉGORIES
      ══════════════════════════════════ */}
      <section style={{ padding: '28px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: PURPLE_DEEP }}>
              {lang === 'ar' ? 'الفئات' : 'Catégories'}
            </h2>
            <p style={{ fontSize: 12, color: '#6B6B8A', marginTop: 2 }}>
              {lang === 'ar' ? 'حلول مخصصة لعلامتك التجارية' : 'Solutions sur mesure pour votre marque'}
            </p>
          </div>
          <Link to="/products" style={{ fontSize: 13, fontWeight: 600, color: PURPLE, textDecoration: 'none' }}>
            {lang === 'ar' ? 'عرض الكل' : 'Voir tout'}
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CAT_IMAGES.map(({ label_fr, label_ar, cat, image, desc_fr, desc_ar }) => {
            const label = lang === 'ar' ? label_ar : label_fr
            const desc  = lang === 'ar' ? desc_ar  : desc_fr
            return (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  position: 'relative', height: 224,
                  borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,43,217,0.22)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)' }}
                >
                  <img src={image} alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isRTL
                      ? 'linear-gradient(270deg, rgba(30,10,74,0.85) 0%, rgba(108,43,217,0.4) 60%, transparent 100%)'
                      : 'linear-gradient(90deg, rgba(30,10,74,0.85) 0%, rgba(108,43,217,0.4) 60%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    padding: 20,
                  }}>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{label}</h4>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{desc}</p>
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
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 6 }}>
            {lang === 'ar' ? 'لماذا تختارنا؟' : 'Pourquoi nous choisir ?'}
          </h3>
          <div style={{ width: 40, height: 4, background: YELLOW, borderRadius: 2, margin: '0 auto 24px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{w.title}</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          AVANT / APRÈS
      ══════════════════════════════════ */}
      <div style={{ padding: '0 20px 28px' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: PURPLE_DEEP, marginBottom: 6 }}>
          {lang === 'ar' ? 'قبل / بعد' : 'Avant / Après'}
        </h3>
        <p style={{ fontSize: 13, color: '#6B6B8A', marginBottom: 20 }}>
          {lang === 'ar' ? 'اروا الفرق الذي يصنعه التغليف الجيد' : 'Voyez la différence que fait un bon emballage'}
        </p>
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          background: 'white', position: 'relative',
        }}>
          <div style={{ display: 'flex', height: 200 }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img src="/before.webp" alt="Avant"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(80%) brightness(0.7)' }}
                onError={e => { e.target.src = '/boite.webp'; e.target.style.filter = 'grayscale(80%) brightness(0.7)' }}
              />
              <span style={{
                position: 'absolute', bottom: 10, left: 10,
                fontSize: 11, fontWeight: 700,
                padding: '4px 12px', borderRadius: 50,
                textTransform: 'uppercase', letterSpacing: '0.8px',
                background: 'rgba(0,0,0,0.5)', color: 'white',
              }}>
                {lang === 'ar' ? 'قبل' : 'Avant'}
              </span>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img src="/after.webp" alt="Après"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.src = '/sacs.webp' }}
              />
              <span style={{
                position: 'absolute', bottom: 10, right: 10,
                fontSize: 11, fontWeight: 700,
                padding: '4px 12px', borderRadius: 50,
                textTransform: 'uppercase', letterSpacing: '0.8px',
                background: YELLOW, color: PURPLE_DARK,
              }}>
                {lang === 'ar' ? 'بعد ✓' : 'Après ✓'}
              </span>
            </div>
            {/* Séparateur */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              width: 3, height: '100%',
              background: 'white', transform: 'translateX(-50%)', zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 32, height: 32,
                background: 'white', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: PURPLE, fontWeight: 800,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}>↔</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          COMMENT COMMANDER
      ══════════════════════════════════ */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{
          background: 'white', borderRadius: 24,
          padding: '28px 20px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: PURPLE_DEEP, textAlign: 'center', marginBottom: 6 }}>
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
                    background: PURPLE, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 20, fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(108,43,217,0.3)',
                  }}>
                    {n}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: PURPLE_DEEP, marginBottom: 4 }}>{title}</h4>
                    <p style={{ fontSize: 13, color: '#6B6B8A', lineHeight: 1.5 }}>{desc}</p>
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
        <h3 style={{ fontSize: 20, fontWeight: 800, color: PURPLE_DEEP, marginBottom: 20 }}>
          {lang === 'ar' ? 'الأسئلة الشائعة' : 'Questions fréquentes'}
        </h3>
        {faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
      </div>

    </div>
  )
}

export default HomePage