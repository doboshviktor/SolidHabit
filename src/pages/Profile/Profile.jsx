import Badge from '../../components/Badge/Badge'
import Card from '../../components/Card/Card'
import styles from './Profile.module.css'

function Profile() {
  return (
    <div className={styles.container}>
      <Badge>Welcome, Pes_Patron</Badge>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Full Name</label>
          <input type="text" className={styles.input} placeholder="Name" />
        </div>

        <div className={styles.field}>
          <label>Nickname</label>
          <input type="text" className={styles.input} placeholder="Name" />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" className={styles.input} placeholder="Email" />
        </div>

        <div className={styles.field}>
          <label>Country</label>
          <input type="text" className={styles.input} placeholder="Email" />
        </div>
      </div>

      <Badge>Your Marketplace Items</Badge>

      <Card className={styles.addItemCard}>
        <span>+ Add new item</span>
      </Card>
    </div>
  );
}

export default Profile