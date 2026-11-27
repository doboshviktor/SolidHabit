import { useState } from 'react';
import { AuthContext } from './auth-context-def';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('user'));
  });

  const [balance, setBalance] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;
    const savedBalance = currentUser ? localStorage.getItem(`user_balance_${currentUser.id}`) : null;
    return savedBalance !== null ? Number(savedBalance) : (currentUser?.balance ?? 1000);
  });

  const [error, setError] = useState(null);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    if (user) localStorage.setItem(`user_balance_${user.id}`, String(newBalance));
  };

  const login = (name, password) => {
    setError(null);
    return fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid name or password');
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          setIsAuthenticated(true);
          const savedBalance = localStorage.getItem(`user_balance_${data.user.id}`);
          setBalance(savedBalance !== null ? Number(savedBalance) : (data.user.balance ?? 1000));
          return true;
        }
        return false;
      })
      .catch((err) => {
        setError(err.message);
        return false;
      });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        balance,
        updateBalance,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
