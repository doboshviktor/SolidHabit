import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoSolid}>Solid</span>Habit
      </Link>

      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>
        <Link to="/marketplace" className={styles.navLink}>
          Marketplace
        </Link>
        <Link to="/network" className={styles.navLink}>
          Network
        </Link>
        <Link to="/profile">
          <Button className={styles.profileBtn}>Pes_Patron</Button>
        </Link>
      </nav>
    </header>
  )
}

export default Header