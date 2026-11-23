import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './Landing.module.css';

function Landing() {
  const navigate = useNavigate();
  const { login, error, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(name, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className={styles.errorMessage}>{error}</p>}

            <Button type="submit" className={styles.submitBtn}>
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Landing;
