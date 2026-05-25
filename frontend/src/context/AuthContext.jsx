import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Usuarios demo locales — no requieren backend.
 * Formato: { email, password, name, role }
 * role: 'student' | 'admin'
 */
export const LOCAL_USERS = [
  {
    id: 'local-1',
    email: 'estudiante@demo.com',
    password: 'demo1234',
    name: 'Estudiante Demo',
    role: 'student',
    avatar: 'E',
  },
  {
    id: 'local-2',
    email: 'admin@demo.com',
    password: 'admin1234',
    name: 'Administrador',
    role: 'admin',
    avatar: 'A',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('localUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const found = LOCAL_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      throw new Error('Usuario o contraseña incorrectos.');
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('localUser', JSON.stringify(safeUser));
    // Compatibilidad con código que lee localStorage directamente
    localStorage.setItem('studentName', safeUser.name);
    localStorage.setItem('studentId', safeUser.id);
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('localUser');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentId');
    localStorage.removeItem('token');
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
