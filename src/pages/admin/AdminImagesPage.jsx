import { useState, useEffect, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle, RefreshCw, Image } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const PURPLE      = '#6C2BD9'
const PURPLE_DARK = '#4A1A9E'
const NAVY        = '#1E0A4A'
const YELLOW      = '#FFD600'

const GROUPS = [
  {
    title: 'Hero',
    items: [
      { key: 'main',   label: 'Hero Mobile',   hint: '800 × 600 px' },
      { key: 'mainPC', label: 'Hero Desktop',  hint: '1280 × 640 px' },
    ],
  },
  {
    title: 'Catégories',
    items: [
      { key: 'boite',  label: 'Boites',              hint: '600 × 800 px' },
      { key: 'sacs',   label: 'Sacs (mobile)',        hint: '600 × 800 px' },
      { key: 'sacsPC', label: 'Sacs (desktop)',       hint: '800 × 600 px' },
      { key: 'carte',  label: 'Cartes & Autocollants',hint: '600 × 800 px' },
      { key: 'papier', label: 'Papier',               hint: '600 × 800 px' },
    ],
  },
  {
    title: 'Avant / Après',
    items: [
      { key: 'before', label: 'Image Avant', hint: '800 × 500 px' },
      { key: 'after',  label: 'Image Après', hint: '800 × 500 px' },
    ],
  },
]

function ImageCard({ img, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(null)
  const [success, setSuccess]     = useState(false)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Fichier image requis'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 MB)'); return }

    // Preview
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setUploading(true)
    setSuccess(false)
    try {
      // Convert to base64
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

      toast.success(`✅ ${img.label} mis à jour — Cloudflare redéploie automatiquement`)
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
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: `2px solid ${success ? '#10b981' : 'rgba(108,43,217,0.12)'}`,
      overflow: 'hidden',
      transition: 'border-color 0.3s',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      {/* Image preview */}
      <div
        style={{
          height: 160, background: '#F0EEF9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt={img.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <Image size={32} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 12 }}>Glisser-déposer</p>
          </div>
        )}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RefreshCw size={28} style={{ color: PURPLE, animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        {success && !uploading && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: '#10b981', borderRadius: '50%', padding: 4,
          }}>
            <CheckCircle size={16} color="white" />
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: NAVY, marginBottom: 2 }}>{img.label}</p>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>
          {img.hint} · {img.exists ? '✅ Fichier présent' : '⚠️ Fichier manquant'}
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', padding: '9px 0',
            borderRadius: 8, border: 'none',
            background: uploading ? '#e5e7eb' : YELLOW,
            color: uploading ? '#9ca3af' : PURPLE_DARK,
            fontWeight: 800, fontSize: 13,
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          <Upload size={14} />
          {uploading ? 'Upload en cours...' : 'Changer l\'image'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
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
      .catch(err => {
        const msg = err.response?.data?.message || 'Impossible de charger les images'
        setError(msg)
        toast.error(msg)
      })
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
    <div style={{
      background: '#fef2f2', border: '1px solid #fecaca',
      borderRadius: 16, padding: 24, margin: 24,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Erreur de connexion GitHub</p>
        <p style={{ fontSize: 13, color: '#b91c1c' }}>{error}</p>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          Vérifie que <code>GITHUB_TOKEN</code> est configuré sur Render.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '24px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: NAVY, marginBottom: 6 }}>
          Gestion des images
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Les images sont poussées directement sur GitHub → Cloudflare redéploie automatiquement (≈ 2 min).
        </p>
        <div style={{
          marginTop: 12, padding: '10px 16px', borderRadius: 10,
          background: 'rgba(255,214,0,0.15)', border: '1px solid rgba(255,214,0,0.4)',
          fontSize: 12, color: PURPLE_DARK, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>💡</span>
          <span>Format recommandé : <strong>WebP</strong> · max <strong>5 MB</strong> · glisser-déposer supporté</span>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map(group => {
        const groupImages = group.items.map(item => images.find(img => img.key === item.key) || { ...item, sha: null, exists: false })
        return (
          <div key={group.title} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ height: 3, width: 24, background: YELLOW, borderRadius: 2 }} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: PURPLE }}>{group.title}</h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {groupImages.map(img => (
                <ImageCard key={img.key} img={img} onUploaded={handleUploaded} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AdminImagesPage