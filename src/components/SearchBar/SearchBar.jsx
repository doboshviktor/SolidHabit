import styles from './SearchBar.module.css';

function SearchBar({ placeholder = 'Search', value, onChange }) {
  return (
    <div className={styles.searchBar}>
      <span>🔍</span>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
