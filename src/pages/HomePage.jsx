import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import styles from './HomePage.module.css'

const HomePage = () => (
  <div className={`page-fade ${styles.page}`}>
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <h1 className={styles.wordmark}>CIGGY</h1>
        <Button variant="primary" size="lg">
          <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
            Shop
          </Link>
        </Button>
      </div>
    </section>
  </div>
)

export default HomePage
