import { useState } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from './useAuth';
import { mockUser } from '../utils';

export function useProfile(userId = null) {
  const { user: authUser } = useAuth();
  const isOtherUser = Boolean(userId);
  const ownerId = isOtherUser ? Number(userId) : authUser?.id;
  const profileKey = `profile_${authUser?.id}`;
  const itemsKey = `marketplace_items_${authUser?.id}`;

  const { data: serverOtherUser, loading: otherUserLoading } = useFetch(
    isOtherUser ? `http://localhost:5000/api/users/${userId}` : null
  );

  const { data: serverOtherHistory, loading: otherHistoryLoading } = useFetch(
    isOtherUser ? `http://localhost:5000/api/users/${userId}/history` : null
  );

  const [myProfile, setMyProfile] = useState(() => {
    const saved = localStorage.getItem(profileKey);
    if (saved) return JSON.parse(saved);
    if (authUser) return authUser;
    return mockUser;
  });

  const profile = isOtherUser ? serverOtherUser || {} : myProfile;
  const history = isOtherUser ? serverOtherHistory || [] : [];

  const chartData = history.slice(-28).map((item) => ({
    ...item,
    formattedDate: item.date.slice(5),
  }));

  const { data: fetchedItems, loading: itemsLoading, error: itemsError } = useFetch(
    'http://localhost:5000/api/marketplace'
  );

  const [localItemsState, setLocalItemsState] = useState(() => {
    const saved = localStorage.getItem(itemsKey);
    return { key: itemsKey, items: saved ? JSON.parse(saved) : null };
  });

  const savedItems = localStorage.getItem(itemsKey);
  const localItems = localItemsState.key === itemsKey
    ? localItemsState.items
    : (savedItems ? JSON.parse(savedItems) : null);

  const items = (isOtherUser ? (fetchedItems || []) : (localItems ?? (fetchedItems || [])))
    .filter((item) => item.ownerId === ownerId);

  const updateProfile = (field, value) => {
    if (isOtherUser) return;
    setMyProfile((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(profileKey, JSON.stringify(updated));
      return updated;
    });
  };

  const addItem = (title, price, description = '', id = null) => {
    if (isOtherUser) return;
    const currentList = items;
    let updated;

    if (id) {
      updated = currentList.map((item) =>
        item.id === id
          ? { ...item, title: title || item.title, price: Number(price) || item.price, description }
          : item
      );
      setLocalItemsState({ key: itemsKey, items: updated });
      localStorage.setItem(itemsKey, JSON.stringify(updated));
    } else {
      const newItem = {
        ownerId: authUser.id,
        title: title || 'New Item',
        price: Number(price) || 100,
        description,
      };

      fetch('http://localhost:5000/api/marketplace/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((createdItem) => {
          const listWithNew = [...currentList, createdItem];
          setLocalItemsState({ key: itemsKey, items: listWithNew });
          localStorage.setItem(itemsKey, JSON.stringify(listWithNew));
        })
        .catch(() => {
          const fallbackItem = { ...newItem, id: Date.now() };
          const listWithNew = [...currentList, fallbackItem];
          setLocalItemsState({ key: itemsKey, items: listWithNew });
          localStorage.setItem(itemsKey, JSON.stringify(listWithNew));
        });
    }
  };

  const deleteItem = (id) => {
    if (isOtherUser) return;
    const currentList = items;
    const updated = currentList.filter((item) => item.id !== id);
    setLocalItemsState({ key: itemsKey, items: updated });
    localStorage.setItem(itemsKey, JSON.stringify(updated));
  };

  return {
    profile,
    isOtherUser,
    chartData,
    loading: isOtherUser ? otherUserLoading || otherHistoryLoading : false,
    updateProfile,
    items,
    itemsLoading,
    itemsError,
    addItem,
    deleteItem,
  };
}
