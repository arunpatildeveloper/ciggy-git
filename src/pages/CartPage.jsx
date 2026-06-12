import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import useCartStore, { SHIPPING_THRESHOLD, SHIPPING_COST } from '../store/cartStore'
import { formatPrice } from '../store/productStore'
import styles from './CartPage.module.css'

const CartPage = () => {
  const items = useCartStore((s) => s.items)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  if (items.length === 0) return <EmptyCart />

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Cart</h1>
        </div>
        <div className={styles.layout}>
          {/* Items */}
          <div className={styles.items}>
            {items.map((item) => <CartItem key={`${item.id}-${item.size}`} item={item} />)}
          </div>

          {/* Summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Summary</h2>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row
              label="Shipping"
              value={shipping === 0 ? <span className={styles.free}>Free</span> : formatPrice(SHIPPING_COST)}
            />
            {subtotal < SHIPPING_THRESHOLD && (
              <p className={styles.shippingNote}>Free shipping above {formatPrice(SHIPPING_THRESHOLD)}.</p>
            )}
            <Row label="Total" value={formatPrice(total)} bold />
            <Button variant="primary" size="lg" fullWidth>
              <Link to="/checkout" style={{ color: 'inherit', textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%' }}>
                Checkout
              </Link>
            </Button>
            <Button variant="ghost" size="md" fullWidth>
              <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none', display: 'block', textAlign: 'center', width: '100%' }}>
                Continue Shopping
              </Link>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  )
}

const Row = ({ label, value, bold }) => (
  <div className={`${styles.row} ${bold ? styles.rowBold : ''}`}>
    <span>{label}</span><span>{value}</span>
  </div>
)

const CartItem = ({ item }) => {
  const update = useCartStore((s) => s.updateQuantity)
  const remove = useCartStore((s) => s.removeItem)

  return (
    <div className={styles.item}>
      {/* Image */}
      <div className={styles.itemImg}>
        {item.image
          ? <img src={item.image} alt={item.name} className={styles.itemImgEl} />
          : <div className={styles.itemImgEmpty} aria-hidden />
        }
      </div>

      <div className={styles.itemBody}>
        <div className={styles.itemTop}>
          <div>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemMeta}>Size: {item.size}</p>
          </div>
          <button className={styles.removeBtn} onClick={() => remove(item.id, item.size)} aria-label={`Remove ${item.name}`}>×</button>
        </div>
        <div className={styles.itemBottom}>
          <div className={styles.qtyRow}>
            <button className={styles.qBtn} onClick={() => {
              if (item.quantity === 1) remove(item.id, item.size)
              else update(item.id, item.size, item.quantity - 1)
            }} aria-label="Decrease">−</button>
            <span className={styles.qVal} aria-live="polite">{item.quantity}</span>
            <button className={styles.qBtn} onClick={() => update(item.id, item.size, item.quantity + 1)} aria-label="Increase">+</button>
          </div>
          <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}

const EmptyCart = () => (
  <div className={`page-fade ${styles.emptyPage}`}>
    <div className="container">
      <div className={styles.emptyInner}>
        <h1 className={styles.emptyTitle}>Your cart is empty.</h1>
        <Button variant="primary" size="md">
          <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Go to Shop</Link>
        </Button>
      </div>
    </div>
  </div>
)

export default CartPage
