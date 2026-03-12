/**
 * metaPixel.js — Meta Pixel + Conversions API (double tracking avec déduplication)
 *
 * Architecture :
 *  1. On génère un event_id unique par événement
 *  2. Le Pixel navigateur envoie l'événement avec cet event_id  → côté client
 *  3. On appelle le backend /api/meta/event avec le même event_id → côté serveur (CAPI)
 *  Meta déduplique automatiquement grâce à l'event_id identique.
 *
 * Variables d'environnement requises :
 *  VITE_META_PIXEL_ID   → votre Pixel ID (ex: "123456789012345")
 *  VITE_API_URL         → URL de l'API backend
 */

const PIXEL_ID  = import.meta.env.VITE_META_PIXEL_ID || 'VOTRE_PIXEL_ID'
const API_BASE  = import.meta.env.VITE_API_URL        || 'http://localhost:5000/api'

/* ─────────────────────────────────────────────
   Génère un event_id unique (UUID v4 ou fallback)
───────────────────────────────────────────────*/
export function generateEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback : timestamp + random hex
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/* ─────────────────────────────────────────────
   Appel silencieux au backend CAPI (fire-and-forget)
   Ne bloque jamais l'UX en cas d'erreur réseau.
───────────────────────────────────────────────*/
async function sendCAPIEvent(eventName, eventId, payload = {}) {
  try {
    await fetch(`${API_BASE}/meta/event`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name:       eventName,
        event_id:         eventId,
        event_source_url: window.location.href,
        user_agent:       navigator.userAgent,
        ...payload,
      }),
    })
  } catch {
    // Silencieux — on ne bloque jamais l'UX pour le tracking
  }
}

/* ─────────────────────────────────────────────
   fbq() helper sécurisé
───────────────────────────────────────────────*/
function fbq(type, eventName, data = {}, options = {}) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq(type, eventName, data, options)
}

/* ════════════════════════════════════════════
   ÉVÉNEMENTS PUBLICS
════════════════════════════════════════════ */

/**
 * PageView — déclenché à chaque changement de route
 */
export function trackPageView() {
  const eventId = generateEventId()
  fbq('track', 'PageView', {}, { eventID: eventId })
  sendCAPIEvent('PageView', eventId)
}

/**
 * ViewContent — visite d'une fiche produit
 * @param {object} product  - objet produit complet
 * @param {number} price    - prix unitaire calculé (avec options)
 */
export function trackViewContent(product, price = 0) {
  const eventId = generateEventId()

  fbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids:  [product._id],
    content_type: 'product',
    value:        price,
    currency:     'DZD',
  }, { eventID: eventId })

  sendCAPIEvent('ViewContent', eventId, {
    content_ids:  [product._id],
    content_name: product.name,
    content_type: 'product',
    value:        price,
    currency:     'DZD',
  })
}

/**
 * AddToCart — ajout au panier
 * @param {object} product
 * @param {string} size
 * @param {number} quantity
 * @param {number} unitPrice  - prix unitaire (taille + options)
 */
export function trackAddToCart(product, size, quantity, unitPrice) {
  const eventId    = generateEventId()
  const totalValue = unitPrice * quantity

  fbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids:  [product._id],
    content_type: 'product',
    value:        totalValue,
    currency:     'DZD',
    contents:     [{ id: product._id, quantity, item_price: unitPrice }],
  }, { eventID: eventId })

  sendCAPIEvent('AddToCart', eventId, {
    content_ids:  [product._id],
    content_name: product.name,
    content_type: 'product',
    value:        totalValue,
    currency:     'DZD',
    num_items:    quantity,
  })
}

/**
 * InitiateCheckout — ouverture du formulaire de commande
 * @param {Array}  items  - items du panier
 * @param {number} total  - total panier
 */
export function trackInitiateCheckout(items, total) {
  const eventId  = generateEventId()
  const numItems = items.reduce((s, i) => s + i.quantity, 0)

  fbq('track', 'InitiateCheckout', {
    content_ids:  items.map(i => i.productId),
    contents:     items.map(i => ({ id: i.productId, quantity: i.quantity })),
    num_items:    numItems,
    value:        total,
    currency:     'DZD',
  }, { eventID: eventId })

  sendCAPIEvent('InitiateCheckout', eventId, {
    content_ids: items.map(i => i.productId),
    num_items:   numItems,
    value:       total,
    currency:    'DZD',
  })
}

/**
 * Purchase — commande confirmée (côté Pixel uniquement)
 * Le CAPI Purchase est déclenché directement par le backend /api/orders
 * avec les données utilisateur complètes (phone, nom, wilaya…) pour
 * maximiser le matching. On passe l'event_id en paramètre pour la déduplication.
 *
 * @param {Array}  items
 * @param {number} total
 * @returns {string} eventId — à transmettre au backend avec la commande
 */
export function trackPurchase(items, total) {
  const eventId  = generateEventId()
  const numItems = items.reduce((s, i) => s + i.quantity, 0)

  // Meta Pixel (navigateur) n'accepte pas DZD pour Purchase
  // Les vraies valeurs DZD sont envoyées par le CAPI serveur
  fbq('track', 'Purchase', {
    content_ids:  items.map(i => i.productId),
    contents:     items.map(i => ({ id: i.productId, quantity: i.quantity })),
    num_items:    numItems,
    value:        0,
    currency:     'USD',
  }, { eventID: eventId })

  return eventId
}

/* ══════════════════════════════════════════════════════════════
   HIGH INTENT EVENTS — Signaux de qualité pour l'algorithme Meta
   
   Ces événements "chauffent" le Pixel plus vite en lui donnant
   des signaux comportementaux au-delà du simple Purchase.
   Côté Pixel uniquement (pas de CAPI) — ces signaux n'ont pas
   besoin de déduplication car ils ne représentent pas de conversion.
══════════════════════════════════════════════════════════════ */

/**
 * HighQualityVisitor — visiteur resté +30s sur la fiche produit
 * Signal : "cet utilisateur s'intéresse vraiment au produit"
 * @param {string} productId
 * @param {string} productName
 */
export function trackHighQualityVisitor(productId, productName) {
  if (typeof fbq === 'undefined') return
  fbq('trackCustom', 'HighQualityVisitor', {
    content_ids:  [productId],
    content_name: productName,
    note:         'Stayed more than 30s on product page',
  })
}

/**
 * ScrollToForm — visiteur scrollé jusqu'au formulaire de commande
 * Signal fort : "il a lu la page ET cherché le formulaire"
 * @param {string} productId
 * @param {string} productName
 */
export function trackScrollToForm(productId, productName) {
  if (typeof fbq === 'undefined') return
  fbq('trackCustom', 'ScrollToForm', {
    content_ids:  [productId],
    content_name: productName,
    note:         'Scrolled to checkout form section',
  })
}

/**
 * FormEngagement — visiteur a commencé à remplir le formulaire
 * Signal très fort : "il est en train de passer commande"
 * Déclenché sur le focus du premier champ (prénom)
 */
export function trackFormEngagement() {
  if (typeof fbq === 'undefined') return
  fbq('trackCustom', 'FormEngagement', {
    note: 'Started filling checkout form',
  })
}