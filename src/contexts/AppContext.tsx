import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// User roles
export type UserRole = 'CEO' | 'Admin' | 'Trưởng BU' | 'Nhân viên';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  buId: string | null; // null for CEO/Admin, specific BU ID for others
  buName: string | null;
}

// BU interface
export interface BusinessUnit {
  id: string;
  name: string;
}

// App context interface
interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  selectedBU: string;
  setSelectedBU: (buId: string) => void;
  availableBUs: BusinessUnit[];
  canSelectBU: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock users for testing - Replace with real auth
export const mockUsers = {
  ceo: {
    id: 'user_001',
    name: 'Nguyễn Văn CEO',
    email: 'ceo@bluebolt.vn',
    role: 'CEO' as UserRole,
    avatar: null,
    buId: null,
    buName: null,
  },
  admin: {
    id: 'user_002',
    name: 'Trần Thị Admin',
    email: 'admin@bluebolt.vn',
    role: 'Admin' as UserRole,
    avatar: null,
    buId: null,
    buName: null,
  },
  buManager1: {
    id: 'user_003',
    name: 'Lê Văn Manager',
    email: 'manager.software@bluebolt.vn',
    role: 'Trưởng BU' as UserRole,
    avatar: null,
    buId: 'BlueBolt Software',
    buName: 'BlueBolt Software',
  },
  buManager2: {
    id: 'user_004',
    name: 'Phạm Thị Hương',
    email: 'manager.academy@bluebolt.vn',
    role: 'Trưởng BU' as UserRole,
    avatar: null,
    buId: 'BlueBolt Academy',
    buName: 'BlueBolt Academy',
  },
  buManager3: {
    id: 'user_005',
    name: 'Hoàng Văn Nam',
    email: 'manager.services@bluebolt.vn',
    role: 'Trưởng BU' as UserRole,
    avatar: null,
    buId: 'BlueBolt Services',
    buName: 'BlueBolt Services',
  },
  employee: {
    id: 'user_006',
    name: 'Vũ Thị Nhân viên',
    email: 'employee@bluebolt.vn',
    role: 'Nhân viên' as UserRole,
    avatar: null,
    buId: 'BlueBolt Software',
    buName: 'BlueBolt Software',
  },
};

// All Business Units
export const allBusinessUnits: BusinessUnit[] = [
  { id: 'all', name: 'Tất cả BU' },
  { id: 'BlueBolt Software', name: 'BlueBolt Software' },
  { id: 'BlueBolt Academy', name: 'BlueBolt Academy' },
  { id: 'BlueBolt Services', name: 'BlueBolt Services' },
  { id: 'BlueBolt R&D', name: 'BlueBolt R&D' },
  { id: 'BlueBolt G&A', name: 'BlueBolt G&A' },
];

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { currentUser: authUser } = useAuth();
  
  // Use authenticated user from AuthContext
  const [currentUser, setCurrentUser] = useState<User>(authUser || mockUsers.ceo);
  
  // Update currentUser when authUser changes
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);
  
  // Selected BU - defaults based on user role
  const [selectedBU, setSelectedBU] = useState<string>(() => {
    // If user is CEO or Admin, default to "all"
    if (currentUser.role === 'CEO' || currentUser.role === 'Admin') {
      return 'all';
    }
    // If user is BU Manager or Employee, default to their BU
    return currentUser.buId || 'all';
  });

  // Update selectedBU when user changes
  useEffect(() => {
    if (currentUser.role === 'CEO' || currentUser.role === 'Admin') {
      setSelectedBU('all');
    } else {
      setSelectedBU(currentUser.buId || 'all');
    }
  }, [currentUser]);

  // Check if user can select different BUs
  const canSelectBU = currentUser.role === 'CEO' || currentUser.role === 'Admin';

  // Get available BUs based on user role
  const availableBUs = canSelectBU 
    ? allBusinessUnits 
    : allBusinessUnits.filter(bu => bu.id === currentUser.buId);

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    selectedBU,
    setSelectedBU,
    availableBUs,
    canSelectBU,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}