import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
  const authed = useAuthStore((s) => s.authed)
  const loading = useAuthStore((s) => s.loading)
  const init = useAuthStore((s) => s.init)
  const initialized = useRef(false)

  useEffect(() => {
    // Only init once per app lifetime, not on every render
    if (!initialized.current) {
      initialized.current = true
      init()
    }
  }, [])

  // Show blank dark screen while checking session — avoids login flash on refresh
  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      fontSize: '0.75rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      …
    </div>
  )

  return authed ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
