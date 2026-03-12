import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (userData) => {
    setUser(userData);
  };

  const register = (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      signIn,
      register,
      signOut,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};