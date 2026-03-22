import { useState, useEffect, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle, RefreshCw, Image, Monitor, Smartphone } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || ''

const PURPLE      = '#6C2BD9'
const API = import.meta.env.VITE_API_URL || ''

const PURPLE_DARK = '#4A1A9E'
const NAVY        = '#1E0A4A'
const YELLOW      = '#FFD600'

const GROUPS = [
  {
    title: 'Hero',
    icon: '🖼️',
    subsections: [
      {
        label: 'Mobile',
        icon: <Smartphone size={14} />,
        color: '#8B5CF6',
        items: [
          { key: 'main', label: 'Hero Mobile', hint: '800 × 600 px', ratio: '4:3', format: 'WebP', maxKb: 250 },
        ],
      },
      {
        label: 'Desktop (PC)',
        icon: <Monitor size={14} />,
        color: '#6C2BD9',
        items: [
          { key: 'mainPC', label: 'Hero Desktop', hint: '1280 × 640 px', ratio: '2:1', format: 'WebP', maxKb: 300 },
        ],
      },
    ],
  },
  {
    title: 'Catégories',
    icon: '🗂️',
    subsections: [
      {
        label: 'Mobile',
        icon: <Smartphone size={14} />,
        color: '#8B5CF6',
        items: [
          { key: 'boite',  label: 'Boites',  hint: '800 × 320 px', ratio: '5:2', format: 'WebP', maxKb: 200 },
          { key: 'sacs',   label: 'Sacs',    hint: '800 × 320 px', ratio: '5:2', format: 'WebP', maxKb: 200 },
          { key: 'carte',  label: 'Cartes',  hint: '800 × 320 px', ratio: '5:2', format: 'WebP', maxKb: 200 },
          { key: 'papier', label: 'Papier',  hint: '800 × 320 px', ratio: '5:2', format: 'WebP', maxKb: 200 },
        ],
      },
      {
        label: 'Desktop (PC)',
        icon: <Monitor size={14} />,
        color: '#6C2BD9',
        items: [
          { key: 'boitePC',  label: 'Boites Desktop',  hint: '600 × 860 px', ratio: '3:4', format: 'WebP', maxKb: 250 },
          { key: 'sacsPC',   label: 'Sacs Desktop',    hint: '600 × 860 px', ratio: '3:4', format: 'WebP', maxKb: 250 },
          { key: 'cartePC',  label: 'Cartes Desktop',  hint: '600 × 860 px', ratio: '3:4', format: 'WebP', maxKb: 250 },
          { key: 'papierPC', label: 'Papier Desktop',  hint: '600 × 860 px', ratio: '3:4', format: 'WebP', maxKb: 250 },
        ],
      },
    ],
  },
  {
    title: 'Avant / Après',
    icon: '↔️',
    subsections: [
      {
        label: 'Les deux versions',
        icon: null,
        color: '#059669',
        items: [
          { key: 'before', label: 'Image Avant', hint: '900 × 500 px', ratio: '16:9', format: 'WebP', maxKb: 200 },
          { key: 'after',  label: 'Image Après', hint: '900 × 500 px', ratio: '16:9', format: 'WebP', maxKb: 200 },
        ],
      },
    ],
  },
]

