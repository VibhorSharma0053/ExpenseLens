import React, { useState, createContext } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Mock login function
  const login = (email, password) => {
    console.log("Logging in with", email, password);
    // In a real app, you'd call your API here
    setToken("fake-jwt-token"); 
    setUser({ email: email, fullName: "Demo User" });
    return true; // Simulate successful login
  };

  // Mock signup function
  const signup = (fullName, email, password) => {
    console.log("Signing up with", fullName, email, password);
    // In a real app, you'd call your API here
    return true; // Simulate successful signup
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
