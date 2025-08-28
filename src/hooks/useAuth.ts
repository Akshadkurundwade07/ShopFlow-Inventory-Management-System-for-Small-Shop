import { useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignUpData } from '../types/auth';
import { authService } from '../services/authService';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const user = await authService.login(credentials);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const user = await authService.signUp(data);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    signUp,
    logout,
  };
}