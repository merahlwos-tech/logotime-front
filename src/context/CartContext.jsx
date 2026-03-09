// src/contexts/CartContext.jsx
// Contexte global du panier avec persistance localStorage

import { createContext, useContext, useReducer, useEffect } from 'react'
import { trackAddToCart } from '../utils/pixel'

const CartContext = createContext(null)

// Actions
const ACTIONS = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
  UPDATE_QTY: 'UPDATE_QUANTITY',
  CLEAR: 'CLEAR_CART',
  LOAD: 'LOAD_CART',
}

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD:
      return action.payload

    case ACTIONS.ADD: {
      const { product, size, quantity } = action.payload
      // Clé unique par produit + pointure
      const key = `${product._id}-${size}`
      const existing = state.find((item) => item.key === key)
      if (existing) {
        return state.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [
        ...state,
        {
          key,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          quantity,
          maxStock: product.sizes?.find((s) => s.size === size)?.stock || quantity,
        },
      ]
    }

    case ACTIONS.REMOVE:
      return state.filter((item) => item.key !== action.payload)

    case ACTIONS.UPDATE_QTY:
      return state.map((item) =>
        item.key === action.payload.key
          ? { ...item, quantity: Math.max(1, Math.min(item.maxStock, action.payload.quantity)) }
          : item
      )

    case ACTIONS.CLEAR:
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  // Chargement depuis localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) {
        dispatch({ type: ACTIONS.LOAD, payload: JSON.parse(stored) })
      }
    } catch {
      console.warn('Panier localStorage invalide')
    }
  }, [])

  // Sauvegarde dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Calcul du total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product, size, quantity = 1) => {
    dispatch({ type: ACTIONS.ADD, payload: { product, size, quantity } })
    // ── Meta Pixel : AddToCart ──
    trackAddToCart(product, size, quantity)
  }

  const removeFromCart = (key) => {
    dispatch({ type: ACTIONS.REMOVE, payload: key })
  }

  const updateQuantity = (key, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QTY, payload: { key, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR })
  }

  return (
    <CartContext.Provider
      value={{ items, total, itemCount, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartContext