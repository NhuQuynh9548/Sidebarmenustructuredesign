import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockUsers } from './AppContext';

// Demo accounts
export interface DemoAccount {
  username: string;
  password: string;
  user: User;
  description: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    username: 'ceo@bluebolt.vn',
    password: 'ceo123',
    user: mockUsers.ceo,
    description: 'CEO - Toàn quyền xem tất cả BU'
  },
  {
    username: 'admin@bluebolt.vn',
    password: 'admin123',
    user: mockUsers.admin,
    description: 'Admin - Toàn quyền xem tất cả BU'
  },
  {
    username: 'manager.software@bluebolt.vn',
    password: 'manager123',
    user: mockUsers.buManager1,
    description: 'Trưởng BU Software - Chỉ xem BU Software'
  },
  {
    username: 'manager.academy@bluebolt.vn',
    password: 'manager123',
    user: mockUsers.buManager2,
    description: 'Trưởng BU Academy - Chỉ xem BU Academy'
  },
  {
    username: 'manager.services@bluebolt.vn',
    password: 'manager123',
    user: mockUsers.buManager3,
    description: 'Trưởng BU Services - Chỉ xem BU Services'
  },
  {
    username: 'employee@bluebolt.vn',
    password: 'employee123',
    user: mockUsers.employee,
    description: 'Nhân viên - Quyền hạn chế theo BU'
  }
];

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Find matching demo account
    const account = demoAccounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      setIsAuthenticated(true);
      setCurrentUser(account.user);
      // Store in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(account.user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };

  // Check localStorage on mount
  React.useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCurrentUser(user);
      } catch (error) {
        // Invalid stored data, clear it
        logout();
      }
    }
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
