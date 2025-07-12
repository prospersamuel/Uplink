// File: src/context/AppContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import Login from '../pages/Login/Login'

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showLogin, setShowLogin] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, openLogin, closeLogin }}>
      {children}
      {showLogin && <Login onClose={closeLogin} />}
    </AppContext.Provider>
  );
};
