import { mockFriends } from '../../utils'
import Badge from '../../components/Badge/Badge'
import Card from '../../components/Card/Card'
import SearchBar from '../../components/SearchBar/SearchBar'
import styles from './Network.module.css'

function Network() {
  return (
    <div className={styles.container}>
      <Badge>Your Friends</Badge>

      <div className={styles.friendsList}>
        {mockFriends.map((friend) => (
          <Card key={friend.id} className={styles.friendCard}>
            <span>👤 {friend.name}</span>
          </Card>
        ))}
      </div>

      <Badge>Find New Friends</Badge>

      <SearchBar />
    </div>
  );
}

export default Network