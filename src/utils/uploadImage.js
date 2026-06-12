/* ============================================
   CIGGY — Image upload + delete utilities
   Uses Supabase Storage bucket: product-images
   ============================================ */

import { supabase } from '../lib/supabase'
import { compressImage } from './compressImage'

/* Upload a file — returns { url } or { error } */
export const uploadImage = async (file) => {
  let uploadFile = file
  try {
    const compressed = await compressImage(file, 1200, 0.82)
    const res = await fetch(compressed)
    uploadFile = await res.blob()
  } catch {
    uploadFile = file
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, uploadFile, {
      contentType: uploadFile.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    console.error('CIGGY: image upload error', error)
    return { error: error.message }
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return { url: data.publicUrl }
}

/* Delete an image from storage by its public URL.
   Only deletes if the URL is from our own Supabase bucket — ignores external URLs. */
export const deleteImage = async (url) => {
  if (!url) return
  // Only delete Supabase Storage URLs for our bucket
  const marker = '/object/public/product-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return // external URL — skip

  // Extract the full path after the bucket name
  let path = url.slice(idx + marker.length)
  // Remove any query params
  path = path.split('?')[0]

  if (!path) return

  const { error } = await supabase.storage
    .from('product-images')
    .remove([path])

  if (error) console.error('CIGGY: image delete error', path, error)
  else console.log('CIGGY: deleted', path)
}
