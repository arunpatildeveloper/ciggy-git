import { Link } from 'react-router-dom'
import { formatPrice } from '../../store/productStore'
import styles from './ProductCard.module.css'

const ProductCard = ({ product, index = 0 }) => {
  return (
    <Link
      to={`/shop/${product.id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {product.mainImage ? (
          <img src={product.mainImage} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <PlaceholderIcon />
          </div>
        )}
        {product.category && (
          <span className={styles.catTag}>{product.category}</span>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.color && <p className={styles.color}>{product.color}</p>}
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.arrow}>→</span>
        </div>
      </div>
    </Link>
  )
}

const PlaceholderIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="8" y="6" width="24" height="28" rx="1" stroke="#333" strokeWidth="1" />
    <line x1="8" y1="14" x2="32" y2="14" stroke="#2a2a2a" strokeWidth="0.8" />
  </svg>
)

export default ProductCard
