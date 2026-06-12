import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
  const authed = useAuthStore((s) => s.authed)
  const loading = useAuthStore((s) => s.loading)
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [])

  // While checking existing session, show nothing (avoids flash redirect)
  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0d0d0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#555', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
      letterSpacing: '0.06em'
    }}>
      …
    </div>
  )

  return authed ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
