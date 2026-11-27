import { useState } from 'react';
import { useMarketplace } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Marketplace.module.css';

function Marketplace() {
  const { balance, items, loading, error, buyItem } = useMarketplace();
  const [search, setSearch] = useState('');

  const purchasedItems = items.filter((item) => item.unlocked);
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Badge>Your Items</Badge>
        <div className={styles.balance}>
          <Badge className={styles.balanceLabel}>Your Balance:</Badge>
          <span className={styles.balanceNumber}>{balance} Nyavchuku</span>
        </div>
      </div>

      {loading && <p>Loading items...</p>}
      {error && <p>Error loading items: {error}</p>}

      <div className={styles.purchasedGrid}>
        {!loading && !error && purchasedItems.length === 0 && (
          <p>Your purchased items will appear here.</p>
        )}
        {purchasedItems.map((item) => (
          <Card key={item.id} className={styles.purchasedCard}>
            <strong>{item.title}</strong>
            {item.description && <span>{item.description}</span>}
            <p className={styles.secretContent}>{item.secret || item.description || item.title}</p>
          </Card>
        ))}
      </div>

      <Badge>All Items</Badge>

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search items..."
      />

      <div className={styles.cardsGrid}>
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`${styles.itemCard} ${item.unlocked ? styles.itemCardUnlocked : ''}`}
            onClick={() => !item.unlocked && buyItem(item.id)}
          >
            {item.unlocked ? (
              <>
                <span>🔓 Unlocked</span>
                <span className={styles.itemTitle}>{item.title}</span>
              </>
            ) : (
              <>
                <span className={styles.priceTag}>🔒 {item.price}</span>
                <span className={styles.itemTitle}>{item.title}</span>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
