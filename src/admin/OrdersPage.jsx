import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import useOrderStore, { ORDER_STATUSES } from '../store/orderStore'
import { formatPrice } from '../store/productStore'
import styles from './OrdersPage.module.css'

const STATUS_COLORS = {
  Pending:   { color: '#8B8030', bg: 'rgba(139,128,48,0.08)'  },
  Confirmed: { color: '#4a7a5a', bg: 'rgba(74,122,90,0.08)'   },
  Shipped:   { color: '#3a6a8a', bg: 'rgba(58,106,138,0.08)'  },
  Delivered: { color: '#5a8a4a', bg: 'rgba(90,138,74,0.08)'   },
  Cancelled: { color: '#a05050', bg: 'rgba(160,80,80,0.08)'   },
}

const OrdersPage = () => {
  const { orders, updateStatus, deleteOrder, fetchOrders } = useOrderStore()
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchOrders() }, [])

  // Reload on window focus
  const handleFocus = () => fetchOrders()

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'All' || o.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <AdminLayout>
      <div className={styles.page} onFocus={handleFocus}>
        <div className={styles.header}>
          <h1 className={styles.title}>Orders</h1>
          <span className={styles.count}>{orders.length} total</span>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            type="search"
            placeholder="Search order, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.statusFilters}>
            {['All', ...ORDER_STATUSES].map((s) => (
              <button
                key={s}
                className={`${styles.filterBtn} ${filterStatus === s ? styles.filterActive : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>
            {orders.length === 0 ? 'No orders yet. Orders will appear here after checkout.' : 'No orders match.'}
          </p>
        ) : (
          <div className={styles.table}>
            {/* Header */}
            <div className={`${styles.row} ${styles.rowHead}`}>
              <span>Order</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Total</span>
              <span>Payment</span>
              <span>Status</span>
              <span>Date</span>
              <span></span>
            </div>

            {filtered.map((o) => (
              <div key={o.orderNumber} className={styles.row}>
                <span className={styles.orderNum}>{o.orderNumber}</span>
                <div>
                  <p className={styles.custName}>{o.customerName}</p>
                  <p className={styles.custEmail}>{o.email}</p>
                </div>
                <span className={styles.muted}>{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</span>
                <span className={styles.total}>{formatPrice(o.total)}</span>
                <span className={styles.muted}>{o.payment === 'cod' ? 'COD' : 'UPI'}</span>
                <span>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.orderNumber, e.target.value)}
                    className={styles.statusSelect}
                    style={{
                      color: STATUS_COLORS[o.status]?.color || '#888',
                      borderColor: STATUS_COLORS[o.status]?.color + '55' || '#333',
                    }}
                    aria-label={`Status for ${o.orderNumber}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </span>
                <span className={styles.muted}>
                  {o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-IN') : '—'}
                </span>
                <div className={styles.rowActions}>
                  <button className={styles.detailBtn} onClick={() => setSelected(o)}>View</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={async () => {
                      if (window.confirm(`Delete order ${o.orderNumber}?`)) await deleteOrder(o.orderNumber)
                    }}
                  >×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order detail modal */}
        {selected && (
          <OrderModal order={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </AdminLayout>
  )
}

/* ---- Order detail modal ---- */
const OrderModal = ({ order, onClose }) => {
  const updateStatus = useOrderStore((s) => s.updateStatus)

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div>
            <p className={styles.modalLabel}>Order</p>
            <h2 className={styles.modalTitle}>{order.orderNumber}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {/* Customer */}
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Customer</p>
            <p className={styles.modalText}>{order.customerName}</p>
            <p className={styles.modalMuted}>{order.email}</p>
            <p className={styles.modalMuted}>{order.phone}</p>
          </div>

          {/* Address */}
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Shipping Address</p>
            <p className={styles.modalText}>{order.address}</p>
          </div>

          {/* Items */}
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Items</p>
            {order.items?.map((item, i) => (
              <div key={i} className={styles.modalItem}>
                <div>
                  <p className={styles.modalText}>{item.name}</p>
                  <p className={styles.modalMuted}>Size {item.size} · Qty {item.quantity}</p>
                </div>
                <span className={styles.modalText}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className={styles.modalSection}>
            <div className={styles.modalTotals}>
              <div className={styles.modalTotalRow}><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className={styles.modalTotalRow}><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
              <div className={`${styles.modalTotalRow} ${styles.modalTotalBold}`}><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Status */}
          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Update Status</p>
            <div className={styles.statusBtns}>
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  className={`${styles.statusBtn} ${order.status === s ? styles.statusBtnActive : ''}`}
                  onClick={() => updateStatus(order.orderNumber, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
