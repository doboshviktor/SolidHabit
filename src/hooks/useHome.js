import { useState } from 'react';
import { useFetch } from './useFetch';

export function useHome() {
  const { data: fetchedHabits, loading, error } = useFetch('/data/habits.json');

  const [localHabits, setLocalHabits] = useState(() => {
    const saved = localStorage.getItem('today_habits');
    return saved ? JSON.parse(saved) : null;
  });

  const habits = localHabits ?? (fetchedHabits || []);

  const toggleHabit = (id) => {
    const currentList = localHabits ?? (fetchedHabits || []);
    const updated = currentList.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setLocalHabits(updated);
    localStorage.setItem('today_habits', JSON.stringify(updated));
  };

  return {
    habits,
    loading,
    error,
    toggleHabit,
  };
}