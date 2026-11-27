import { useState } from 'react';
import { useFetch } from './useFetch';
import { useAuth } from './useAuth';

export function useMarketplace() {
  const { data: serverItems, loading, error } = useFetch('http://localhost:5000/api/marketplace');
  const { user, balance, updateBalance } = useAuth();

  const [boughtIds, setBoughtIds] = useState(() => {
    const saved = localStorage.getItem(`marketplace_bought_ids_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const items = (serverItems || []).map((item) => ({
    ...item,
    unlocked: boughtIds.includes(item.id),
  }));

  const buyItem = (id) => {
    const itemToBuy = items.find((item) => item.id === id);
    if (!itemToBuy || itemToBuy.unlocked) return;

    if (balance < itemToBuy.price) {
      alert('Not enough Nyavchuku balance!');
      return;
    }

    const newBalance = balance - itemToBuy.price;
    updateBalance(newBalance);

    const updatedBoughtIds = [...boughtIds, id];
    setBoughtIds(updatedBoughtIds);
    localStorage.setItem(`marketplace_bought_ids_${user.id}`, JSON.stringify(updatedBoughtIds));
  };

  return {
    balance,
    items,
    loading,
    error,
    buyItem,
  };
}
