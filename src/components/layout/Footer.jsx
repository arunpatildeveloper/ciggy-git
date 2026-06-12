import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.inner}`}>
      <div className={styles.left}>
        <Link to="/" className={styles.wordmark}>CIGGY</Link>
        {/* Replace with real Instagram URL */}
        <a href="https://instagram.com/ciggy.in" target="_blank" rel="noopener noreferrer" className={styles.ig}>
          @ciggy.in
        </a>
      </div>
      <nav className={styles.links} aria-label="Footer">
        <Link to="/shop" className={styles.link}>Shop</Link>
        <Link to="/about" className={styles.link}>About</Link>
        <Link to="/contact" className={styles.link}>Contact</Link>
      </nav>
    </div>
    <div className={styles.bottom}>
      <div className="container">
        <p className={styles.copy}>© {new Date().getFullYear()} CIGGY</p>
      </div>
    </div>
  </footer>
)

export default Footer
