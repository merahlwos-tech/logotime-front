import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Upload, X, Loader2, Package, Search } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const NAVY   = '#1E0A4A'
const PURPLE = '#6C2BD9'
const GREEN  = '#10b981'

const CATEGORIES = [
  { value: 'Board',        label: 'Boites' },
  { value: 'Bags',         label: 'Sacs' },
  { value: 'Autocollants', label: 'Cartes' },
  { value: 'Paper',        label: 'Papier' },
  { value: 'Pack',         label: '🎁 Pack (العروض)' },
]

const DOUBLE_PRINT_CATS = ['Bags', 'Paper', 'Autocollants']

const PRESET_COLORS = [
  { hex: '#000000', fr: 'Noir',        ar: 'أسود' },
  { hex: '#FFFFFF', fr: 'Blanc',       ar: 'أبيض' },
  { hex: '#EF4444', fr: 'Rouge',       ar: 'أحمر' },
  { hex: '#3B82F6', fr: 'Bleu',        ar: 'أزرق' },
  { hex: '#22C55E', fr: 'Vert',        ar: 'أخضر' },
  { hex: '#EAB308', fr: 'Jaune',       ar: 'أصفر' },
  { hex: '#F97316', fr: 'Orange',      ar: 'برتقالي' },
  { hex: '#EC4899', fr: 'Rose',        ar: 'وردي' },
  { hex: '#A855F7', fr: 'Violet',      ar: 'بنفسجي' },
  { hex: '#92400E', fr: 'Marron',      ar: 'بني' },
  { hex: '#6B7280', fr: 'Gris',        ar: 'رمادي' },
  { hex: '#D97706', fr: 'Doré',        ar: 'ذهبي' },
  { hex: '#94A3B8', fr: 'Argenté',     ar: 'فضي' },
  { hex: '#1E3A8A', fr: 'Bleu marine', ar: 'أزرق داكن' },
  { hex: '#7F1D1D', fr: 'Bordeaux',    ar: 'بوردو' },
  { hex: '#0D9488', fr: 'Turquoise',   ar: 'تركوازي' },
  { hex: '#F5E6C8', fr: 'Beige',       ar: 'بيج' },
  { hex: '#8B5CF6', fr: 'Lavande',     ar: 'لافندر' },
]

const EMPTY = {
  name: '', category: 'Board',
  sizes: [{ size: '', price: '' }],
  colors: [],
  colorDesignEnabled: false, colorDesignPricePerColor: '', colorDesignMaxColors: '',
  doubleSided: false, doubleSidedPrice: '', images: [],
  packItems: [],
}

const inputCls = err =>
  `w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all
   ${err ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-[#6C2BD9] focus:ring-2 focus:ring-purple-100'}`

const fieldOrderAdmin = ['name', 'packItems', 'sizes', 'doubleSidedPrice', 'images']

