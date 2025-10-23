// LocalStorage helpers for data persistence
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'rpms_auth_user',
  STUDENTS: 'rpms_students',
  TEACHERS: 'rpms_teachers',
  SUBJECTS: 'rpms_subjects',
  CLASSES: 'rpms_classes',
  EXAMS: 'rpms_exams',
  ASSIGNMENTS: 'rpms_assignments',
  ANNOUNCEMENTS: 'rpms_announcements',
  RESULTS: 'rpms_results',
  SETTINGS: 'rpms_settings'
};
