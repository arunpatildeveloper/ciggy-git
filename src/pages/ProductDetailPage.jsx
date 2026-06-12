import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import useProductStore, { formatPrice } from '../store/productStore'
import useCartStore from '../store/cartStore'
import useToastStore from '../store/toastStore'
import styles from './ProductDetailPage.module.css'

const ProductDetailPage = () => {
  const { id } = useParams()
  const getProduct = useProductStore((s) => s.getProduct)
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const products = useProductStore((s) => s.products)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // If store is empty, fetch first
    if (products.length === 0) {
      fetchProducts().then(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  const product = getProduct(id)

  if (!ready) return <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading…</div>
  if (!product) return <NotFound />
  return <Detail product={product} />
}

const Detail = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [adding, setAdding] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const addToast = useToastStore((s) => s.addToast)

  // Build gallery — mainImage first, then extras
  const gallery = [
    product.mainImage,
    ...(product.extraImages || []),
  ].filter(Boolean)

  const sizes = (product.sizes || []).filter(Boolean)

  const handleAdd = () => {
    // Block purchase if not in stock
    if (product.stock === 'out_of_stock') {
      addToast('This product is out of stock.')
      return
    }
    if (product.stock === 'coming_soon') {
      addToast('This product is coming soon.')
      return
    }
    if (sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    setAdding(true)
    addItem(product, selectedSize || 'One Size', quantity)
    addToast('Added to cart')
    setTimeout(() => setAdding(false), 350)
  }

  const handleSizeClick = (s) => {
    setSelectedSize(s)
    setSizeError(false)
  }

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/shop" className={styles.breadLink}>Shop</Link>
          <span aria-hidden> / </span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* Gallery */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImage}>
              {gallery.length > 0 ? (
                <img src={gallery[selectedImage]} alt={product.name} className={styles.mainImg} />
              ) : (
                <div className={styles.noImage} aria-hidden>
                  <PlaceholderSvg />
                </div>
              )}
              {product.category && <span className={styles.catTag}>{product.category}</span>}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className={styles.thumbs}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${selectedImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            {product.color && <p className={styles.color}>{product.color}</p>}
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>

            {product.description && (
              <p className={styles.desc}>{product.description}</p>
            )}

            {/* Stock status */}
            {product.stock && product.stock !== 'in_stock' && (
              <p className={styles.stockBadge} data-stock={product.stock}>
                {product.stock === 'out_of_stock' ? 'Out of Stock' : 'Coming Soon'}
              </p>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className={styles.sizeSection}>
                <div className={styles.sizeRow}>
                  <span className={styles.label}>Size</span>
                  {sizeError && (
                    <span className={styles.sizeErr} role="alert">Select a size first.</span>
                  )}
                </div>
                <div className={styles.sizeGrid}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeSel : ''} ${sizeError ? styles.sizeErrBorder : ''}`}
                      onClick={() => handleSizeClick(s)}
                      aria-pressed={selectedSize === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.qtySection}>
              <span className={styles.label}>Quantity</span>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span className={styles.qtyVal} aria-live="polite">{quantity}</span>
                <button className={styles.qtyBtn} onClick={() => setQuantity((q) => q + 1)} aria-label="Increase">+</button>
              </div>
            </div>

            <Button
              variant="primary" size="lg" fullWidth
              onClick={handleAdd}
              disabled={adding || product.stock === 'out_of_stock' || product.stock === 'coming_soon'}
            >
              {product.stock === 'out_of_stock' ? 'Out of Stock'
                : product.stock === 'coming_soon' ? 'Coming Soon'
                : adding ? 'Adding…' : 'Add to Cart'}
            </Button>

            {/* Details accordion */}
            {product.details?.length > 0 && (
              <Accordion title="Product Details">
                <ul className={styles.detailList}>
                  {product.details.filter(Boolean).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </Accordion>
            )}

            {product.care?.length > 0 && (
              <Accordion title="Care">
                <ul className={styles.detailList}>
                  {product.care.filter(Boolean).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionBtn} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{title}</span>
        <span className={`${styles.accordionIcon} ${open ? styles.accordionOpen : ''}`}>+</span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

const PlaceholderSvg = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden>
    <rect x="12" y="8" width="36" height="44" rx="1" stroke="#2a2a2a" strokeWidth="1" />
    <line x1="12" y1="20" x2="48" y2="20" stroke="#222" strokeWidth="0.8" />
  </svg>
)

const NotFound = () => (
  <div className={styles.notFound}>
    <p>Product not found.</p>
    <Button variant="secondary" size="md">
      <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Back to Shop</Link>
    </Button>
  </div>
)

export default ProductDetailPage
