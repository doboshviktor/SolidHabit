import { useState } from 'react';
import { useFetch } from './useFetch';
import { mockUser } from '../utils';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : mockUser;
  });

  const { data: fetchedItems, loading: itemsLoading, error: itemsError } = useFetch('/data/marketplaceItems.json');

  const [localItems, setLocalItems] = useState(() => {
    const saved = localStorage.getItem('marketplace_items');
    return saved ? JSON.parse(saved) : null;
  });

  const items = localItems ?? (fetchedItems || []);

  const updateProfile = (field, value) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('profile', JSON.stringify(updated));
      return updated;
    });
  };

  const addItem = (title, price, description = '', id = null) => {
    const currentList = localItems ?? (fetchedItems || []);
    let updated;

    if (id) {
      updated = currentList.map((item) =>
        item.id === id
          ? { ...item, title: title || item.title, price: Number(price) || item.price, description }
          : item
      );
    } else {
      const newItem = {
        id: Date.now(),
        title: title || 'New Item',
        price: Number(price) || 100,
        description,
      };
      updated = [...currentList, newItem];
    }

    setLocalItems(updated);
    localStorage.setItem('marketplace_items', JSON.stringify(updated));
  };

  const deleteItem = (id) => {
    const currentList = localItems ?? (fetchedItems || []);
    const updated = currentList.filter((item) => item.id !== id);
    setLocalItems(updated);
    localStorage.setItem('marketplace_items', JSON.stringify(updated));
  };

  return {
    profile,
    updateProfile,
    items,
    itemsLoading,
    itemsError,
    addItem,
    deleteItem,
  };
}