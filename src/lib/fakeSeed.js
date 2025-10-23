import { storage, STORAGE_KEYS } from './persist';
import { GRADE_SCALE } from './grade';

// Generate seed data if none exists
export const seedData = () => {
  // Check if data already exists
  if (storage.get(STORAGE_KEYS.STUDENTS)?.length > 0) {
    return;
  }

  // Seed Students
  const students = [
    {
      id: 'student_1',
      name: 'John Doe',
      roll: 'CS21001',
      regNo: 'REG21001',
      department: 'Computer Science',
      batch: '2021',
      email: 'john.doe@student.edu',
      phone: '+1234567890',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_2',
      name: 'Jane Smith',
      roll: 'CS21002',
      regNo: 'REG21002',
      department: 'Computer Science',
      batch: '2021',
      email: 'jane.smith@student.edu',
      phone: '+1234567891',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_3',
      name: 'Michael Johnson',
      roll: 'CS21003',
      regNo: 'REG21003',
      department: 'Computer Science',
      batch: '2021',
      email: 'michael.johnson@student.edu',
      phone: '+1234567892',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_4',
      name: 'Sarah Wilson',
      roll: 'CS21004',
      regNo: 'REG21004',
      department: 'Computer Science',
      batch: '2021',
      email: 'sarah.wilson@student.edu',
      phone: '+1234567893',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_5',
      name: 'David Brown',
      roll: 'CS21005',
      regNo: 'REG21005',
      department: 'Computer Science',
      batch: '2021',
      email: 'david.brown@student.edu',
      phone: '+1234567894',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Teachers
  const teachers = [
    {
      id: 'teacher_1',
      name: 'Dr. Alice Johnson',
      email: 'alice.johnson@university.edu',
      department: 'Computer Science',
      designation: 'Professor',
      phone: '+1234567900',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_2',
      name: 'Prof. Robert Davis',
      email: 'robert.davis@university.edu',
      department: 'Computer Science',
      designation: 'Associate Professor',
      phone: '+1234567901',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_3',
      name: 'Dr. Emily Chen',
      email: 'emily.chen@university.edu',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      phone: '+1234567902',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Subjects
  const subjects = [
    {
      id: 'subject_1',
      code: 'CS101',
      title: 'Introduction to Computer Science',
      credit: 3.0,
      department: 'Computer Science',
      semester: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_2',
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      credit: 3.5,
      department: 'Computer Science',
      semester: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_3',
      code: 'CS301',
      title: 'Database Management Systems',
      credit: 3.0,
      department: 'Computer Science',
      semester: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_4',
      code: 'CS401',
      title: 'Software Engineering',
      credit: 3.5,
      department: 'Computer Science',
      semester: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_5',
      code: 'MATH101',
      title: 'Calculus I',
      credit: 3.0,
      department: 'Mathematics',
      semester: 1,
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Classes
  const classes = [
    {
      id: 'class_1',
      name: 'CS 2021 Batch A',
      department: 'Computer Science',
      semester: 4,
      subjects: ['subject_1', 'subject_2', 'subject_4'],
      teacherId: 'teacher_1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_2',
      name: 'CS 2021 Batch B',
      department: 'Computer Science',
      semester: 3,
      subjects: ['subject_1', 'subject_3', 'subject_5'],
      teacherId: 'teacher_2',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Exams
  const exams = [
    {
      id: 'exam_1',
      title: 'Mid Term Examination - Spring 2024',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      semester: 4,
      department: 'Computer Science',
      subjects: ['subject_1', 'subject_2', 'subject_4'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_2',
      title: 'Final Examination - Spring 2024',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      semester: 4,
      department: 'Computer Science',
      subjects: ['subject_1', 'subject_2', 'subject_3', 'subject_4'],
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Assignments
  const assignments = [
    {
      id: 'assignment_1',
      title: 'Data Structure Implementation',
      subjectId: 'subject_2',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      description: 'Implement basic data structures including stack, queue, and linked list',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_2',
      title: 'Database Design Project',
      subjectId: 'subject_3',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      description: 'Design and implement a complete database system for a library management system',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Announcements
  const announcements = [
    {
      id: 'announcement_1',
      title: 'Mid-term Examination Schedule Released',
      body: 'The schedule for mid-term examinations has been published. Please check your respective portals for detailed timing and venue information.',
      audience: 'students',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'announcement_2',
      title: 'Faculty Meeting - Department of Computer Science',
      body: 'All faculty members are requested to attend the department meeting scheduled for next week. Please confirm your attendance.',
      audience: 'teachers',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 'announcement_3',
      title: 'Library Hours Extended During Exam Period',
      body: 'The university library will remain open until 11 PM during the examination period to facilitate student preparations.',
      audience: 'all',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Results
  const results = [
    {
      id: 'result_1',
      studentId: 'student_1',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 85 },
        { subjectId: 'subject_2', total: 100, obtained: 78 },
        { subjectId: 'subject_4', total: 100, obtained: 92 }
      ],
      gpa: 3.67,
      cgpa: 3.67,
      grade: 'B+',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    },
    {
      id: 'result_2',
      studentId: 'student_2',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 95 },
        { subjectId: 'subject_2', total: 100, obtained: 88 },
        { subjectId: 'subject_4', total: 100, obtained: 90 }
      ],
      gpa: 3.92,
      cgpa: 3.92,
      grade: 'A',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    }
  ];

  // Seed Settings
  const settings = {
    theme: 'light',
    gradeScale: GRADE_SCALE
  };

  // Save all seed data to localStorage
  storage.set(STORAGE_KEYS.STUDENTS, students);
  storage.set(STORAGE_KEYS.TEACHERS, teachers);
  storage.set(STORAGE_KEYS.SUBJECTS, subjects);
  storage.set(STORAGE_KEYS.CLASSES, classes);
  storage.set(STORAGE_KEYS.EXAMS, exams);
  storage.set(STORAGE_KEYS.ASSIGNMENTS, assignments);
  storage.set(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  storage.set(STORAGE_KEYS.RESULTS, results);
  storage.set(STORAGE_KEYS.SETTINGS, settings);

  console.log('Seed data initialized successfully!');
};
