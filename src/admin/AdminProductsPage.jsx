/* ============================================
   CIGGY Admin — Products Management
   Add / Edit / Delete products.
   Same localStorage as main site.
   ============================================ */

import { useState, useRef, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import useProductStore, { generateId, formatPrice } from '../store/productStore'
import { compressImage } from '../utils/compressImage'
import styles from './AdminProductsPage.module.css'

const EMPTY = {
  name: '', price: '', category: '', color: '',
  sizes: '', stock: 'in_stock', description: '',
  details: '', care: '', mainImage: '', extraImages: [],
}

const CATEGORY_OPTIONS = ['Tees', 'Shirts', 'Outerwear', 'Polos', 'Accessories']
const STOCK_OPTIONS = [
  { value: 'in_stock',    label: 'In Stock'     },
  { value: 'out_of_stock',label: 'Out of Stock' },
  { value: 'coming_soon', label: 'Coming Soon'  },
]

const AdminProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts } = useProductStore()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [editId, setEditId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('list')

  useEffect(() => { fetchProducts() }, [])

  // Storage health check — shows on page so you can see it on mobile
  const storageWorks = (() => {
    try {
      localStorage.setItem('__test__', '1')
      const ok = localStorage.getItem('__test__') === '1'
      localStorage.removeItem('__test__')
      return ok
    } catch { return false }
  })()

  // Check if there's a mismatch (store has products but localStorage is empty)
  const storageMismatch = products.length > 0 && !localStorage.getItem('ciggy_products')

  const change = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter a valid price.'
    return e
  }

  const build = (id) => ({
    id,
    name: form.name.trim(),
    price: Number(form.price),
    category: form.category.trim(),
    color: form.color.trim(),
    sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
    stock: form.stock,
    description: form.description.trim(),
    details: form.details.split('\n').map((s) => s.trim()).filter(Boolean),
    care: form.care.split('\n').map((s) => s.trim()).filter(Boolean),
    mainImage: form.mainImage || '',
    extraImages: form.extraImages.filter(Boolean),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    if (editId) {
      const { error } = await updateProduct(editId, build(editId))
      if (error) { alert('Save failed: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await addProduct(build(generateId()))
      if (error) { alert('Add failed: ' + error.message); setSaving(false); return }
    }
    setSaving(false)
    setSaved(true)
    reset()
    setView('list')
  }

  const reset = () => { setForm(EMPTY); setErrors({}); setEditId(null) }

  const startEdit = (p) => {
    setEditId(p.id)
    setForm({
      name: p.name || '', price: String(p.price || ''),
      category: p.category || '', color: p.color || '',
      sizes: (p.sizes || []).join(', '), stock: p.stock || 'in_stock',
      description: p.description || '',
      details: (p.details || []).join('\n'),
      care: (p.care || []).join('\n'),
      mainImage: p.mainImage || '',
      extraImages: p.extraImages || [],
    })
    setSaved(false)
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Products</h1>
            <span className={styles.count}>{products.length} added</span>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => { reset(); setView(view === 'form' ? 'list' : 'form') }}
          >
            {view === 'form' ? '← Back to list' : '+ Add Product'}
          </button>
        </div>

        {/* Storage health indicator */}
        {!storageWorks && (
          <div style={{ background: '#3a1010', border: '1px solid #8B3030', padding: '12px 16px', marginBottom: '16px', fontSize: '0.78rem', color: '#e8a0a0' }}>
            ⚠️ localStorage is not working in this browser. Try Chrome (not private mode).
          </div>
        )}
        {storageMismatch && (
          <div style={{ background: '#3a2a10', border: '1px solid #8B6030', padding: '12px 16px', marginBottom: '16px', fontSize: '0.78rem', color: '#e8c0a0', lineHeight: 1.6 }}>
            ⚠️ Products are in memory but not saving to storage. This is usually caused by uploaded images being too large.
            <strong style={{ display: 'block', marginTop: '6px' }}>Use image URLs instead of uploading files, or add products without images first.</strong>
          </div>
        )}

        {/* Debug panel — shows raw localStorage value */}
        <details style={{ marginBottom: '16px', fontSize: '0.72rem', color: '#555' }}>
          <summary style={{ cursor: 'pointer', padding: '6px 0' }}>Debug info</summary>
          <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', padding: '12px', marginTop: '8px', wordBreak: 'break-all', color: '#888', lineHeight: 1.6 }}>
            <p>localStorage works: <strong style={{ color: storageWorks ? '#5a8a4a' : '#a05050' }}>{String(storageWorks)}</strong></p>
            <p>Products in store: <strong style={{ color: '#e8e4dc' }}>{products.length}</strong></p>
            <p>Raw localStorage key <code>ciggy_products</code>:</p>
            <p style={{ color: '#666', fontSize: '0.68rem', marginTop: '4px' }}>
              {localStorage.getItem('ciggy_products')
                ? `${localStorage.getItem('ciggy_products').slice(0, 120)}…`
                : 'null / empty'}
            </p>
          </div>
        </details>

        {/* Form */}
        {view === 'form' && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <p className={styles.formTitle}>{editId ? 'Edit Product' : 'New Product'}</p>

            <div className={styles.formGrid}>
              {/* Left */}
              <div className={styles.col}>
                <Sect title="Basic Info">
                  <F label="Product Name *" name="name" value={form.name} onChange={change} error={errors.name} placeholder="e.g. Core Tee 01" />
                  <F label="Price (₹) *" name="price" type="number" value={form.price} onChange={change} error={errors.price} placeholder="1499" />
                  <div className={styles.row2}>
                    <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>Category</label>
                      <select name="category" value={form.category} onChange={change} className={styles.input}>
                        <option value="">Select…</option>
                        {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <F label="Custom Category" name="category" value={form.category} onChange={change} placeholder="Or type…" />
                  </div>
                  <F label="Color" name="color" value={form.color} onChange={change} placeholder="e.g. Washed Black" />
                  <F label="Sizes (comma separated)" name="sizes" value={form.sizes} onChange={change} placeholder="S, M, L, XL, XXL" />
                  <div className="form-field" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>Stock Status</label>
                    <select name="stock" value={form.stock} onChange={change} className={styles.input}>
                      {STOCK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </Sect>
                <Sect title="Description & Details">
                  <TA label="Short Description" name="description" value={form.description} onChange={change} rows={3} placeholder="One or two sentences." />
                  <TA label="Product Details (one per line)" name="details" value={form.details} onChange={change} rows={4} placeholder={"Heavyweight cotton\nBoxy fit"} />
                  <TA label="Care (one per line)" name="care" value={form.care} onChange={change} rows={3} placeholder={"Machine wash cold\nDo not bleach"} />
                </Sect>
              </div>

              {/* Right: Images */}
              <div className={styles.col}>
                <Sect title="Main Image">
                  <p className={styles.imgNote}>Appears on shop card and product page.</p>
                  <ImagePicker
                    value={form.mainImage}
                    onChange={(v) => { setForm((f) => ({ ...f, mainImage: v })); setSaved(false) }}
                    onClear={() => { setForm((f) => ({ ...f, mainImage: '' })); setSaved(false) }}
                  />
                </Sect>
                <Sect title="Gallery Images">
                  <p className={styles.imgNote}>Appear in product detail gallery.</p>
                  <GalleryPicker
                    images={form.extraImages}
                    onChange={(imgs) => { setForm((f) => ({ ...f, extraImages: imgs })); setSaved(false) }}
                  />
                </Sect>
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.saveBtn} type="submit" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Product'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={() => { reset(); setView('list') }}>
                Cancel
              </button>
              {saved && <span className={styles.savedMsg}>Saved ✓</span>}
            </div>
          </form>
        )}

        {/* Product list */}
        {view === 'list' && (
          <div className={styles.list}>
            {products.length === 0 ? (
              <p className={styles.empty}>No products yet. Click "Add Product" above.</p>
            ) : (
              products.map((p) => (
                <div key={p.id} className={styles.pRow}>
                  <div className={styles.pThumb}>
                    {p.mainImage
                      ? <img src={p.mainImage} alt={p.name} />
                      : <div className={styles.pThumbEmpty} />
                    }
                  </div>
                  <div className={styles.pInfo}>
                    <p className={styles.pName}>{p.name}</p>
                    <p className={styles.pMeta}>
                      {p.category && <span>{p.category}</span>}
                      {p.price > 0 && <span>{formatPrice(p.price)}</span>}
                      <span
                        className={styles.pStock}
                        data-stock={p.stock}
                      >
                        {p.stock === 'in_stock' ? 'In Stock' : p.stock === 'out_of_stock' ? 'Out of Stock' : 'Coming Soon'}
                      </span>
                    </p>
                  </div>
                  <div className={styles.pActions}>
                    <button className={styles.editBtn} onClick={() => startEdit(p)}>Edit</button>
                    <button
                      className={styles.delBtn}
                      onClick={async () => {
                        if (window.confirm(`Delete "${p.name}"?`)) {
                          const { error } = await deleteProduct(p.id)
                          if (error) alert('Delete failed: ' + error.message)
                        }
                      }}
                    >Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

/* ---- Image picker ---- */
const ImagePicker = ({ value, onChange, onClear }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const compressed = await compressImage(file)
      onChange(compressed)
    } catch {
      // fallback to raw FileReader if compression fails
      const reader = new FileReader()
      reader.onload = (ev) => onChange(ev.target.result)
      reader.readAsDataURL(file)
    }
    setLoading(false)
    e.target.value = ''
  }

  const handleUrl = () => { if (url.trim()) { onChange(url.trim()); setUrl('') } }

  return (
    <div className={styles.imgPicker}>
      {value ? (
        <div className={styles.imgPreview}>
          <img src={value} alt="Preview" />
          <button type="button" className={styles.removeImg} onClick={onClear}>×</button>
        </div>
      ) : (
        <>
          <button type="button" className={styles.uploadBtn} onClick={() => ref.current?.click()} disabled={loading}>
            {loading ? 'Compressing…' : 'Upload from device'}
          </button>
          <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <div className={styles.urlRow}>
            <input type="url" placeholder="Or paste image URL…" value={url}
              onChange={(e) => setUrl(e.target.value)} className={styles.urlInput}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrl())}
            />
            <button type="button" className={styles.urlBtn} onClick={handleUrl}>Add</button>
          </div>
        </>
      )}
    </div>
  )
}

/* ---- Gallery picker ---- */
const GalleryPicker = ({ images, onChange }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setLoading(true)
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)))
      onChange([...images, ...compressed])
    } catch {
      // fallback
      let done = 0; const results = []
      files.forEach((f) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          results.push(ev.target.result)
          if (++done === files.length) onChange([...images, ...results])
        }
        reader.readAsDataURL(f)
      })
    }
    setLoading(false)
    e.target.value = ''
  }

  const addUrl = () => { if (url.trim()) { onChange([...images, url.trim()]); setUrl('') } }
  const remove = (i) => onChange(images.filter((_, idx) => idx !== i))

  return (
    <div className={styles.imgPicker}>
      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((img, i) => (
            <div key={i} className={styles.galleryThumb}>
              <img src={img} alt={`Gallery ${i + 1}`} />
              <button type="button" className={styles.removeThumb} onClick={() => remove(i)}>×</button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className={styles.uploadBtn} onClick={() => ref.current?.click()} disabled={loading}>
        {loading ? 'Compressing…' : 'Upload images'}
      </button>
      <input ref={ref} type="file" accept="image/*" multiple onChange={addFiles} style={{ display: 'none' }} />
      <div className={styles.urlRow}>
        <input type="url" placeholder="Paste image URL…" value={url}
          onChange={(e) => setUrl(e.target.value)} className={styles.urlInput}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <button type="button" className={styles.urlBtn} onClick={addUrl}>Add</button>
      </div>
    </div>
  )
}

/* ---- Form helpers ---- */
const Sect = ({ title, children }) => (
  <div className={styles.sect}>
    <p className={styles.sectTitle}>{title}</p>
    <div className={styles.sectFields}>{children}</div>
  </div>
)

const F = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
  <div className={styles.field}>
    <label className={styles.fieldLabel}>{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`${styles.input} ${error ? styles.inputErr : ''}`} />
    {error && <p className={styles.fieldErr}>{error}</p>}
  </div>
)

const TA = ({ label, name, value, onChange, rows, placeholder }) => (
  <div className={styles.field}>
    <label className={styles.fieldLabel}>{label}</label>
    <textarea name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
      className={styles.input} style={{ resize: 'vertical' }} />
  </div>
)

export default AdminProductsPage
