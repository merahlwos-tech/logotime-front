import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Loader2, RefreshCw, Star } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const NAVY   = '#1E0A4A'
const PURPLE = '#6C2BD9'

export default function AdminReviewsPage() {
  const [photos, setPhotos]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const inputRef = useRef(null)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await api.get('/github/reviews')
      setPhotos(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Erreur chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const handleUpload = async (files) => {
    if (!files?.length) return
    setUploading(true)
    let added = 0
    try {
      for (const file of Array.from(files)) {
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader()
          r.onload = () => res(r.result)
          r.onerror = () => rej(new Error('Lecture échouée'))
          r.readAsDataURL(file)
        })
        const resp = await api.post('/github/reviews', { filename: file.name, base64 })
        if (resp.data.url) {
          setPhotos(p => [...p, { name: resp.data.url.split('/').pop(), url: resp.data.url, sha: resp.data.sha }])
          added++
        }
      }
      if (added > 0) toast.success(`${added} photo${added > 1 ? 's' : ''} ajoutée${added > 1 ? 's' : ''}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (photo) => {
    if (!window.confirm(`Supprimer cette photo ?`)) return
    setDeletingId(photo.name)
    try {
      await api.delete(`/github/reviews/${photo.name}`, { data: { sha: photo.sha } })
      setPhotos(p => p.filter(r => r.name !== photo.name))
      toast.success('Photo supprimée')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur suppression')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PURPLE }}>
            Galerie
          </p>
          <h1 className="text-3xl font-black italic" style={{ color: NAVY }}>
            Retours clients
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ces photos s'affichent sur la page d'accueil dans la section "Retours de nos clients"
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchReviews} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all hover:bg-purple-50 disabled:opacity-50"
            style={{ borderColor: PURPLE, color: PURPLE }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg cursor-pointer transition-all hover:opacity-90"
            style={{ background: uploading ? '#9ca3af' : PURPLE, pointerEvents: uploading ? 'none' : 'auto' }}>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => handleUpload(e.target.files)} disabled={uploading} />
            {uploading
              ? <><Loader2 size={16} className="animate-spin" /> Upload en cours...</>
              : <><Upload size={16} /> Ajouter des photos</>}
          </label>
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: PURPLE }} />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
            style={{ background: 'rgba(108,43,217,0.06)' }}>
            📸
          </div>
          <p className="font-black text-lg mb-1" style={{ color: NAVY }}>Aucune photo pour l'instant</p>
          <p className="text-sm text-gray-400 mb-6">Ajoutez des photos de retours clients pour les afficher sur le site</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold cursor-pointer shadow-lg"
            style={{ background: PURPLE }}>
            <input type="file" accept="image/*" multiple className="hidden"
              onChange={e => handleUpload(e.target.files)} />
            <Upload size={16} /> Ajouter ma première photo
          </label>
        </div>
      ) : (
        <>
          {/* Compteur */}
          <div className="flex items-center gap-2">
            <Star size={14} style={{ color: PURPLE }} />
            <span className="text-sm font-bold" style={{ color: NAVY }}>
              {photos.length} photo{photos.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400">— visible{photos.length > 1 ? 's' : ''} sur la page d'accueil</span>
          </div>

          {/* Grille */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo, i) => (
              <div key={photo.name}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all"
                style={{ aspectRatio: '1/1' }}>

                <img
                  src={photo.url}
                  alt={`retour client ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={e => { e.target.style.opacity = '0.3' }}
                />

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(photo)}
                    disabled={deletingId === photo.name}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                               w-10 h-10 rounded-full flex items-center justify-center
                               bg-red-500 hover:bg-red-600 text-white shadow-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === photo.name
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Trash2 size={16} />}
                  </button>
                </div>

                {/* Numéro */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>
                  {i + 1}
                </div>
              </div>
            ))}

            {/* Zone d'upload inline */}
            <label className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-purple-500"
              style={{ aspectRatio: '1/1', borderColor: '#e5e7eb' }}>
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleUpload(e.target.files)} disabled={uploading} />
              {uploading
                ? <Loader2 size={24} className="animate-spin" style={{ color: PURPLE }} />
                : <>
                    <Upload size={24} />
                    <span className="text-xs font-semibold text-center px-2">Ajouter</span>
                  </>}
            </label>
          </div>
        </>
      )}
    </div>
  )
}