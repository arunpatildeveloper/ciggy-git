import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const items = useCartStore((s) => s.items)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const onScroll = useCallback(() => setScrolled(window.scrollY > 16), [])
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const links = [
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.wordmark}>CIGGY</Link>

          <nav className={styles.desktopLinks} aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.right}>
            <Link to="/cart" className={styles.cartBtn} aria-label={`Cart ${count > 0 ? `(${count})` : ''}`}>
              <BagIcon />
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            <button
              className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`${styles.overlay} ${open ? styles.overlayOn : ''}`} onClick={() => setOpen(false)} aria-hidden />

      {/* Mobile drawer */}
      <nav className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-hidden={!open} aria-label="Mobile menu">
        <div className={styles.drawerInner}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerActive : ''}`}>
            Cart {count > 0 ? `(${count})` : ''}
          </NavLink>
        </div>
      </nav>
    </>
  )
}

const BagIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

export default Navbar
