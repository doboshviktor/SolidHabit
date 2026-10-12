import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import styles from './Landing.module.css'

function Landing() {
  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.pathname = '/dashboard'
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1 className={styles.title}>
          <span className={styles.logoAccent}>Solid</span>Habit.
          <br />
          Discipline is your currency.
        </h1>
        <p className={styles.description}>
          Prove your daily progress to your friends, earn internal currency, and
          unlock their hidden posts, curated playlists, and anonymous secrets.
          Stop faking your routines.
        </p>
      </div>

      <div className={styles.rightColumn}>
        <Card className={styles.loginCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Name</label>
            <input className={styles.input} type="text" placeholder="Name" />

            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
            />

            <Button type="submit" className={styles.submitBtn}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Landing
