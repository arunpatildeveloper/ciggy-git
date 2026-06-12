import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import styles from './ContactPage.module.css'

// Your Instagram handle — edit here
const INSTAGRAM_HANDLE = 'ciggy.in'
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`
// Instagram DM URL — pre-fills message with form content
const buildDMUrl = (name, email, message) => {
  const text = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
  return `https://ig.me/m/${INSTAGRAM_HANDLE}?text=${text}`
}

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const change = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required.'
    if (!form.email.trim()) e.email = 'Required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.message.trim()) e.message = 'Required.'
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // Redirect to Instagram DM with form content pre-filled
    window.open(buildDMUrl(form.name, form.email, form.message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className="container">
        <Link to="/" className={styles.homeLink}>← Home</Link>
        <h1 className={styles.title}>Contact</h1>

        <div className={styles.layout}>
          <div className={styles.formSide}>
            <form className={styles.form} onSubmit={submit} noValidate>
              <F label="Name" name="name" value={form.name} onChange={change} error={errors.name} required />
              <F label="Email" name="email" type="email" value={form.email} onChange={change} error={errors.email} required />
              <F label="Message" name="message" textarea value={form.message} onChange={change} error={errors.message} required />
              <Button type="submit" variant="primary" size="md">Submit</Button>
              <p className={styles.submitNote}>Submitting opens Instagram DM with your message pre-filled.</p>
            </form>
          </div>

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <p className={styles.infoLabel}>Instagram</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>@{INSTAGRAM_HANDLE}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const F = ({ label, name, type = 'text', value, onChange, error, required, textarea }) => (
  <div className="form-field">
    <label className="form-label" htmlFor={name}>
      {label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
    </label>
    {textarea ? (
      <textarea
        id={name} name={name} value={value} onChange={onChange} rows={5}
        className={`form-input${error ? ' error' : ''}`}
        style={{ resize: 'vertical' }}
        aria-required={required} aria-invalid={!!error}
      />
    ) : (
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        className={`form-input${error ? ' error' : ''}`}
        aria-required={required} aria-invalid={!!error}
      />
    )}
    {error && <p className="form-error" role="alert">{error}</p>}
  </div>
)

export default ContactPage
