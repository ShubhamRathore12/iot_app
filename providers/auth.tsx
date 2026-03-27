import { apiService } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Utility function to safely store values in AsyncStorage
const safeStoreItem = async (key: string, value: any) => {
  try {
    if (value === null || value === undefined) {
      await AsyncStorage.removeItem(key);
      return;
    }
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error storing item:', error);
  }
};

// Utility function to safely get and parse values from AsyncStorage
const safeGetItem = async <T,>(key: string, defaultValue: T): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null || value === undefined || value === 'undefined') {
      return defaultValue;
    }
    // Try to parse as JSON, if it fails, return the string value
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return defaultValue;
  }
};

interface User {
  id: string | number;
  username: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  accountType?: string;
  phoneNumber?: string;
  company?: string;
  monitorAccess?: string;
  created_at?: string;
  location?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  monitorAccess: string[];
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  getFullLoginResponse: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Parse monitorAccess from user data into a lowercase array (blacklist)
  const monitorAccess = React.useMemo(() => {
    if (!user?.monitorAccess || typeof user.monitorAccess !== 'string') return [];
    return user.monitorAccess.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  }, [user?.monitorAccess]);

  const getFullLoginResponse = async () => {
    try {
      const response = await AsyncStorage.getItem('full_login_response');
      return response && response !== 'undefined' ? JSON.parse(response) : null;
    } catch (error) {
      console.error('Error getting full login response:', error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      
      // Get token and user data safely
      const token = await safeGetItem<string | null>(AUTH_TOKEN_KEY, null);
      const userData = await safeGetItem<any>(USER_DATA_KEY, null);

      console.log('Stored data - token:', !!token, 'user:', !!userData);

      if (token) {
        console.log('Valid token found, setting authenticated');
        setIsAuthenticated(true);
        if (userData) {
          setUser(userData);
          console.log('User data set successfully');
        }
      } else {
        console.log('No valid auth token found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear any corrupted data
      try {
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      } catch (clearError) {
        console.error('Error clearing auth data:', clearError);
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      console.log('Auth check complete, setting loading to false');
      setLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    console.log('Starting login process...');
    setLoading(true);

    try {
      // Call the API login endpoint
      console.log('Calling login API...');
      const response = await apiService.login(credentials);
      console.log('Login API response:', response);

      // Extract token and user data from response
      const { token, user: userData } = response;

      // If no token exists, try to use firstName or username from user data as token equivalent
      const authValue = token || (userData && (userData as any)?.firstName) || (userData && (userData as any)?.username) || (userData && (userData as any)?.name) || null;

      console.log('Final Auth value determined:', authValue);
      console.log('Final User data to be stored:', userData);

      if (!authValue) {
        throw new Error('Login failed: The server response did not contain an authentication token or a valid user identifier.');
      }

      // Store auth data in AsyncStorage using safe storage
      console.log('Commencing safe storage of auth data...');
      await safeStoreItem(AUTH_TOKEN_KEY, authValue);
      await safeStoreItem(USER_DATA_KEY, userData);

      // Update state - ensure both are set before proceeding
      console.log('Setting authentication state...');
      setIsAuthenticated(true);
      setUser(userData);
      
      // Small delay to ensure state is properly synchronized on Android
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Login process completed successfully');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Throw the error to be caught by the UI
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('unauthorized')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('Network Error')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      } else {
        throw new Error(errorMessage || 'An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Get the current token to call logout API
      const token = await AsyncStorage.getItem('auth_token');

      // Note: No validate token API available
      // Proceed with local logout only

      // Clear stored data
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);

      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = React.useMemo(() => ({
    isAuthenticated,
    user,
    monitorAccess,
    login,
    logout,
    loading,
    getFullLoginResponse
  }), [isAuthenticated, user, monitorAccess, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
