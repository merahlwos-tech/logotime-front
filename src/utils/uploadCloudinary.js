// src/utils/uploadCloudinary.js
// Upload direct navigateur → Cloudinary (unsigned preset)
// Compression + conversion WebP avant envoi

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const MAX_DIMENSION = 1200  // px max largeur ou hauteur
const JPEG_QUALITY  = 0.78  // bon équilibre qualité/poids pour logos clients

/**
 * Compresse et redimensionne une image via Canvas
 * Préfère WebP si le navigateur le supporte, sinon JPEG
 */
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calcul des dimensions en conservant le ratio
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }

      const canvas  = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      // Tenter WebP d'abord (meilleure compression), fallback JPEG
      const tryWebP = () => {
        canvas.toBlob(
          blob => {
            if (blob && blob.size > 0) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
            } else {
              tryJpeg()
            }
          },
          'image/webp',
          JPEG_QUALITY
        )
      }

      const tryJpeg = () => {
        // Pour les PNG avec transparence, garder PNG
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const quality = mime === 'image/png' ? undefined : JPEG_QUALITY
        canvas.toBlob(
          blob => {
            if (!blob) { reject(new Error('Compression échouée')); return }
            resolve(new File([blob], file.name, { type: mime }))
          },
          mime,
          quality
        )
      }

      tryWebP()
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Lecture image échouée')) }
    img.src = url
  })
}

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('env vars missing: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET')
  }

  let fileToUpload = file
  const isCompressible = file.type.startsWith('image/')
    && file.type !== 'image/gif'
    && file.type !== 'image/svg+xml'

  if (isCompressible) {
    try {
      fileToUpload = await compressImage(file)
    } catch {
      fileToUpload = file // fallback sur l'original
    }
  }

  const fd = new FormData()
  fd.append('file',          fileToUpload)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder',        'brandpack-logos')
  // Demander à Cloudinary de livrer en auto format + qualité auto
  fd.append('quality',       'auto:good')
  fd.append('fetch_format',  'auto')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Cloudinary error ${res.status}`)
  }

  const data = await res.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files) {
  return Promise.all(Array.from(files).map(uploadToCloudinary))
}