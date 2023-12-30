import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('accessToken');
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn'); // Get isLoggedIn from localStorage

  const [accessToken, setAccessToken] = useState(storedToken || '');
  const [userData, setUserData] = useState(storedUserData || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedIsLoggedIn); // Convert to boolean

  useEffect(() => {
    // Set isLoggedIn based on the presence of accessToken
    setIsLoggedIn(!!storedToken);
  }, [storedToken]);

  const login = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn to true
    setAccessToken(token);
    setUserData(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn'); // Remove isLoggedIn
    setAccessToken('');
    setUserData(null);
    setIsLoggedIn(false);
  };
  
  console.log("accessToken is", accessToken); 
  console.log("setUserData is", userData); 
  console.log("isLoggedIn is", isLoggedIn); 
  
  return (
    <AuthContext.Provider value={{ accessToken, userData, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext; 
