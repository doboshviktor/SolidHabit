import { mockUser } from '../../utils'
import Badge from '../../components/Badge/Badge'
import Card from '../../components/Card/Card'
import SearchBar from '../../components/SearchBar/SearchBar'
import styles from './Marketplace.module.css'

function Marketplace() {
  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <Badge>Your Knowledge</Badge>
        <div className={styles.balance}>
          <Badge>Your Balance:</Badge>
          <span className={styles.balanceNumber}>{mockUser.balance}</span>
        </div>
      </div>

      <Card className={styles.knowledgeCard}>Піцерія Колізей</Card>

      <div className={styles.sectionTitle}>Spend your currency</div>

      <SearchBar />

      <div className={styles.cardsGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
          <Card key={id} className={styles.itemCard}>
            <span>🔒 200</span>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
