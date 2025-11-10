import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../lib/persist';

// Mock users for demonstration
const MOCK_USERS = {
  admin: {
    email: 'admin@rpms.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    id: 'admin_1'
  },
  student: {
    // Use Bangladeshi university CSE student matching seeded data
    email: 'rakib.hasan@university.edu.bd',
    password: 'student123',
    role: 'student',
    name: 'Rakib Hasan',
    id: 'student_1',
    roll: 'CSE23001',
    regNo: 'REG23001',
    department: 'Computer Science & Engineering',
    batch: '2023',
    phone: '+8801711000001'
  }
};

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email, password, role } = credentials;
      const mockUser = MOCK_USERS[role];
      
      if (!mockUser || mockUser.email !== email || mockUser.password !== password) {
        throw new Error('Invalid credentials');
      }
      
      const user = { ...mockUser };
      delete user.password; // Don't store password
      
      // Persist user data
      storage.set(STORAGE_KEYS.AUTH_USER, user);
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return { success: true, user };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.AUTH_USER);
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  updateProfile: (profileData) => {
    const { user } = get();
    if (!user) return { success: false, error: 'Not authenticated' };
    
    const updatedUser = { ...user, ...profileData };
    storage.set(STORAGE_KEYS.AUTH_USER, updatedUser);
    
    set({ user: updatedUser });
    return { success: true, user: updatedUser };
  },

  // Initialize auth state from localStorage
  initialize: () => {
    const savedUser = storage.get(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      set({
        user: savedUser,
        isAuthenticated: true
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user && user.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    const { user } = get();
    return user && user.role === 'admin';
  },

  // Check if user is student
  isStudent: () => {
    const { user } = get();
    return user && user.role === 'student';
  }
}));
