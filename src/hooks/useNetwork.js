import { useState } from 'react';
import { useFetch } from './useFetch';
import { mockFriends } from '../utils';

export function useNetwork() {
  const { data: allUsers, loading, error } = useFetch('/data/users.json');

  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('friends');
    return saved ? JSON.parse(saved) : mockFriends;
  });

  const addFriend = (user) => {
    if (friends.some((f) => f.id === user.id)) return;
    const updated = [...friends, user];
    setFriends(updated);
    localStorage.setItem('friends', JSON.stringify(updated));
  };

  const removeFriend = (id) => {
    const updated = friends.filter((f) => f.id !== id);
    setFriends(updated);
    localStorage.setItem('friends', JSON.stringify(updated));
  };

  return {
    friends,
    allUsers: allUsers || [],
    loading,
    error,
    addFriend,
    removeFriend,
  };
}