import { useHome } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import chartImg from '../../assets/chart.png';
import styles from './Home.module.css';

function Home() {
  const { habits, loading, error, toggleHabit } = useHome();

  return (
    <div className={styles.container}>
      <Badge>My Habits</Badge>

      {loading && <p>Loading habits...</p>}
      {error && <p>Error loading habits: {error}</p>}

      <div className={styles.habitsGrid}>
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className={styles.habitCard}
            onClick={() => toggleHabit(habit.id)}
          >
            <div
              className={`${styles.checkbox} ${habit.completed ? styles.checkboxChecked : ''}`}
            >
              {habit.completed ? '✓' : ''}
            </div>
            <span className={styles.habitTitle}>{habit.title}</span>
          </Card>
        ))}
      </div>

      <Badge>Your monthly discipline</Badge>

      <div className={styles.chartContainer}>
        <img
          src={chartImg}
          className={styles.chartImg}
          alt="Discipline chart"
        />
      </div>

      <div className={styles.footer}>
        <p>You stuck to your habits 67% of the time this month. Good job</p>
        <Button onClick={() => alert('Previous stats: 67%')}>
          See previous stats
        </Button>
      </div>
    </div>
  );
}

export default Home;