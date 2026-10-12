import Button from '../Button/Button'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
        <span className={styles.logoSolid}>Solid</span>Habit
      </a>

      <nav className={styles.nav}>
        <a href="/dashboard" className={styles.navLink}>
          Dashboard
        </a>
        <a href="/marketplace" className={styles.navLink}>
          Marketplace
        </a>
        <a href="/network" className={styles.navLink}>
          Network
        </a>
        <a href="/profile">
          <Button>Pes_Patron</Button>
        </a>
      </nav>
    </header>
  )
}

export default Header