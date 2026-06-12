import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'

const AboutPage = () => (
  <div className={`page-fade ${styles.page}`}>
    <div className="container">
      <Link to="/" className={styles.homeLink}>← Home</Link>
      <h1 className={styles.title}>About</h1>
      <p className={styles.soon}>Coming soon.</p>
    </div>
  </div>
)

export default AboutPage
