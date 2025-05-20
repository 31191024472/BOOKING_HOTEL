import { createContext, useEffect, useState } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

export const AuthContext = createContext();

/**
 * Cung cấp trạng thái xác thực và thông tin chi tiết người dùng cho ứng dụng.
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
        console.log('Auth check response:', response.userDetails.role);
        if (response.success) {
          setIsAuthenticated(response.success);
          setUserDetails(response.userDetails);
        } else {
          setIsAuthenticated(false);
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    };

    checkAuthStatus();
  }, [authCheckTrigger]);

  const triggerAuthCheck = async () => {
    setAuthCheckTrigger((prev) => !prev);
    // Đợi một chút để đảm bảo state đã được cập nhật
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        setUserDetails,
        userDetails,
        triggerAuthCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};