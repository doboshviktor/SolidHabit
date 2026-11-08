import { useState } from 'react';
import { mockUser } from '../utils';

const initialItems = [
  { id: 1, title: 'Gym Workout Routine', price: 200, unlocked: false, secret: 'pizza gym' },
  { id: 2, title: 'Spotify  Playlist', price: 200, unlocked: false, secret: 'pizza playlist' },
  { id: 3, title: 'Exam answers', price: 200, unlocked: false, secret: 'pizza exam' },
  { id: 4, title: 'Youtube channel', price: 200, unlocked: false, secret: 'pizza channel' },
  { id: 5, title: 'Morning Routine ', price: 200, unlocked: false, secret: 'pizza routine' },
  { id: 6, title: 'Best Pizza in Town', price: 200, unlocked: false, secret: 'pizza town' },
  { id: 7, title: 'Guide', price: 200, unlocked: false, secret: ' pizza guide' },
  { id: 8, title: 'Book Summary', price: 200, unlocked: false, secret: 'pizza book' },
];

export function useMarketplace() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('user_balance');
    return saved !== null ? Number(saved) : mockUser.balance;
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('marketplace_bought_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [unlockedSecrets, setUnlockedSecrets] = useState(() => {
    const saved = localStorage.getItem('unlocked_secrets');
    return saved ? JSON.parse(saved) : ['Піцерія Колізей'];
  });

  const buyItem = (id) => {
    const itemToBuy = items.find((item) => item.id === id);
    if (!itemToBuy || itemToBuy.unlocked) return;

    if (balance < itemToBuy.price) {
      alert('Not enough balance!');
      return;
    }

    const newBalance = balance - itemToBuy.price;
    setBalance(newBalance);
    localStorage.setItem('user_balance', String(newBalance));

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, unlocked: true } : item
    );
    setItems(updatedItems);
    localStorage.setItem('marketplace_bought_items', JSON.stringify(updatedItems));

    const updatedSecrets = [...unlockedSecrets, itemToBuy.secret || itemToBuy.title];
    setUnlockedSecrets(updatedSecrets);
    localStorage.setItem('unlocked_secrets', JSON.stringify(updatedSecrets));
  };

  return {
    balance,
    items,
    unlockedSecrets,
    buyItem,
  };
}