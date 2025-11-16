import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Восстановление пользователя из localStorage при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Вход
  const loginUser = (userData) => {
    const isAdmin = userData.email === 'admin1@gmail.com'; // Проверка на администратора
    setUser({ ...userData, isAdmin });
    localStorage.setItem('user', JSON.stringify({ ...userData, isAdmin }));
  };

  // Выход
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Добавляем типизацию пропсов
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};