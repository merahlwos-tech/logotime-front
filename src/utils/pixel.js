// src/utils/pixel.js
// Utilitaire centralisé Meta Pixel — remplacez VOTRE_PIXEL_ID par votre vrai ID

export const PIXEL_ID = 'VOTRE_PIXEL_ID'

/* ── Initialisation (appelée une seule fois dans main.jsx) ── */
export function initPixel() {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('init', PIXEL_ID)
}

/* ── PageView ── */
export function trackPageView() {
  if (!window.fbq) return
  window.fbq('track', 'PageView')
}

/* ── ViewContent (fiche produit) ── */
export function trackViewContent(product) {
  if (!window.fbq) return
  window.fbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [product._id],
    content_type: 'product',
    value: product.price,
    currency: 'DZD',
  })
}

/* ── AddToCart ── */
export function trackAddToCart(product, size, quantity) {
  if (!window.fbq) return
  window.fbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [product._id],
    content_type: 'product',
    value: product.price * quantity,
    currency: 'DZD',
    contents: [{ id: product._id, quantity, size }],
  })
}

/* ── InitiateCheckout (page panier) ── */
export function trackInitiateCheckout(items, total) {
  if (!window.fbq) return
  window.fbq('track', 'InitiateCheckout', {
    content_ids: items.map((i) => i.productId),
    contents: items.map((i) => ({ id: i.productId, quantity: i.quantity })),
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    value: total,
    currency: 'DZD',
  })
}

/* ── Purchase (commande confirmée) ── */
export function trackPurchase(items, total) {
  if (!window.fbq) return
  window.fbq('track', 'Purchase', {
    content_ids: items.map((i) => i.productId),
    contents: items.map((i) => ({ id: i.productId, quantity: i.quantity })),
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    value: total,
    currency: 'DZD',
  })
}