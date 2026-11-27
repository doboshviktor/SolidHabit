import { useMarketplace } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import styles from './Marketplace.module.css';

function Marketplace() {
  const { balance, items, unlockedSecrets, buyItem } = useMarketplace();

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Badge>Your Knowledge</Badge>
        <div className={styles.balance}>
          <Badge>Your Balance:</Badge>
          <span className={styles.balanceNumber}>{balance}</span>
        </div>
      </div>

      <div className={styles.secretsGrid}>
        {unlockedSecrets.map((secret, index) => (
          <Card key={index} className={styles.knowledgeCard}>
            {secret}
          </Card>
        ))}
      </div>

      <div className={styles.sectionTitle}>Spend your currency</div>

      <div className={styles.cardsGrid}>
        {items.map((item) => (
          <Card
            key={item.id}
            className={`${styles.itemCard} ${item.unlocked ? styles.itemCardUnlocked : ''}`}
            onClick={() => !item.unlocked && buyItem(item.id)}
          >
            {item.unlocked ? (
              <>
                <span>🔓 Unlocked</span>
                <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{item.title}</span>
              </>
            ) : (
              <>
                <span className={styles.priceTag}>🔒 {item.price}</span>
                <span style={{ fontSize: '14px', fontWeight: 'normal' }}>{item.title}</span>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;