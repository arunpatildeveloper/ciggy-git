import { useEffect } from 'react'
import AdminLayout from './AdminLayout'
import useOrderStore from '../store/orderStore'
import useProductStore, { formatPrice } from '../store/productStore'
import styles from './DashboardPage.module.css'

const DashboardPage = () => {
  const orders = useOrderStore((s) => s.orders)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const products = useProductStore((s) => s.products)
  const fetchProducts = useProductStore((s) => s.fetchProducts)

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const pending = orders.filter((o) => o.status === 'Pending').length
  const recent = orders.slice(0, 5)

  const statusColor = {
    Pending: '#8B8030',
    Confirmed: '#4a7a5a',
    Shipped: '#3a6a8a',
    Delivered: '#5a8a4a',
    Cancelled: '#a05050',
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.date}>{new Date().toDateString()}</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <Stat label="Total Orders" value={orders.length} />
          <Stat label="Pending" value={pending} accent />
          <Stat label="Products" value={products.length} />
          <Stat label="Revenue (demo)" value={formatPrice(totalRevenue)} />
        </div>

        {/* Recent orders */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <a href="/admin/orders" className={styles.viewAll}>View all →</a>
          </div>

          {recent.length === 0 ? (
            <p className={styles.empty}>No orders yet.</p>
          ) : (
            <div className={styles.table}>
              <div className={`${styles.row} ${styles.rowHead}`}>
                <span>Order</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Payment</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {recent.map((o) => (
                <div key={o.orderNumber} className={styles.row}>
                  <span className={styles.orderNum}>{o.orderNumber}</span>
                  <span>{o.customerName}</span>
                  <span>{formatPrice(o.total)}</span>
                  <span className={styles.muted}>{o.payment === 'cod' ? 'COD' : 'UPI'}</span>
                  <span>
                    <span
                      className={styles.badge}
                      style={{ color: statusColor[o.status] || '#888', borderColor: statusColor[o.status] + '44' }}
                    >
                      {o.status}
                    </span>
                  </span>
                  <span className={styles.muted}>
                    {o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const Stat = ({ label, value, accent }) => (
  <div className={`${styles.stat} ${accent ? styles.statAccent : ''}`}>
    <p className={styles.statLabel}>{label}</p>
    <p className={styles.statValue}>{value}</p>
  </div>
)

export default DashboardPage
