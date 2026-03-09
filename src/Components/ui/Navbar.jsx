import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function Navbar() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                     p-4 border-b border-mauve/10 transition-all duration-300
                     ${scrolled
                       ? 'bg-bg-light/95 backdrop-blur-md shadow-dark'
                       : 'bg-bg-light/90 backdrop-blur-md'}`}>

      {/* Logo */}
      <Link to="/" className="flex items-center w-12 h-12 shrink-0">
        <div className="w-10 h-10 bg-mauve rounded-full flex items-center justify-center shadow-fairy">
          <span className="font-display text-gold text-lg font-black italic">B</span>
        </div>
      </Link>

      {/* Titre centré */}
      <Link to="/"
        className="text-mauve text-xl font-bold leading-tight tracking-tight flex-1
                   text-center italic hover:text-mauve-light transition-colors">
        BrandPack
      </Link>

      {/* Panier */}
      <div className="flex w-12 items-center justify-end">
        <button
          onClick={() => navigate('/cart')}
          className="relative flex items-center justify-center rounded-full h-10 w-10
                     hover:bg-mauve/10 text-mauve transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white
                             text-[10px] font-bold flex items-center justify-center
                             rounded-full shadow-dark">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar