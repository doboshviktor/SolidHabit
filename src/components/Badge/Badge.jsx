import styles from './Badge.module.css'

function Badge({ children, className = '' }) {
  return <div className={`${styles.badge} ${className}`}>{children}</div>
}

export default Badge