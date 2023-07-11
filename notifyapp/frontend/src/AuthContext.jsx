import React, { createContext, useState } from 'react';


export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  
  const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
