import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const NAVY        = '#1E0A4A'
const PURPLE      = '#6C2BD9'
const YELLOW      = '#FFD600'
const PURPLE_DARK = '#4A1A9E'
const GREEN       = '#10b981'

const QTY_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000]

// Trouve le prix applicable pour une quantité donnée selon les paliers
export function getPriceForQty(basePrice, priceTiers, qty) {
  if (!priceTiers?.length) return basePrice
  // Trier par minQty croissant, prendre le dernier palier dont minQty <= qty
  const sorted = [...priceTiers].sort((a, b) => a.minQty - b.minQty)
  let applicable = basePrice
  for (const tier of sorted) {
    if (qty >= tier.minQty) applicable = tier.price
    else break
  }
  return applicable
}

function QuantitySelector({ value, onChange, basePrice, priceTiers, lang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const hasTiers = priceTiers?.length > 0

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = qty => { onChange(qty); setOpen(false) }

  const currentPrice = hasTiers ? getPriceForQty(basePrice, priceTiers, value) : null

  // Trouver quel palier est actif
  const activeTierIdx = hasTiers
    ? (() => {
        const sorted = [...priceTiers].sort((a, b) => a.minQty - b.minQty)
        let idx = -1
        for (let i = 0; i < sorted.length; i++) {
          if (value >= sorted[i].minQty) idx = i
        }
        return idx
      })()
    : -1

  return (
    <div ref={ref} className="relative w-full sm:inline-block sm:w-auto" style={{ minWidth: 0 }}>
      {/* Trigger */}
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                   border-2 text-sm font-bold transition-all"
        style={{
          borderColor: open ? PURPLE : 'rgba(124,58,237,0.3)',
          color: NAVY, background: 'white',
          boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
        }}>
        <span className="flex items-center gap-2">
          <span>{value.toLocaleString('fr-DZ')} {lang === 'ar' ? 'وحدة' : 'unités'}</span>
          {hasTiers && currentPrice != null && (
            <span className="text-xs font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', color: GREEN }}>
              {currentPrice.toLocaleString('fr-DZ')} DA/{lang === 'ar' ? 'و' : 'u'}
            </span>
          )}
        </span>
        <ChevronDown size={16} className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          style={{ color: YELLOW }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{
            background: 'white',
            border: `2px solid rgba(124,58,237,0.2)`,
            boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
            minWidth: hasTiers ? 220 : 160,
          }}>
          <div className="max-h-64 overflow-y-auto py-1">
            {QTY_OPTIONS.map(q => {
              const price = hasTiers ? getPriceForQty(basePrice, priceTiers, q) : null
              const isSelected = value === q
              // Détecter si ce palier est différent du précédent (= début d'un nouveau palier)
              const isTierStart = hasTiers && priceTiers.some(t => t.minQty === q)

              return (
                <div key={q}>
                  {/* Séparateur visuel au début de chaque palier */}
                  {isTierStart && (
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: GREEN, background: 'rgba(16,185,129,0.06)', borderTop: '1px solid rgba(16,185,129,0.15)' }}>
                      🏷️ {lang === 'ar' ? 'سعر جديد' : 'Nouveau prix'}
                    </div>
                  )}
                  <button type="button" onClick={() => select(q)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm
                               font-bold transition-all text-left"
                    style={{
                      background: isSelected ? 'rgba(124,58,237,0.08)' : 'transparent',
                      color: isSelected ? PURPLE : NAVY,
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(124,58,237,0.04)' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}>
                    <span>{q.toLocaleString('fr-DZ')} {lang === 'ar' ? 'وحدة' : 'unités'}</span>
                    <div className="flex items-center gap-2">
                      {hasTiers && price != null && (
                        <span className="text-xs font-black"
                          style={{ color: isSelected ? PURPLE : GREEN }}>
                          {price.toLocaleString('fr-DZ')} DA
                        </span>
                      )}
                      {isSelected && <Check size={14} style={{ color: YELLOW }} />}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuantitySelector