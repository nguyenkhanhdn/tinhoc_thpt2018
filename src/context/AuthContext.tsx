import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  switchDemoRole: (role: UserRole) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'user_student_1',
    username: 'hocsinh12',
    fullName: 'Nguyễn Minh Quân',
    birthDate: '2007-05-15',
    email: 'minhquan.tin12@gmail.com',
    phone: '0912345678',
    gender: 'Nam',
    province: 'Hà Nội',
    password: '123',
    role: 'student',
    targetScore: 9.5,
    track: 'BOTH',
    createdAt: '2025-01-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_teacher_1',
    username: 'giaovien_tin',
    fullName: 'Thầy Lê Hoàng Long',
    birthDate: '1982-10-20',
    email: 'hoanglong.gv@thpt.edu.vn',
    phone: '0987654321',
    gender: 'Nam',
    province: 'Đà Nẵng',
    password: '123',
    role: 'teacher',
    createdAt: '2024-09-01',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_active_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  useEffect(() => {
    localStorage.setItem('tin_hoc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tin_hoc_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tin_hoc_active_user');
    }
  }, [currentUser]);

  const login = async (username: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (!user) {
      return { success: false, message: 'Tên đăng nhập không tồn tại trên hệ thống.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, message: 'Mật khẩu không chính xác.' };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string }> => {
    const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase().trim());
    if (existing) {
      return { success: false, message: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.' };
    }

    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

  const switchDemoRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      register,
      logout,
      updateProfile,
      switchDemoRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
