import styles from './SearchBar.module.css'

function SearchBar({ placeholder = 'Search' }) {
  return (
    <div className={styles.searchBar}>
      <span>🔍</span>
      <input type="text" className={styles.input} placeholder={placeholder} />
    </div>
  )
}

export default SearchBar