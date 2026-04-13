import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);

  // Seed admin account + restore session on mount
  useEffect(() => {
    // Seed test admin if not exists
    const users = JSON.parse(localStorage.getItem('vibee_users') || '[]');
    if (!users.find(u => u.email === 'admin@joyb.vn')) {
      users.push({
        id: 'ADMIN001',
        name: 'Super Admin',
        email: 'admin@joyb.vn',
        phone: '0900000000',
        password: 'admin123',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z'
      });
      localStorage.setItem('vibee_users', JSON.stringify(users));
    }

    const saved = localStorage.getItem('vibee_user');
    if (saved) {
      try { 
        const u = JSON.parse(saved);
        setUser(u); 
        setCoins(parseInt(localStorage.getItem(`vibee_coins_${u.id}`) || '0', 10));
      } catch {}
    }
    setLoading(false);
  }, []);

  // Get all registered users
  const getUsers = () => JSON.parse(localStorage.getItem('vibee_users') || '[]');

  // Register new user
  const register = async ({ name, email, phone, password, role = 'user' }) => {
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: role.toUpperCase() })
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };

      const userSession = data.user;
      setUser(userSession);
      localStorage.setItem('vibee_user', JSON.stringify(userSession));
      return { ok: true, user: userSession };
    } catch (err) {
      return { ok: false, error: 'Lỗi kết nối server' };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };

      const userSession = data.user;
      setUser(userSession);
      localStorage.setItem('vibee_user', JSON.stringify(userSession));
      return { ok: true, user: userSession };
    } catch (err) {
      return { ok: false, error: 'Lỗi kết nối server' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setCoins(0);
    localStorage.removeItem('vibee_user');
  };

  const updateCoins = (amount) => {
    if (!user) return;
    const newCoins = Math.max(0, coins + amount);
    setCoins(newCoins);
    localStorage.setItem(`vibee_coins_${user.id}`, newCoins.toString());
  };

  // Update user profile
  const updateUser = (updates) => {
    if (!user) return;
    const newSession = { ...user, ...updates };
    setUser(newSession);
    localStorage.setItem('vibee_user', JSON.stringify(newSession));
    // Also update in the users list
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('vibee_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, coins, updateCoins, updateUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
