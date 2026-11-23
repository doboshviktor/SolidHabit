import { useState } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from './useAuth';

export function useHome() {
  const { data: fetchedHabits, loading: habitsLoading, error: habitsError } = useFetch('http://localhost:5000/api/habits');
  const { data: serverHistory, loading: historyLoading, error: historyError } = useFetch('http://localhost:5000/api/habits/history');
  const { balance, updateBalance } = useAuth();

  const [localHabits, setLocalHabits] = useState(() => {
    const saved = localStorage.getItem('today_habits');
    return saved ? JSON.parse(saved) : null;
  });

  const [localHistory, setLocalHistory] = useState(null);

  const habits = localHabits ?? (fetchedHabits || []);
  const history = localHistory ?? (serverHistory || []);

  const completedTodayCount = habits.filter((h) => h.completed).length;

  const updateServerHistory = (updatedList) => {
    const today = new Date().toISOString().slice(0, 10);
    const completedCount = updatedList.filter((h) => h.completed).length;
    const totalCount = updatedList.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const currentHist = localHistory ?? (serverHistory || []);
    const idx = currentHist.findIndex((h) => h.date === today);
    const newEntry = { date: today, completedCount, totalCount, percentage };
    let newHist;
    if (idx >= 0) {
      newHist = currentHist.map((h, i) => (i === idx ? newEntry : h));
    } else {
      newHist = [...currentHist, newEntry];
    }
    setLocalHistory(newHist);

    fetch('http://localhost:5000/api/habits/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, completedCount, totalCount }),
    }).catch(() => {});
  };

  const toggleHabit = (id) => {
    const currentList = localHabits ?? (fetchedHabits || []);
    const targetHabit = currentList.find((h) => h.id === id);
    if (!targetHabit) return;

    const previousCompletedCount = currentList.filter((h) => h.completed).length;
    const willBeCompleted = !targetHabit.completed;

    const updated = currentList.map((habit) =>
      habit.id === id ? { ...habit, completed: willBeCompleted } : habit
    );

    const newCompletedCount = updated.filter((h) => h.completed).length;

    const oldRewardedCount = Math.min(previousCompletedCount, 5);
    const newRewardedCount = Math.min(newCompletedCount, 5);
    const rewardDiff = (newRewardedCount - oldRewardedCount) * 50;

    if (rewardDiff !== 0) {
      updateBalance(Math.max(0, balance + rewardDiff));
    }

    setLocalHabits(updated);
    localStorage.setItem('today_habits', JSON.stringify(updated));
    updateServerHistory(updated);
  };

  const addHabit = (title) => {
    if (!title) return;
    const currentList = localHabits ?? (fetchedHabits || []);
    const newHabit = {
      id: Date.now(),
      title,
      completed: false,
    };
    const updated = [...currentList, newHabit];
    setLocalHabits(updated);
    localStorage.setItem('today_habits', JSON.stringify(updated));
    updateServerHistory(updated);
  };

  const deleteHabit = (id) => {
    const currentList = localHabits ?? (fetchedHabits || []);
    const deletedHabit = currentList.find((h) => h.id === id);
    const previousCompletedCount = currentList.filter((h) => h.completed).length;

    const updated = currentList.filter((habit) => habit.id !== id);
    const newCompletedCount = updated.filter((h) => h.completed).length;

    if (deletedHabit && deletedHabit.completed) {
      const oldRewardedCount = Math.min(previousCompletedCount, 5);
      const newRewardedCount = Math.min(newCompletedCount, 5);
      const rewardDiff = (newRewardedCount - oldRewardedCount) * 50;
      if (rewardDiff !== 0) {
        updateBalance(Math.max(0, balance + rewardDiff));
      }
    }

    setLocalHabits(updated);
    localStorage.setItem('today_habits', JSON.stringify(updated));
    updateServerHistory(updated);
  };

  const chartData = history.slice(-28).map((item) => ({
    ...item,
    formattedDate: item.date.slice(5),
  }));

  return {
    habits,
    history,
    chartData,
    completedTodayCount,
    balance,
    loading: habitsLoading || historyLoading,
    error: habitsError || historyError,
    toggleHabit,
    addHabit,
    deleteHabit,
  };
}
