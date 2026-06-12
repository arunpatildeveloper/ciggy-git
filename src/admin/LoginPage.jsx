import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import styles from './LoginPage.module.css'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Enter email and password.'); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    if (result.success) {
      navigate('/admin')
    } else {
      setError('Wrong email or password.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.top}>
          <p className={styles.brand}>CIGGY</p>
          <p className={styles.sub}>Admin</p>
        </div>

        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={change}
              className={styles.input} autoComplete="email"
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              value={form.password} onChange={change}
              className={styles.input} autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <a href="/" className={styles.backLink}>← Back to site</a>
      </div>
    </div>
  )
}

export default LoginPage