function DimBadge({ hint, ratio, format, maxKb }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
      <span style={{ background: 'rgba(108,43,217,0.1)', color: PURPLE, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
        📐 {hint}
      </span>
      <span style={{ background: 'rgba(255,214,0,0.15)', color: '#92400e', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
        ⬜ {ratio}
      </span>
      <span style={{ background: 'rgba(16,185,129,0.1)', color: '#065f46', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50 }}>
        {format} · max {maxKb}KB
      </span>
    </div>
  )
}

function ImageCard({ img, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(null)
  const [success, setSuccess]     = useState(false)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 MB)'); return }

    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setUploading(true)
    setSuccess(false)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload  = () => resolve(r.result)
        r.onerror = reject
        r.readAsDataURL(file)
      })

      const res = await api.post('/github/upload', {
        key:    img.key,
        base64: base64,
        sha:    img.sha || null,
      })

      toast.success(`✅ ${img.label} mis à jour — Cloudflare redéploie (~2 min)`)
      setSuccess(true)
      onUploaded(img.key, res.data.sha)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={{
      background: 'white', borderRadius: 14,
      border: `2px solid ${success ? '#10b981' : 'rgba(108,43,217,0.1)'}`,
      overflow: 'hidden', transition: 'border-color 0.3s',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    }}>
      {/* Preview zone */}
      <div
        style={{
          height: 140, background: '#F8F7FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          borderBottom: '1px solid #f3f4f6',
        }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <Image size={28} style={{ margin: '0 auto 6px' }} />
            <p style={{ fontSize: 11 }}>Cliquer ou glisser</p>
          </div>
        )}
        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={26} style={{ color: PURPLE, animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        {success && !uploading && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#10b981', borderRadius: '50%', padding: 3 }}>
            <CheckCircle size={14} color="white" />
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>

      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: NAVY, marginBottom: 6 }}>{img.label}</p>
        <DimBadge hint={img.hint} ratio={img.ratio} format={img.format} maxKb={img.maxKb} />
        <p style={{ fontSize: 10, color: img.exists ? '#059669' : '#f59e0b', marginBottom: 8, fontWeight: 600 }}>
          {img.exists ? '✅ Fichier présent sur GitHub' : '⚠️ Fichier manquant'}
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
            background: uploading ? '#e5e7eb' : YELLOW,
            color: uploading ? '#9ca3af' : PURPLE_DARK,
            fontWeight: 800, fontSize: 12, cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            fontFamily: 'inherit',
          }}
        >
          <Upload size={13} />
          {uploading ? 'En cours...' : 'Changer'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])} />
      </div>
    </div>
  )
}

function AdminImagesPage() {
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/github/images')
      .then(res => setImages(res.data))
      .catch(err => setError(err.response?.data?.message || 'Impossible de charger'))
      .finally(() => setLoading(false))
  }, [])

  const handleUploaded = (key, newSha) => {
    setImages(prev => prev.map(img => img.key === key ? { ...img, sha: newSha, exists: true } : img))
  }



  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <RefreshCw size={32} style={{ color: PURPLE, animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, margin: 24, display: 'flex', gap: 12 }}>
      <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Erreur GitHub</p>
        <p style={{ fontSize: 13, color: '#b91c1c' }}>{error}</p>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>Vérifie que <code>GITHUB_TOKEN</code> est configuré sur Render.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: NAVY, marginBottom: 6 }}>Gestion des images</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          Upload une image → elle est poussée sur GitHub → Cloudflare redéploie automatiquement en ~2 min.
        </p>
        <div style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,214,0,0.12)', border: '1px solid rgba(255,214,0,0.4)', fontSize: 12, color: PURPLE_DARK, display: 'flex', gap: 8 }}>
          <span>💡</span>
          <span>Respecte les dimensions recommandées pour un rendu parfait sur mobile et PC. Format <strong>WebP</strong> conseillé (plus léger).</span>
        </div>
      </div>

      {GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: 44 }}>
          {/* Group header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>{group.icon}</span>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: NAVY }}>{group.title}</h2>
            <div style={{ flex: 1, height: 2, background: 'rgba(108,43,217,0.1)', borderRadius: 2 }} />
          </div>

          {/* Subsections */}
          {group.subsections.map(sub => {
            const subImages = sub.items.map(item => ({ ...item, ...(images.find(img => img.key === item.key) || { sha: null, exists: false }) }))
            return (
              <div key={sub.label} style={{ marginBottom: 24 }}>
                {/* Subsection header */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 50, marginBottom: 14,
                  background: sub.color + '18',
                  border: `1px solid ${sub.color}40`,
                }}>
                  <span style={{ color: sub.color }}>{sub.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: sub.color }}>{sub.label}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
                  {subImages.map(img => (
                    <ImageCard key={img.key} img={img} onUploaded={handleUploaded} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ))}

    </div>
  )
}

export default AdminImagesPage