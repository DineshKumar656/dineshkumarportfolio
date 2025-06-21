
import { useState, useEffect } from 'react';

export const useEditMode = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user was previously authenticated in this session
    const authStatus = sessionStorage.getItem('portfolio_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticate = (password: string) => {
    // Admin password - change this to your preferred password
    const ADMIN_PASSWORD = 'admin123'; // ⚠️ CHANGE THIS PASSWORD!
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('portfolio_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    sessionStorage.removeItem('portfolio_auth');
  };

  const toggleEditMode = () => {
    if (isAuthenticated) {
      setIsEditMode(prev => !prev);
    }
  };

  return {
    isEditMode,
    isAuthenticated,
    authenticate,
    logout,
    toggleEditMode
  };
};
