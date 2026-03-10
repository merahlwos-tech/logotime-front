// src/utils/uploadCloudinary.js
// Upload direct navigateur → Cloudinary (unsigned preset)

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('env vars missing: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET')
  }

  const fd = new FormData()
  fd.append('file',          file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder',        'brandpack-logos')

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