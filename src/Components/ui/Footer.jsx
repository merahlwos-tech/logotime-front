import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminSecretAccess() {
  const [clicks, setClicks] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3) { setShowInput(true); setClicks(0) }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    if (val.toLowerCase() === 'admin') {
      setShowInput(false); setValue(''); navigate('/admin/login')
    }
  }

  return (
    <div className="relative inline-block">
      <span onClick={handleClick} className="cursor-default select-none opacity-40">©</span>
      {showInput && (
        <input autoFocus type="text" value={value} onChange={handleChange}
          onBlur={() => { setShowInput(false); setValue(''); setClicks(0) }}
          className="absolute bottom-6 right-0 w-24 bg-mauve border border-gold/30
                     text-white text-xs px-2 py-1 rounded-lg outline-none shadow-fairy"
          placeholder="..." />
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-charcoal text-white/60 py-12 px-4 text-center border-t border-mauve/30">

      {/* Logo */}
      <div className="w-10 h-10 bg-mauve rounded-full flex items-center justify-center
                      shadow-fairy mx-auto mb-6 opacity-60">
        <span className="font-display text-gold text-lg font-black italic">B</span>
      </div>

      {/* Tagline */}
      <p className="text-sm mb-4 italic">Crafted with magic in Algeria</p>

      {/* Social icons */}
      <div className="flex justify-center gap-6 mb-8">
        <span className="text-gold/50 cursor-pointer text-xl hover:text-gold transition-colors">⚙</span>
        <span className="text-gold/50 cursor-pointer text-xl hover:text-gold transition-colors">✦</span>
        <span className="text-gold/50 cursor-pointer text-xl hover:text-gold transition-colors">🌐</span>
      </div>

      {/* Copyright */}
      <p className="text-[10px] tracking-widest uppercase opacity-40">
        <AdminSecretAccess /> 2024 BrandPack Enchanted Studio
      </p>
    </footer>
  )
}

export default Footer