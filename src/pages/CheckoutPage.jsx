import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import useCartStore, { SHIPPING_THRESHOLD, SHIPPING_COST } from '../store/cartStore'
import useOrderStore from '../store/orderStore'
import { formatPrice } from '../store/productStore'
import styles from './CheckoutPage.module.css'

const generateOrderNum = () => `CIGGY-${1000 + Math.floor(Math.random() * 9000)}`

const INIT = {
  fullName: '', email: '', phone: '',
  address1: '', address2: '',
  city: '', state: '', pincode: '', country: 'India',
  payment: 'cod',
}

const CheckoutPage = () => {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const addOrder = useOrderStore((s) => s.addOrder)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [placing, setPlacing] = useState(false)

  if (items.length === 0) return (
    <div className={`page-fade ${styles.empty}`}>
      <div className="container">
        <p className={styles.emptyText}>Your cart is empty.</p>
        <Button variant="primary" size="md">
          <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Go to Shop</Link>
        </Button>
      </div>
    </div>
  )

  const set = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required.'
    if (!form.email.trim()) e.email = 'Required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.phone.trim()) e.phone = 'Required.'
    if (!form.address1.trim()) e.address1 = 'Required.'
    if (!form.city.trim()) e.city = 'Required.'
    if (!form.state.trim()) e.state = 'Required.'
    if (!form.pincode.trim()) e.pincode = 'Required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setPlacing(true)
    const orderNumber = generateOrderNum()
    const orderData = {
      orderNumber,
      customerName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: `${form.address1}${form.address2 ? ', ' + form.address2 : ''}, ${form.city}, ${form.state} - ${form.pincode}, ${form.country}`,
      items, subtotal, shipping, total,
      payment: form.payment,
      status: 'Pending',
      placedAt: new Date().toISOString(),
    }
    // Save to Supabase
    await addOrder(orderData)
    // Save to session for confirmation page
    sessionStorage.setItem('ciggy_order', JSON.stringify(orderData))
    clearCart()
    navigate('/order-confirmation')
  }

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className="container">
        <div className={styles.header}><h1 className={styles.title}>Checkout</h1></div>
        <form className={styles.layout} onSubmit={handleSubmit} noValidate>
          {/* Form fields */}
          <div className={styles.formSide}>
            <Sect title="Contact">
              <Field label="Full Name" name="fullName" value={form.fullName} onChange={set} error={errors.fullName} required autoComplete="name" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={set} error={errors.email} required autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set} error={errors.phone} required autoComplete="tel" />
            </Sect>

            <Sect title="Shipping Address">
              <Field label="Address Line 1" name="address1" value={form.address1} onChange={set} error={errors.address1} required autoComplete="address-line1" />
              <Field label="Address Line 2" name="address2" value={form.address2} onChange={set} autoComplete="address-line2" />
              <div className={styles.row2}>
                <Field label="City" name="city" value={form.city} onChange={set} error={errors.city} required autoComplete="address-level2" />
                <Field label="State" name="state" value={form.state} onChange={set} error={errors.state} required autoComplete="address-level1" />
              </div>
              <div className={styles.row2}>
                <Field label="Pincode" name="pincode" value={form.pincode} onChange={set} error={errors.pincode} required autoComplete="postal-code" />
                <Field label="Country" name="country" value={form.country} onChange={set} autoComplete="country" />
              </div>
            </Sect>

            <Sect title="Payment">
              <p className={styles.payNote}>Payment will be connected later.</p>
              <RadioOpt id="cod" name="payment" value="cod" label="Cash on Delivery" desc="Pay when your order arrives." checked={form.payment === 'cod'} onChange={set} />
              <RadioOpt id="upi" name="payment" value="upi" label="Manual UPI" desc="UPI details will be shared via email." checked={form.payment === 'upi'} onChange={set} />
            </Sect>
          </div>

          {/* Summary */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className={styles.si}>
                  <div>
                    <p className={styles.siName}>{item.name}</p>
                    <p className={styles.siMeta}>Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <span className={styles.siPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <SRow label="Subtotal" val={formatPrice(subtotal)} />
            <SRow label="Shipping" val={shipping === 0 ? <span className={styles.free}>Free</span> : formatPrice(SHIPPING_COST)} />
            <SRow label="Total" val={formatPrice(total)} bold />
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={placing}>
              {placing ? 'Placing…' : 'Place Order'}
            </Button>
          </aside>
        </form>
      </div>
    </div>
  )
}

const Sect = ({ title, children }) => (
  <div className={styles.sect}>
    <h2 className={styles.sectTitle}>{title}</h2>
    <div className={styles.sectFields}>{children}</div>
  </div>
)

const Field = ({ label, name, type = 'text', value, onChange, error, required, autoComplete }) => (
  <div className="form-field">
    <label className="form-label" htmlFor={name}>
      {label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
    </label>
    <input
      id={name} name={name} type={type} value={value} onChange={onChange}
      autoComplete={autoComplete}
      className={`form-input${error ? ' error' : ''}`}
      aria-required={required} aria-invalid={!!error}
    />
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>
)

const RadioOpt = ({ id, name, value, label, desc, checked, onChange }) => (
  <label className={`${styles.radioOpt} ${checked ? styles.radioChecked : ''}`} htmlFor={id}>
    <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className={styles.radioInput} />
    <div>
      <p className={styles.radioLabel}>{label}</p>
      <p className={styles.radioDesc}>{desc}</p>
    </div>
  </label>
)

const SRow = ({ label, val, bold }) => (
  <div className={`${styles.sRow} ${bold ? styles.sRowBold : ''}`}>
    <span>{label}</span><span>{val}</span>
  </div>
)

export default CheckoutPage
