import React, { createContext, useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

export const AuthContext = createContext();

/**
 * Provides authentication state and user details to the application.
 * @namespace AuthProvider
 * @component
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [authCheckTrigger, setAuthCheckTrigger] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await networkAdapter.get('api/users/auth-user');
        if (response && response.data) {
          setIsAuthenticated(response.data.isAuthenticated);
          setUserDetails(response.data.userDetails);
        } else {
          // If response doesn't have expected structure, assume not authenticated
          setIsAuthenticated(false);
          setUserDetails(null);
        }
      } catch (error) {
        // If request fails (e.g., token expired, network error), reset auth state
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    };

    checkAuthStatus();
  }, [authCheckTrigger]);

  const triggerAuthCheck = () => {
    setAuthCheckTrigger((prev) => !prev);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userDetails, triggerAuthCheck }}
    >
      {children}
    </AuthContext.Provider>
  );
};
