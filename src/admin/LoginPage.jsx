import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import styles from './LoginPage.module.css'

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Enter username and password.'); return }
    setLoading(true)
    setTimeout(() => {
      const ok = login(form.username, form.password)
      if (ok) {
        navigate('/admin')
      } else {
        setError('Wrong username or password.')
        setLoading(false)
      }
    }, 400)
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
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username" name="username" type="text"
              value={form.username} onChange={change}
              className={styles.input} autoComplete="username"
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