// ── Pack Builder ──────────────────────────────────────────────────────────
function PackBuilder({ packItems, onChange, error }) {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const prods = (res.data || []).filter(p => p.category !== 'Pack')
        setAllProducts(prods)

        // Sync les prix actuels dans les packItems existants (en cas d'édition)
        if (packItems.length > 0) {
          const synced = packItems.map(item => {
            const prod = prods.find(p => p._id === item.productId)
            if (!prod) return item
            const sizeObj = prod.sizes?.find(s => s.size === item.size)
            if (sizeObj && sizeObj.price !== item.unitPrice) {
              return { ...item, unitPrice: sizeObj.price }
            }
            return item
          })
          const hasChange = synced.some((s, i) => s.unitPrice !== packItems[i].unitPrice)
          if (hasChange) onChange(synced)
        }
      })
      .catch(() => toast.error('Erreur chargement produits'))
      .finally(() => setLoading(false))
  }, [])

  const addItem = () => {
    onChange([...packItems, { productId: '', productName: '', size: '', quantity: 100, unitPrice: 0 }])
  }

  const removeItem = (i) => {
    onChange(packItems.filter((_, idx) => idx !== i))
  }

  const updateItem = (i, field, value) => {
    const updated = packItems.map((item, idx) => {
      if (idx !== i) return item
      const newItem = { ...item, [field]: value }

      if (field === 'productId') {
        const prod = allProducts.find(p => p._id === value)
        if (prod) {
          newItem.productName = prod.name
          // Auto-sélectionner la première taille
          if (prod.sizes?.length > 0) {
            newItem.size      = prod.sizes[0].size
            newItem.unitPrice = prod.sizes[0].price
          } else {
            newItem.size      = ''
            newItem.unitPrice = 0
          }
        }
      }

      if (field === 'size') {
        const prod = allProducts.find(p => p._id === item.productId)
        if (prod) {
          const sizeObj = prod.sizes?.find(s => s.size === value)
          newItem.unitPrice = sizeObj?.price ?? 0
        }
      }

      return newItem
    })
    onChange(updated)
  }

  const totalPackPrice = packItems.reduce((sum, item) => {
    return sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)
  }, 0)

  const filteredProducts = allProducts.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
      <Loader2 size={16} className="animate-spin" /> Chargement des produits...
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Résumé prix */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.3)' }}>
        <span className="text-sm font-bold" style={{ color: GREEN }}>
          💰 Prix total du pack
        </span>
        <span className="font-black text-xl" style={{ color: GREEN }}>
          {totalPackPrice.toLocaleString('fr-DZ')} DA
        </span>
      </div>

      {/* Recherche produit */}
      {allProducts.length > 8 && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-gray-200 text-sm outline-none focus:border-purple-400"
          />
        </div>
      )}

      {/* Liste des articles */}
      <div className="space-y-3">
        {packItems.map((item, i) => {
          const prod = allProducts.find(p => p._id === item.productId)
          return (
            <div key={i} className="rounded-2xl border-2 border-gray-200 p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Article {i + 1}
                </span>
                <button type="button" onClick={() => removeItem(i)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Sélection produit */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Produit</p>
                <select
                  value={item.productId}
                  onChange={e => updateItem(i, 'productId', e.target.value)}
                  className={inputCls(!item.productId && error)}
                >
                  <option value="">— Choisir un produit —</option>
                  {filteredProducts.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Taille */}
              {prod && prod.sizes?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Taille</p>
                  <select
                    value={item.size}
                    onChange={e => updateItem(i, 'size', e.target.value)}
                    className={inputCls(false)}
                  >
                    {prod.sizes.map(s => (
                      <option key={s.size} value={s.size}>
                        {s.size} — {s.price.toLocaleString('fr-DZ')} DA/unité
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantité + prix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Quantité</p>
                  <input
                    type="number" min="1"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)}
                    className={inputCls(!item.quantity && error)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Prix/unité (DA)</p>
                  <input
                    type="number" min="0"
                    value={item.unitPrice}
                    onChange={e => updateItem(i, 'unitPrice', e.target.value)}
                    className={inputCls(false)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Sous-total */}
              {item.productId && item.quantity > 0 && (
                <div className="text-right text-xs font-bold" style={{ color: GREEN }}>
                  Sous-total : {(Number(item.unitPrice) * Number(item.quantity)).toLocaleString('fr-DZ')} DA
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bouton ajouter article */}
      <button type="button" onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed text-sm font-bold transition-all hover:bg-green-50"
        style={{ borderColor: 'rgba(16,185,129,0.4)', color: GREEN }}>
        <Plus size={16} /> Ajouter un produit au pack
      </button>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

// ── Main Form ─────────────────────────────────────────────────────────────
function AdminProductForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData
  const [form, setForm] = useState(() => {
    if (!initialData) return EMPTY
    return {
      name: initialData.name || '',
      category: initialData.category || 'Board',
      sizes: initialData.sizes?.length > 0
        ? initialData.sizes.map(s => ({ size: String(s.size), price: String(s.price ?? '') }))
        : [{ size: '', price: '' }],
      colors: initialData.colors || [],
      colorDesignEnabled: initialData.colorDesignEnabled ?? false,
      colorDesignPricePerColor: initialData.colorDesignPricePerColor != null ? String(initialData.colorDesignPricePerColor) : '',
      colorDesignMaxColors: initialData.colorDesignMaxColors != null ? String(initialData.colorDesignMaxColors) : '',
      doubleSided: initialData.doubleSided ?? DOUBLE_PRINT_CATS.includes(initialData.category),
      doubleSidedPrice: String(initialData.doubleSidedPrice ?? ''),
      images: initialData.images || [],
      packItems: initialData.packItems || [],
    }
  })
  const [errors, setErrors]         = useState({})
  const [uploading, setUploading]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [dragOver, setDragOver]     = useState(false)
  const fieldRefs = useRef({})

  const isPack = form.category === 'Pack'

  useEffect(() => {
    if (!isPack) {
      setForm(p => ({ ...p, doubleSided: DOUBLE_PRINT_CATS.includes(p.category) }))
    }
  }, [form.category])

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); if (errors[key]) setErrors(p => ({ ...p, [key]: '' })) }

  const addSize    = () => setForm(p => ({ ...p, sizes: [...p.sizes, { size: '', price: '' }] }))
  const removeSize = i  => setForm(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }))
  const updateSize = (i, field, val) => setForm(p => ({ ...p, sizes: p.sizes.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }))

  const toggleColor = (hex) => setForm(p => ({
    ...p,
    colors: p.colors.includes(hex) ? p.colors.filter(c => c !== hex) : [...p.colors, hex],
  }))

  const uploadFiles = async files => {
    if (!files?.length) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('images', f))
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const urls = res.data.urls || res.data
      setForm(p => ({ ...p, images: [...p.images, ...(Array.isArray(urls) ? urls : [urls])] }))
      toast.success('Image(s) uploadée(s)')
    } catch { toast.error('Erreur upload') }
    finally { setUploading(false) }
  }

  const removeImage = async url => {
    setForm(p => ({ ...p, images: p.images.filter(i => i !== url) }))
    try {
      await api.delete('/upload', { data: { url } })
    } catch (err) {
      console.error('Erreur suppression R2:', err)
    }
  }

  // Calcul automatique du prix total du pack
  const packTotalPrice = form.packItems.reduce((sum, item) =>
    sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0), 0
  )

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis'

    if (isPack) {
      if (form.packItems.length === 0)
        e.packItems = 'Ajoutez au moins un produit au pack'
      else if (form.packItems.some(item => !item.productId || !item.quantity || Number(item.quantity) < 1))
        e.packItems = 'Chaque article doit avoir un produit et une quantité valide'
    } else {
      if (!form.sizes.every(s => s.size.trim() && !isNaN(Number(s.price)) && Number(s.price) > 0))
        e.sizes = 'Chaque taille doit avoir un nom et un prix valide'
      if (form.doubleSided && (!form.doubleSidedPrice || isNaN(Number(form.doubleSidedPrice))))
        e.doubleSidedPrice = 'Prix requis'
    }

    if (!isEditing && form.images.length === 0) e.images = 'Au moins une image requise'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = fieldOrderAdmin.find(k => errs[k])
      if (firstErr && fieldRefs.current[firstErr]) {
        fieldRefs.current[firstErr].scrollIntoView({ behavior: 'smooth', block: 'center' })
        const input = fieldRefs.current[firstErr].querySelector('input,select,textarea')
        if (input) setTimeout(() => input.focus(), 350)
      }
      return
    }
    setSaving(true)
    try {
      let payload

      if (isPack) {
        // Pour un pack : auto-calculer le prix et créer une "taille" unique
        const items = form.packItems.map(item => ({
          productId:   item.productId,
          productName: item.productName,
          size:        item.size,
          quantity:    Number(item.quantity),
          unitPrice:   Number(item.unitPrice),
        }))
        payload = {
          name:        form.name,
          category:    'Pack',
          sizes:       [{ size: 'Pack Complet', price: packTotalPrice }],
          images:      form.images,
          packItems:   items,
          freeDelivery: true,
          // Champs non applicables aux packs
          colors: [], colorDesignEnabled: false, doubleSided: false,
          colorDesignPricePerColor: 0, doubleSidedPrice: 0,
        }
      } else {
        payload = {
          name:     form.name,
          category: form.category,
          sizes:    form.sizes.filter(s => s.size.trim()).map(s => ({ size: s.size, price: Number(s.price) })),
          colors:   form.colors,
          images:   form.images,
          tags:     form.tags || [],
          colorDesignEnabled:       form.colorDesignEnabled,
          colorDesignPricePerColor: form.colorDesignEnabled && form.colorDesignPricePerColor !== '' ? Number(form.colorDesignPricePerColor) : 0,
          colorDesignMaxColors:     form.colorDesignEnabled && form.colorDesignMaxColors !== '' ? Number(form.colorDesignMaxColors) : null,
          doubleSided:      form.doubleSided,
          doubleSidedPrice: form.doubleSided ? Number(form.doubleSidedPrice) : 0,
          // NE PAS envoyer packItems pour les produits normaux
        }
      }

      if (isEditing) { await api.put(`/products/${initialData._id}`, payload); toast.success('Produit mis à jour') }
      else           { await api.post('/products', payload);                    toast.success('Produit créé') }
      onSuccess?.()
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur sauvegarde') }
    finally { setSaving(false) }
  }

  const labelCls = "block text-xs font-bold uppercase tracking-widest mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>

      {/* Nom */}
      <div ref={el => { if (el) fieldRefs.current['name'] = el }}>
        <label className={labelCls} style={{ color: NAVY }}>Nom du produit *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)}
          placeholder={isPack ? 'Ex: Pack Démarrage 100 Sacs + 50 Boites...' : 'Ex: Boite kraft personnalisée...'}
          className={inputCls(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Catégorie */}
      <div>
        <label className={labelCls} style={{ color: NAVY }}>Catégorie *</label>
        <select value={form.category} onChange={e => set('category', e.target.value)}
          className={inputCls(false)}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* ── Section Pack ── */}
      {isPack && (
        <>
          {/* Badge info */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.3)' }}>
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-sm font-black" style={{ color: GREEN }}>Livraison gratuite activée</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Tous les packs bénéficient automatiquement de la livraison gratuite
              </p>
            </div>
          </div>

          {/* Pack Builder */}
          <div ref={el => { if (el) fieldRefs.current['packItems'] = el }}>
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} style={{ color: GREEN }} />
              <label className={labelCls} style={{ color: NAVY, marginBottom: 0 }}>
                Composition du pack *
              </label>
            </div>
            <PackBuilder
              packItems={form.packItems}
              onChange={items => { set('packItems', items); setErrors(p => ({ ...p, packItems: '' })) }}
              error={errors.packItems}
            />
          </div>
        </>
      )}

      {/* ── Section Produit normal ── */}
      {!isPack && (
        <>
          {/* Tailles + Prix */}
          <div ref={el => { if (el) fieldRefs.current['sizes'] = el }}>
            <div className="flex items-center justify-between mb-3">
              <label className={labelCls} style={{ color: NAVY }}>Tailles & Prix *</label>
              <button type="button" onClick={addSize}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ background: PURPLE }}>
                <Plus size={13} /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 bg-gray-50 px-3 sm:px-4 py-3 rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Taille</p>
                    <input value={s.size} onChange={e => updateSize(i, 'size', e.target.value)}
                      placeholder="Ex: A4, 30×20..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm
                                 outline-none focus:border-purple-400 transition-all" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Prix (DA)</p>
                    <input type="number" min="0" value={s.price} onChange={e => updateSize(i, 'price', e.target.value)}
                      placeholder="1500"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm
                                 outline-none focus:border-purple-400 transition-all" />
                  </div>
                  <button type="button" onClick={() => removeSize(i)}
                    className="mt-5 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            {errors.sizes && <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>}
          </div>

          {/* Couleurs disponibles */}
          <div>
            <label className={labelCls} style={{ color: NAVY }}>
              Couleurs disponibles <span className="text-gray-400 font-normal" style={{ textTransform: 'none' }}>(optionnel)</span>
            </label>
            <div className="grid grid-cols-9 gap-2 p-3 rounded-xl border-2 border-gray-200 bg-gray-50">
              {PRESET_COLORS.map(({ hex, fr }) => {
                const selected = form.colors.includes(hex)
                const isWhite  = hex === '#FFFFFF'
                return (
                  <button key={hex} type="button" title={fr}
                    onClick={() => toggleColor(hex)}
                    className="relative flex flex-col items-center gap-1 group"
                  >
                    <div
                      className="w-8 h-8 rounded-full transition-all"
                      style={{
                        background: hex,
                        border: isWhite ? '2px solid #e5e7eb' : selected ? `3px solid ${PURPLE}` : '2px solid transparent',
                        boxShadow: selected ? `0 0 0 2px ${PURPLE}40` : 'none',
                        transform: selected ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7l3.5 3.5 5.5-6" stroke={isWhite ? '#6C2BD9' : 'white'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <span className="text-[9px] text-gray-400 text-center leading-tight max-w-[32px] truncate">{fr}</span>
                  </button>
                )
              })}
            </div>
            {form.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.colors.map(hex => {
                  const preset = PRESET_COLORS.find(p => p.hex === hex)
                  return (
                    <span key={hex} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      style={{ background: `${hex}20`, borderColor: hex === '#FFFFFF' ? '#e5e7eb' : hex, color: NAVY }}>
                      <span className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-200" style={{ background: hex }} />
                      {preset?.fr || hex}
                      <button type="button" onClick={() => toggleColor(hex)} className="opacity-60 hover:opacity-100 ml-0.5"><X size={10} /></button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Option : couleurs dans le design */}
          <div className="rounded-2xl border-2 p-4 transition-all"
            style={{ borderColor: form.colorDesignEnabled ? PURPLE : '#e5e7eb', background: form.colorDesignEnabled ? 'rgba(108,43,217,0.04)' : '#f9fafb' }}>
            <label className="flex items-center gap-3 cursor-pointer" onClick={() => set('colorDesignEnabled', !form.colorDesignEnabled)}>
              <div className="relative flex-shrink-0">
                <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.colorDesignEnabled ? PURPLE : '#d1d5db' }}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.colorDesignEnabled ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: NAVY }}>Couleurs dans le design</p>
                <p className="text-xs text-gray-400 mt-0.5">Le client saisit le nombre de couleurs — chaque couleur est facturée</p>
              </div>
            </label>
            {form.colorDesignEnabled && (
              <div className="mt-4 pt-4 grid grid-cols-2 gap-3" style={{ borderTop: '1px solid rgba(108,43,217,0.15)' }}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PURPLE }}>Prix par couleur (DA) *</label>
                  <input type="number" min="0" value={form.colorDesignPricePerColor}
                    onChange={e => set('colorDesignPricePerColor', e.target.value)}
                    placeholder="ex: 13" className={inputCls(false)} />
                  <p className="text-xs text-gray-400 mt-1">Ex: 13 DA → 3 couleurs = +39 DA/unité</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PURPLE }}>
                    Nb max <span className="text-gray-400 font-normal normal-case">(optionnel)</span>
                  </label>
                  <input type="number" min="1" max="20" value={form.colorDesignMaxColors}
                    onChange={e => set('colorDesignMaxColors', e.target.value)}
                    placeholder="ex: 5" className={inputCls(false)} />
                </div>
              </div>
            )}
          </div>

          {/* Double impression */}
          <div className="rounded-2xl border-2 p-4 transition-all"
            style={{ borderColor: form.doubleSided ? PURPLE : '#e5e7eb', background: form.doubleSided ? 'rgba(108,43,217,0.04)' : '#f9fafb' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative" onClick={() => set('doubleSided', !form.doubleSided)}>
                <div className="w-11 h-6 rounded-full transition-colors" style={{ background: form.doubleSided ? PURPLE : '#d1d5db' }}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.doubleSided ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: NAVY }}>Impression des deux côtés</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {DOUBLE_PRINT_CATS.includes(form.category) ? 'Pré-activé pour cette catégorie' : 'Option disponible'}
                </p>
              </div>
            </label>
            {form.doubleSided && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(108,43,217,0.15)' }}>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: PURPLE }}>Prix supplément (DA) *</label>
                <input type="number" min="0" value={form.doubleSidedPrice}
                  onChange={e => { set('doubleSidedPrice', e.target.value); setErrors(p => ({ ...p, doubleSidedPrice: '' })) }}
                  placeholder="500" className={inputCls(errors.doubleSidedPrice)} />
                {errors.doubleSidedPrice && <p className="text-red-500 text-xs mt-1">{errors.doubleSidedPrice}</p>}
              </div>
            )}
          </div>
        </>
      )}

      {/* Images */}
      <div ref={el => { if (el) fieldRefs.current['images'] = el }}>
        <label className={labelCls} style={{ color: NAVY }}>
          {isPack ? 'Image du pack' : 'Images'} {!isEditing && '*'}
        </label>
        <label className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed
                         rounded-2xl p-8 cursor-pointer transition-all
                         ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-gray-50 hover:border-purple-300'}
                         ${errors.images ? 'border-red-300 bg-red-50' : ''}
                         ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}>
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files)} />
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: dragOver ? PURPLE : '#e5e7eb' }}>
            {uploading ? <Loader2 size={24} className="animate-spin" style={{ color: PURPLE }} />
                       : <Upload size={24} style={{ color: dragOver ? 'white' : '#9ca3af' }} />}
          </div>
          <p className="text-sm font-semibold text-gray-600">
            {uploading ? 'Upload en cours...' : 'Glisser ou cliquer pour uploader'}
          </p>
        </label>
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={16} className="text-white" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving || uploading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3
                     rounded-xl text-white font-bold text-sm transition-all hover:opacity-90
                     disabled:opacity-50 shadow-lg"
          style={{ background: isPack ? GREEN : PURPLE }}>
          {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
        </button>
        {onCancel && (
          <button type="button" onClick={async () => {
            if (!isEditing) {
              await Promise.all(form.images.map(url =>
                api.delete('/upload', { data: { url } }).catch(() => {})
              ))
            } else {
              const originalImages = initialData.images || []
              const newImages = form.images.filter(url => !originalImages.includes(url))
              await Promise.all(newImages.map(url =>
                api.delete('/upload', { data: { url } }).catch(() => {})
              ))
            }
            onCancel()
          }}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-500
                       font-semibold text-sm hover:bg-gray-50 transition-all">
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default AdminProductForm