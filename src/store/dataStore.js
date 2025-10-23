import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../lib/persist';
import { calculateGPA, calculateCGPA } from '../lib/grade';

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useDataStore = create((set, get) => ({
  // State
  students: [],
  teachers: [],
  subjects: [],
  classes: [],
  exams: [],
  assignments: [],
  announcements: [],
  results: [],
  settings: {
    theme: 'light',
    gradeScale: [] // Will be populated from grade.js
  },

  // Generic CRUD operations
  create: (entityType, data) => {
    const newItem = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const currentData = get()[entityType] || [];
    const updatedData = [...currentData, newItem];
    
    set({ [entityType]: updatedData });
    storage.set(STORAGE_KEYS[entityType.toUpperCase()], updatedData);
    
    return newItem;
  },

  update: (entityType, id, data) => {
    const currentData = get()[entityType] || [];
    const updatedData = currentData.map(item =>
      item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
    );
    
    set({ [entityType]: updatedData });
    storage.set(STORAGE_KEYS[entityType.toUpperCase()], updatedData);
    
    return updatedData.find(item => item.id === id);
  },

  delete: (entityType, id) => {
    const currentData = get()[entityType] || [];
    const updatedData = currentData.filter(item => item.id !== id);
    
    set({ [entityType]: updatedData });
    storage.set(STORAGE_KEYS[entityType.toUpperCase()], updatedData);
    
    return true;
  },

  // Specific entity operations
  // Students
  createStudent: (studentData) => {
    return get().create('students', studentData);
  },

  updateStudent: (id, studentData) => {
    return get().update('students', id, studentData);
  },

  deleteStudent: (id) => {
    // Also delete related results
    const results = get().results;
    const updatedResults = results.filter(result => result.studentId !== id);
    set({ results: updatedResults });
    storage.set(STORAGE_KEYS.RESULTS, updatedResults);
    
    return get().delete('students', id);
  },

  getStudentById: (id) => {
    return get().students.find(student => student.id === id);
  },

  // Teachers
  createTeacher: (teacherData) => {
    return get().create('teachers', teacherData);
  },

  updateTeacher: (id, teacherData) => {
    return get().update('teachers', id, teacherData);
  },

  deleteTeacher: (id) => {
    return get().delete('teachers', id);
  },

  getTeacherById: (id) => {
    return get().teachers.find(teacher => teacher.id === id);
  },

  // Subjects
  createSubject: (subjectData) => {
    return get().create('subjects', subjectData);
  },

  updateSubject: (id, subjectData) => {
    return get().update('subjects', id, subjectData);
  },

  deleteSubject: (id) => {
    return get().delete('subjects', id);
  },

  getSubjectById: (id) => {
    return get().subjects.find(subject => subject.id === id);
  },

  // Classes
  createClass: (classData) => {
    return get().create('classes', classData);
  },

  updateClass: (id, classData) => {
    return get().update('classes', id, classData);
  },

  deleteClass: (id) => {
    return get().delete('classes', id);
  },

  getClassById: (id) => {
    return get().classes.find(cls => cls.id === id);
  },

  // Exams
  createExam: (examData) => {
    return get().create('exams', examData);
  },

  updateExam: (id, examData) => {
    return get().update('exams', id, examData);
  },

  deleteExam: (id) => {
    // Also delete related results
    const results = get().results;
    const updatedResults = results.filter(result => result.examId !== id);
    set({ results: updatedResults });
    storage.set(STORAGE_KEYS.RESULTS, updatedResults);
    
    return get().delete('exams', id);
  },

  getExamById: (id) => {
    return get().exams.find(exam => exam.id === id);
  },

  // Assignments
  createAssignment: (assignmentData) => {
    return get().create('assignments', assignmentData);
  },

  updateAssignment: (id, assignmentData) => {
    return get().update('assignments', id, assignmentData);
  },

  deleteAssignment: (id) => {
    return get().delete('assignments', id);
  },

  getAssignmentById: (id) => {
    return get().assignments.find(assignment => assignment.id === id);
  },

  // Announcements
  createAnnouncement: (announcementData) => {
    return get().create('announcements', announcementData);
  },

  updateAnnouncement: (id, announcementData) => {
    return get().update('announcements', id, announcementData);
  },

  deleteAnnouncement: (id) => {
    return get().delete('announcements', id);
  },

  getAnnouncementById: (id) => {
    return get().announcements.find(announcement => announcement.id === id);
  },

  // Results
  createResult: (resultData) => {
    const { subjects } = get();
    
    // Calculate GPA for this result
    const gpa = calculateGPA(resultData.marks, subjects);
    
    // Get existing results for this student to calculate CGPA
    const existingResults = get().results.filter(r => r.studentId === resultData.studentId);
    const allResults = [...existingResults, { ...resultData, gpa }];
    const cgpa = calculateCGPA(allResults, subjects);
    
    const newResult = {
      ...resultData,
      gpa,
      cgpa
    };
    
    return get().create('results', newResult);
  },

  updateResult: (id, resultData) => {
    const { subjects } = get();
    
    // Calculate GPA for this result
    const gpa = calculateGPA(resultData.marks, subjects);
    
    // Get all results for this student (excluding the one being updated)
    const allResults = get().results.filter(r => r.studentId === resultData.studentId && r.id !== id);
    allResults.push({ ...resultData, id, gpa });
    const cgpa = calculateCGPA(allResults, subjects);
    
    const updatedResult = {
      ...resultData,
      gpa,
      cgpa
    };
    
    return get().update('results', id, updatedResult);
  },

  deleteResult: (id) => {
    return get().delete('results', id);
  },

  getResultById: (id) => {
    return get().results.find(result => result.id === id);
  },

  getResultsByStudentId: (studentId) => {
    return get().results.filter(result => result.studentId === studentId);
  },

  getResultsByExamId: (examId) => {
    return get().results.filter(result => result.examId === examId);
  },

  // Settings
  updateSettings: (settingsData) => {
    const currentSettings = get().settings;
    const updatedSettings = { ...currentSettings, ...settingsData };
    
    set({ settings: updatedSettings });
    storage.set(STORAGE_KEYS.SETTINGS, updatedSettings);
    
    return updatedSettings;
  },

  // Search and filter utilities
  searchEntities: (entityType, query) => {
    if (!query) return get()[entityType] || [];
    
    const entities = get()[entityType] || [];
    const searchFields = {
      students: ['name', 'roll', 'regNo', 'email', 'department'],
      teachers: ['name', 'email', 'department', 'designation'],
      subjects: ['code', 'title', 'department'],
      classes: ['name', 'department'],
      exams: ['title', 'department'],
      assignments: ['title', 'description'],
      announcements: ['title', 'body'],
      results: [] // Results are typically not searched directly
    };
    
    const fields = searchFields[entityType] || [];
    const lowerQuery = query.toLowerCase();
    
    return entities.filter(entity =>
      fields.some(field =>
        entity[field] && entity[field].toString().toLowerCase().includes(lowerQuery)
      )
    );
  },

  // Initialize data from localStorage
  initialize: () => {
    const loadEntity = (key, entityName) => {
      const data = storage.get(key);
      if (data) {
        set({ [entityName]: data });
      }
    };

    loadEntity(STORAGE_KEYS.STUDENTS, 'students');
    loadEntity(STORAGE_KEYS.TEACHERS, 'teachers');
    loadEntity(STORAGE_KEYS.SUBJECTS, 'subjects');
    loadEntity(STORAGE_KEYS.CLASSES, 'classes');
    loadEntity(STORAGE_KEYS.EXAMS, 'exams');
    loadEntity(STORAGE_KEYS.ASSIGNMENTS, 'assignments');
    loadEntity(STORAGE_KEYS.ANNOUNCEMENTS, 'announcements');
    loadEntity(STORAGE_KEYS.RESULTS, 'results');
    loadEntity(STORAGE_KEYS.SETTINGS, 'settings');
  },

  // Get statistics for dashboard
  getStats: () => {
    const state = get();
    return {
      totalStudents: state.students.length,
      totalTeachers: state.teachers.length,
      totalSubjects: state.subjects.length,
      totalClasses: state.classes.length,
      totalExams: state.exams.length,
      totalAssignments: state.assignments.length,
      totalAnnouncements: state.announcements.length,
      totalResults: state.results.length,
    };
  }
}));
