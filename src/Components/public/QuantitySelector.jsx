import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const NAVY   = '#1e1b4b'
const PURPLE = '#7c3aed'

const QTY_OPTIONS = [100,200,300,400,500,600,700,800,900,1000,2000,3000]

function QuantitySelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Ferme en cliquant dehors
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = qty => { onChange(qty); setOpen(false) }

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
        <span>{value.toLocaleString('fr-DZ')} unités</span>
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: PURPLE }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
          style={{
            background: 'white',
            border: `2px solid rgba(124,58,237,0.2)`,
            boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
          }}>
          <div className="max-h-52 overflow-y-auto py-1">
            {QTY_OPTIONS.map(q => (
              <button key={q} type="button" onClick={() => select(q)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm
                           font-bold transition-all text-left"
                style={{
                  background: value === q ? 'rgba(124,58,237,0.08)' : 'transparent',
                  color: value === q ? PURPLE : NAVY,
                }}
                onMouseEnter={e => { if (value !== q) e.currentTarget.style.background = 'rgba(124,58,237,0.04)' }}
                onMouseLeave={e => { if (value !== q) e.currentTarget.style.background = 'transparent' }}>
                <span>{q.toLocaleString('fr-DZ')} unités</span>
                {value === q && <Check size={14} style={{ color: PURPLE }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuantitySelector