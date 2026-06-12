import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
  const authed = useAuthStore((s) => s.authed)
  return authed ? children : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
