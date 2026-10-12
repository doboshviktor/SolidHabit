import styles from './Card.module.css'

function Card({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${onClick ? styles.clickable : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card