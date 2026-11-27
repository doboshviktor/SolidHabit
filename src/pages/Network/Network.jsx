import { useState } from 'react';
import { useNetwork } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import styles from './Network.module.css';

function Network() {
  const { friends, allUsers, loading, error, addFriend, removeFriend } = useNetwork();
  const [search, setSearch] = useState('');
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Badge>Your Friends</Badge>

      <div className={styles.friendsList}>
        {friends.map((friend) => (
          <Card key={friend.id} className={styles.userCard}>
            <span>👤 {friend.name}</span>
            <button
              type="button"
              className={styles.deleteIconBtn}
              onClick={() => removeFriend(friend.id)}
              aria-label="Remove friend"
            >
              ✕
            </button>
          </Card>
        ))}
      </div>

      <Badge>Find New Friends</Badge>

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      {loading && <p>Loading users...</p>}
      {error && <p>Error loading users: {error}</p>}

      <div className={styles.usersList}>
        {filteredUsers.map((user) => {
          const isAlreadyFriend = friends.some((f) => f.id === user.id);

          return (
            <Card key={user.id} className={styles.userCard}>
              <span>👤 {user.name}</span>
              {!isAlreadyFriend ? (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => addFriend(user)}
                >
                  Add
                </button>
              ) : (
                <span>Friend</span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Network;