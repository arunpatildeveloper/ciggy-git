/* ============================================
   CIGGY — Upload image to Supabase Storage
   Returns the public CDN URL.
   Bucket: product-images (must be public)
   ============================================ */

import { supabase } from '../lib/supabase'
import { compressImage } from './compressImage'

export const uploadImage = async (file) => {
  // Compress first to reduce upload size
  let uploadFile = file
  try {
    const compressed = await compressImage(file, 1200, 0.82)
    // Convert base64 back to blob for upload
    const res = await fetch(compressed)
    uploadFile = await res.blob()
  } catch {
    uploadFile = file // fallback to original if compression fails
  }

  // Unique filename: timestamp + random + original extension
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `products/${filename}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, uploadFile, {
      contentType: uploadFile.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    console.error('CIGGY: image upload error', error)
    return { error: error.message }
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return { url: data.publicUrl }
}
