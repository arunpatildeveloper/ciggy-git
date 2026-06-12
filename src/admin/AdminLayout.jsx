/* ============================================
   CIGGY Admin — Shared Layout
   Sidebar + topbar. All admin pages use this.
   ============================================ */

import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦' },
  { to: '/admin/orders', label: 'Orders', icon: '◫' },
  { to: '/admin/products', label: 'Products', icon: '◻' },
]

const AdminLayout = ({ children }) => {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <p className={styles.brand}>CIGGY</p>
          <p className={styles.brandSub}>Admin</p>
        </div>
        <nav className={styles.nav}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/admin'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navActive : ''}`
              }
            >
              <span className={styles.navIcon}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sideBottom}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
            ↗ View Site
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
