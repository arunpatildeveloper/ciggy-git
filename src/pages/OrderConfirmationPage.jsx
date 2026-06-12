import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { formatPrice } from '../store/productStore'
import styles from './OrderConfirmationPage.module.css'

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null)
  useEffect(() => {
    try {
      const d = sessionStorage.getItem('ciggy_order')
      if (d) setOrder(JSON.parse(d))
    } catch {}
  }, [])

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className={`container ${styles.inner}`}>

        {/* Under construction notice */}
        <div className={styles.constructionBanner}>
          <span className={styles.constructionIcon}>🏗️🚧</span>
          <div>
            <p className={styles.constructionTitle}>CIGGY is under construction</p>
            <p className={styles.constructionText}>
              This is a project website for now. Checkout is not active. Products and payments are only demo for now.
            </p>
          </div>
        </div>

        <div className={styles.check} aria-hidden>✓</div>
        <h1 className={styles.title}>Order placed.</h1>

        {order ? (
          <>
            <div className={styles.meta}>
              <MetaRow label="Order" value={order.orderNumber} />
              {order.customerName && <MetaRow label="Name" value={order.customerName} />}
              <MetaRow label="Payment" value={order.payment === 'cod' ? 'Cash on Delivery' : 'Manual UPI'} />
            </div>

            <div className={styles.summary}>
              <p className={styles.summaryHead}>Items</p>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className={styles.sItem}>
                  <div>
                    <p className={styles.sName}>{item.name}</p>
                    <p className={styles.sMeta}>Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span className={styles.sPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className={styles.sRow}><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className={styles.sRow}>
                <span>Shipping</span>
                <span>{order.shipping === 0 ? <span className={styles.free}>Free</span> : formatPrice(order.shipping)}</span>
              </div>
              <div className={`${styles.sRow} ${styles.sTotal}`}><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </>
        ) : (
          <p className={styles.noOrder}>No order details available.</p>
        )}

        <div className={styles.ctas}>
          <Button variant="primary" size="lg">
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Back to Home</Link>
          </Button>
          <Button variant="secondary" size="lg">
            <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const MetaRow = ({ label, value }) => (
  <div className={styles.metaRow}>
    <span className={styles.metaKey}>{label}</span>
    <span className={styles.metaVal}>{value}</span>
  </div>
)

export default OrderConfirmationPage
