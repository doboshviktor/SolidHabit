import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useHome, useProofs } from '../../hooks';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './Home.module.css';

function Home() {
  const {
    habits,
    history,
    chartData,
    completedTodayCount,
    balance,
    loading,
    error,
    toggleHabit,
    addHabit,
    deleteHabit,
  } = useHome();

  const { myIncomingRequests, respondProof } = useProofs();

  const [newTitle, setNewTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [proofInputs, setProofInputs] = useState({});

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addHabit(newTitle.trim());
      setNewTitle('');
      setShowAddForm(false);
    }
  };

  const handleSendProof = (requestId) => {
    const text = proofInputs[requestId] || 'Confirmed by user';
    respondProof(requestId, text);
  };

  return (
    <div className={styles.container}>
      {myIncomingRequests.length > 0 && (
        <div className={styles.proofAlertSection}>
          {myIncomingRequests.map((req) => (
            <Card key={req.id} className={styles.proofRequestCard}>
              <div className={styles.proofRequestHeader}>
                <span>
                  🔍 <strong>{req.fromUserName}</strong> requested proof for: <strong>"{req.habitTitle}"</strong>
                </span>
                <span className={styles.proofDateBadge}>{req.date}</span>
              </div>
              <div className={styles.proofInputRow}>
                <input
                  type="text"
                  placeholder="Paste Strava link, photo URL, or leave a note (e.g. 5km run done!)..."
                  className={styles.habitInput}
                  value={proofInputs[req.id] || ''}
                  onChange={(e) =>
                    setProofInputs({ ...proofInputs, [req.id]: e.target.value })
                  }
                />
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleSendProof(req.id)}
                >
                  Send Proof ✓
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className={styles.habitsHeaderRow}>
        <div className={styles.habitsHeading}>
          <Badge className={styles.headingBadge}>My Habits</Badge>
          {!showAddForm && (
            <button
              type="button"
              className={styles.addHabitToggleBtn}
              onClick={() => setShowAddForm(true)}
            >
              + Add Habit
            </button>
          )}
        </div>

        <div className={styles.rewardBanner}>
          <span className={styles.balanceTag}>💰 {balance} Nyavchuku</span>
          <span className={styles.rewardHint}>
            Rewarded tasks: {Math.min(completedTodayCount, 5)}/5 (50 Nyavchuku each)
          </span>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className={styles.addHabitForm}>
          <input
            type="text"
            placeholder="New habit title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={styles.habitInput}
            autoFocus
          />
          <button type="submit" className={styles.addBtn}>
            Add Habit
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => {
              setShowAddForm(false);
              setNewTitle('');
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {loading && <p>Loading habits...</p>}
      {error && <p>Error loading habits: {error}</p>}

      <div className={styles.habitsGrid}>
        {habits.map((habit, index) => {
          const isRewardedSlot = habit.completed && index < 5;
          return (
            <Card key={habit.id} className={styles.habitCard}>
              <div className={styles.habitLeft} onClick={() => toggleHabit(habit.id)}>
                <div
                  className={`${styles.checkbox} ${habit.completed ? styles.checkboxChecked : ''}`}
                >
                  {habit.completed ? '✓' : ''}
                </div>
                <span className={styles.habitTitle}>{habit.title}</span>
                {isRewardedSlot && (
                  <span className={styles.rewardPill}>+50 Nyavchuku</span>
                )}
              </div>
              <button
                type="button"
                className={styles.deleteIconBtn}
                onClick={() => deleteHabit(habit.id)}
                aria-label="Delete habit"
              >
                ✕
              </button>
            </Card>
          );
        })}
      </div>

      <Badge>Your monthly discipline (Last 28 Days)</Badge>

      <Card className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span>Habits completed per day</span>
          <span>Max height = your daily habits</span>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHabits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D31A42" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D31A42" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="formattedDate" stroke="#191A23" fontSize={12} tickLine={false} />
              <YAxis stroke="#191A23" fontSize={12} allowDecimals={false} domain={[0, 'dataMax + 1']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #191A23',
                  borderRadius: '8px',
                }}
                formatter={(val) => [`${val} habits completed`, 'Discipline']}
                labelFormatter={(lbl) => `Date: ${lbl}`}
              />
              <Area
                type="monotone"
                dataKey="completedCount"
                stroke="#D31A42"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHabits)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className={styles.footer}>
        <p>You stuck to your habits 71% of the time this month. Good job!</p>
        <Button onClick={() => setShowHistoryModal(true)}>
          See previous stats
        </Button>
      </div>

      {showHistoryModal && (
        <div className={styles.modalOverlay} onClick={() => setShowHistoryModal(false)}>
          <div className={styles.statsModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTop}>
              <Badge>All Time Discipline History</Badge>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowHistoryModal(false)}
              >
                Close ✕
              </button>
            </div>

            <div className={styles.historyList}>
              {[...history].reverse().map((entry) => (
                <div key={entry.date} className={styles.historyRow}>
                  <span className={styles.historyDate}>{entry.date}</span>
                  <div className={styles.historyStats}>
                    <span>
                      {entry.completedCount} / {entry.totalCount || 7} habits
                    </span>
                    <span className={styles.badgeSuccess}>{entry.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
