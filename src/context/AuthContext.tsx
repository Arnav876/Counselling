import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isStudent: boolean;
  savedCollegeIds: string[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: (data: { credential?: string; email?: string; name?: string; avatar?: string }) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  toggleSaveCollege: (collegeId: string) => Promise<boolean>;
  isCollegeSaved: (collegeId: string) => boolean;
  refreshSavedColleges: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const CompareAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('abc_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedCollegeIds, setSavedCollegeIds] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const refreshSavedColleges = useCallback(async () => {
    if (!localStorage.getItem('abc_auth_token')) {
      setSavedCollegeIds([]);
      return;
    }
    try {
      const ids = await authService.getSavedCollegeIds();
      setSavedCollegeIds(ids);
    } catch {
      setSavedCollegeIds([]);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await refreshSavedColleges();
      } else {
        setSavedCollegeIds([]);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshSavedColleges]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginWithGoogle = async (data: { credential?: string; email?: string; name?: string; avatar?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle(data);
      localStorage.setItem('abc_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      await refreshSavedColleges();
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setSavedCollegeIds([]);
      localStorage.removeItem('abc_auth_token');
      setIsLoading(false);
    }
  };

  const toggleSaveCollege = async (collegeId: string): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }

    const isCurrentlySaved = savedCollegeIds.includes(collegeId);

    try {
      if (isCurrentlySaved) {
        await authService.unsaveCollege(collegeId);
        setSavedCollegeIds(prev => prev.filter(id => id !== collegeId));
        return false;
      } else {
        await authService.saveCollege(collegeId);
        setSavedCollegeIds(prev => [...prev, collegeId]);
        return true;
      }
    } catch (err) {
      console.error('Failed to toggle save college:', err);
      throw err;
    }
  };

  const isCollegeSaved = (collegeId: string): boolean => {
    return savedCollegeIds.includes(collegeId);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return (
    <CompareAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isStudent,
        savedCollegeIds,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithGoogle,
        logout,
        toggleSaveCollege,
        isCollegeSaved,
        refreshSavedColleges,
        refreshUser
      }}
    >
      {children}
    </CompareAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(CompareAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
