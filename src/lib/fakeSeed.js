import { storage, STORAGE_KEYS } from './persist';
import { GRADE_SCALE } from './grade';

// Generate seed data if none exists
export const seedData = () => {
  // Load existing data (if any) for additive seeding
  const existing = {
    students: storage.get(STORAGE_KEYS.STUDENTS) || [],
    teachers: storage.get(STORAGE_KEYS.TEACHERS) || [],
    subjects: storage.get(STORAGE_KEYS.SUBJECTS) || [],
    classes: storage.get(STORAGE_KEYS.CLASSES) || [],
    exams: storage.get(STORAGE_KEYS.EXAMS) || [],
    assignments: storage.get(STORAGE_KEYS.ASSIGNMENTS) || [],
    announcements: storage.get(STORAGE_KEYS.ANNOUNCEMENTS) || [],
    results: storage.get(STORAGE_KEYS.RESULTS) || [],
    settings: storage.get(STORAGE_KEYS.SETTINGS) || null,
  };

  const mergeById = (arr, newItems) => {
    const ids = new Set(arr.map(i => i.id));
    return [...arr, ...newItems.filter(i => !ids.has(i.id))];
  };

  // Seed Students
  const students = [
    {
      id: 'student_1',
      name: 'Rakib Hasan',
      roll: 'CSE23001',
      regNo: 'REG23001',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'rakib.hasan@university.edu.bd',
      phone: '+8801711000001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_2',
      name: 'Mim Chowdhury',
      roll: 'CSE23002',
      regNo: 'REG23002',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'mim.chowdhury@university.edu.bd',
      phone: '+8801711000002',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_3',
      name: 'Sabbir Hossain',
      roll: 'CSE23003',
      regNo: 'REG23003',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'sabbir.hossain@university.edu.bd',
      phone: '+8801711000003',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_4',
      name: 'Tasnim Jahan',
      roll: 'CSE23004',
      regNo: 'REG23004',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'tasnim.jahan@university.edu.bd',
      phone: '+8801711000004',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_5',
      name: 'Arif Mahmud',
      roll: 'CSE23005',
      regNo: 'REG23005',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'arif.mahmud@university.edu.bd',
      phone: '+8801711000005',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_6',
      name: 'Nusrat Jahan',
      roll: 'CSE23006',
      regNo: 'REG23006',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'nusrat.jahan@university.edu.bd',
      phone: '+8801711000006',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_7',
      name: 'Mahfuz Rahman',
      roll: 'CSE23007',
      regNo: 'REG23007',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'mahfuz.rahman@university.edu.bd',
      phone: '+8801711000007',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_8',
      name: 'Aysha Akter',
      roll: 'CSE23008',
      regNo: 'REG23008',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'aysha.akter@university.edu.bd',
      phone: '+8801711000008',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_9',
      name: 'Shanto Islam',
      roll: 'CSE23009',
      regNo: 'REG23009',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'shanto.islam@university.edu.bd',
      phone: '+8801711000009',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_10',
      name: 'Faria Tasnim',
      roll: 'CSE23010',
      regNo: 'REG23010',
      department: 'Computer Science & Engineering',
      batch: '2023',
      email: 'faria.tasnim@university.edu.bd',
      phone: '+8801711000010',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Teachers
  const teachers = [
    {
      id: 'teacher_1',
      name: 'Dr. Kamrul Hasan',
      email: 'kamrul.hasan@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      phone: '+8801712000001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_2',
      name: 'Engr. Farzana Rahim',
      email: 'farzana.rahim@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      phone: '+8801712000002',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_3',
      name: 'Dr. Ashfaq Mahmud',
      email: 'ashfaq.mahmud@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      phone: '+8801712000003',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_4',
      name: 'Md. Ariful Islam',
      email: 'ariful.islam@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Lecturer',
      phone: '+8801712000004',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_5',
      name: 'Shakila Nahar',
      email: 'shakila.nahar@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Senior Lecturer',
      phone: '+8801712000005',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_6',
      name: 'Dr. Touhidul Karim',
      email: 'touhidul.karim@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      phone: '+8801712000006',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_7',
      name: 'Nusrat Jahan',
      email: 'nusrat.jahan@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Lecturer',
      phone: '+8801712000007',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_8',
      name: 'Md. Sadman Chowdhury',
      email: 'sadman.chowdhury@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      phone: '+8801712000008',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_9',
      name: 'Dr. Fahmida Akter',
      email: 'fahmida.akter@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      phone: '+8801712000009',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_10',
      name: 'Engr. Mahmudur Rahman',
      email: 'mahmudur.rahman@university.edu.bd',
      department: 'Computer Science & Engineering',
      designation: 'Senior Lecturer',
      phone: '+8801712000010',
      createdAt: new Date().toISOString()
    },
  ];


  // Seed Subjects
  const subjects = [
    {
      id: 'subject_1',
      code: 'CSE101',
      title: 'Introduction to Computer Science',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_2',
      code: 'CSE102',
      title: 'Programming in C',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_3',
      code: 'CSE103',
      title: 'Discrete Mathematics',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_4',
      code: 'CSE201',
      title: 'Data Structures',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_5',
      code: 'CSE202',
      title: 'Digital Logic Design',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_6',
      code: 'CSE203',
      title: 'Object Oriented Programming',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_7',
      code: 'CSE301',
      title: 'Database Systems',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_8',
      code: 'CSE302',
      title: 'Computer Architecture',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_9',
      code: 'CSE303',
      title: 'Operating Systems',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'subject_10',
      code: 'CSE304',
      title: 'Computer Networks',
      credit: 3.0,
      department: 'Computer Science & Engineering',
      semester: 3,
      createdAt: new Date().toISOString()
    }
  ];


  // Seed Classes
  const classes = [
    {
      id: 'class_1',
      name: 'CSE 2023 Batch A',
      department: 'Computer Science & Engineering',
      semester: 1,
      subjects: ['subject_1', 'subject_2', 'subject_3'],
      teacherId: 'teacher_1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_2',
      name: 'CSE 2023 Batch B',
      department: 'Computer Science & Engineering',
      semester: 1,
      subjects: ['subject_1', 'subject_2', 'subject_3'],
      teacherId: 'teacher_2',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_3',
      name: 'CSE 2023 Batch A',
      department: 'Computer Science & Engineering',
      semester: 2,
      subjects: ['subject_4', 'subject_5', 'subject_6'],
      teacherId: 'teacher_3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_4',
      name: 'CSE 2023 Batch B',
      department: 'Computer Science & Engineering',
      semester: 2,
      subjects: ['subject_4', 'subject_5', 'subject_6'],
      teacherId: 'teacher_4',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_5',
      name: 'CSE 2022 Batch A',
      department: 'Computer Science & Engineering',
      semester: 3,
      subjects: ['subject_7', 'subject_8', 'subject_9'],
      teacherId: 'teacher_5',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_6',
      name: 'CSE 2022 Batch B',
      department: 'Computer Science & Engineering',
      semester: 3,
      subjects: ['subject_7', 'subject_8', 'subject_9'],
      teacherId: 'teacher_6',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_7',
      name: 'CSE 2022 Batch A',
      department: 'Computer Science & Engineering',
      semester: 4,
      subjects: ['subject_10'],
      teacherId: 'teacher_7',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_8',
      name: 'CSE 2022 Batch B',
      department: 'Computer Science & Engineering',
      semester: 4,
      subjects: ['subject_10'],
      teacherId: 'teacher_8',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_9',
      name: 'CSE 2021 Batch A',
      department: 'Computer Science & Engineering',
      semester: 5,
      subjects: ['subject_3', 'subject_9'],
      teacherId: 'teacher_9',
      createdAt: new Date().toISOString()
    },
    {
      id: 'class_10',
      name: 'CSE 2021 Batch B',
      department: 'Computer Science & Engineering',
      semester: 5,
      subjects: ['subject_4', 'subject_8'],
      teacherId: 'teacher_10',
      createdAt: new Date().toISOString()
    }
  ];


  // Seed Exams
  const exams = [
    {
      id: 'exam_1',
      title: 'Mid Term Examination - Spring 2025',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      semester: 1,
      department: 'Computer Science & Engineering',
      subjects: ['subject_1', 'subject_2', 'subject_3'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_2',
      title: 'Final Examination - Spring 2025',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      semester: 1,
      department: 'Computer Science & Engineering',
      subjects: ['subject_1', 'subject_2', 'subject_3'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_3',
      title: 'Mid Term Examination - Summer 2025',
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 2,
      department: 'Computer Science & Engineering',
      subjects: ['subject_4', 'subject_5', 'subject_6'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_4',
      title: 'Final Examination - Summer 2025',
      date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 2,
      department: 'Computer Science & Engineering',
      subjects: ['subject_4', 'subject_5', 'subject_6'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_5',
      title: 'Mid Term Examination - Fall 2025',
      date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 3,
      department: 'Computer Science & Engineering',
      subjects: ['subject_7', 'subject_8', 'subject_9'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_6',
      title: 'Final Examination - Fall 2025',
      date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 3,
      department: 'Computer Science & Engineering',
      subjects: ['subject_7', 'subject_8', 'subject_9'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_7',
      title: 'Mid Term Examination - Spring 2026',
      date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 4,
      department: 'Computer Science & Engineering',
      subjects: ['subject_10'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_8',
      title: 'Final Examination - Spring 2026',
      date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 4,
      department: 'Computer Science & Engineering',
      subjects: ['subject_10'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_9',
      title: 'Mid Term Examination - Summer 2026',
      date: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 5,
      department: 'Computer Science & Engineering',
      subjects: ['subject_3', 'subject_9'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'exam_10',
      title: 'Final Examination - Summer 2026',
      date: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
      semester: 5,
      department: 'Computer Science & Engineering',
      subjects: ['subject_4', 'subject_8'],
      createdAt: new Date().toISOString()
    }
  ];


  // Seed Assignments
  const assignments = [
    {
      id: 'assignment_1',
      title: 'Data Structure Implementation',
      subjectId: 'subject_4',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      description: 'Implement basic data structures including stack, queue, and linked list.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_2',
      title: 'Sorting Algorithm Analysis',
      subjectId: 'subject_4',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      description: 'Compare the performance of bubble sort, merge sort, and quick sort with input size variation.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_3',
      title: 'C Programming Project',
      subjectId: 'subject_2',
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Build a console-based student result management system in C.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_4',
      title: 'Digital Logic Design Report',
      subjectId: 'subject_5',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Design a full adder circuit and explain its truth table and logic diagram.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_5',
      title: 'Database Table Normalization',
      subjectId: 'subject_7',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Normalize an unstructured dataset into 1NF, 2NF, and 3NF with explanation.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_6',
      title: 'SQL Query Project',
      subjectId: 'subject_7',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Create a mini database and write SQL queries for CRUD operations, joins, and subqueries.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_7',
      title: 'Computer Architecture Presentation',
      subjectId: 'subject_8',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Prepare a presentation explaining the Von Neumann architecture and pipeline processing.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_8',
      title: 'Operating System Scheduling',
      subjectId: 'subject_9',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Simulate FCFS, Round Robin, and Priority scheduling with average waiting time comparison.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_9',
      title: 'Computer Networks Simulation',
      subjectId: 'subject_10',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Simulate a small LAN network using Cisco Packet Tracer and provide topology, IP table, and screenshots.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'assignment_10',
      title: 'Object Oriented Programming Project',
      subjectId: 'subject_6',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Develop an OOP-based project using C++ or Java including class, inheritance, polymorphism, and file handling.',
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
      title: 'Class Routine Updated',
      body: 'The routine for semester 2 has been updated. Some class timings have changed. Please download the updated routine from the portal.',
      audience: 'students',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      id: 'announcement_3',
      title: 'Assignment Submission Reminder',
      body: 'Students of CSE 2023 Batch are reminded to submit their assignments before the due date. Late submissions will not be accepted.',
      audience: 'students',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 'announcement_4',
      title: 'Department Meeting Scheduled',
      body: 'All faculty members are requested to attend the department meeting next Monday at 11:00 AM in the conference room.',
      audience: 'teachers',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_5',
      title: 'New Computer Lab Installed',
      body: 'A new modern computer lab has been installed for CSE students. Lab sessions will begin from next week.',
      audience: 'students',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_6',
      title: 'Holiday Notice – International Mother Language Day',
      body: 'The university will remain closed on February 21st on the occasion of International Mother Language Day.',
      audience: 'all',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_7',
      title: 'Library Due Clearance',
      body: 'Students are requested to clear overdue books and library fines before the final exams.',
      audience: 'students',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_8',
      title: 'Research Proposal Submission',
      body: 'Teachers are requested to submit research proposals for the upcoming funding cycle.',
      audience: 'teachers',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_9',
      title: 'Result Published',
      body: 'Results of the Fall semester have been published. Students can check their results from the academic portal.',
      audience: 'students',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'announcement_10',
      title: 'Seminar on Artificial Intelligence',
      body: 'A seminar on Artificial Intelligence will be held on campus next Thursday. Registration is open for students and faculty.',
      audience: 'all',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Seed Results
  const results = [
    // Student 1 (Rakib Hasan) — multiple semesters and exams
    {
      id: 'result_1',
      studentId: 'student_1',
      examId: 'exam_1', // Sem 1 Mid
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 85 }, // CSE101
        { subjectId: 'subject_2', total: 100, obtained: 78 }, // CSE102
        { subjectId: 'subject_3', total: 100, obtained: 82 }  // CSE103
      ],
      gpa: 3.62,
      cgpa: 3.62,
      grade: 'A-',
      createdAt: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_21',
      studentId: 'student_1',
      examId: 'exam_2', // Sem 1 Final
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 88 },
        { subjectId: 'subject_2', total: 100, obtained: 82 },
        { subjectId: 'subject_3', total: 100, obtained: 86 }
      ],
      gpa: 3.78,
      cgpa: 3.70, // up to Sem 1
      grade: 'A',
      createdAt: new Date(Date.now() - 195 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_22',
      studentId: 'student_1',
      examId: 'exam_3', // Sem 2 Mid
      marks: [
        { subjectId: 'subject_4', total: 100, obtained: 80 }, // Data Structures
        { subjectId: 'subject_5', total: 100, obtained: 75 }, // Digital Logic
        { subjectId: 'subject_6', total: 100, obtained: 85 }  // OOP
      ],
      gpa: 3.60,
      cgpa: 3.67, // up to Sem 2 mid
      grade: 'A-',
      createdAt: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_23',
      studentId: 'student_1',
      examId: 'exam_4', // Sem 2 Final
      marks: [
        { subjectId: 'subject_4', total: 100, obtained: 84 },
        { subjectId: 'subject_5', total: 100, obtained: 79 },
        { subjectId: 'subject_6', total: 100, obtained: 88 }
      ],
      gpa: 3.74,
      cgpa: 3.69, // up to Sem 2
      grade: 'A-',
      createdAt: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_24',
      studentId: 'student_1',
      examId: 'exam_5', // Sem 3 Mid
      marks: [
        { subjectId: 'subject_7', total: 100, obtained: 76 }, // DB
        { subjectId: 'subject_8', total: 100, obtained: 70 }, // Arch
        { subjectId: 'subject_9', total: 100, obtained: 74 }  // OS
      ],
      gpa: 3.30,
      cgpa: 3.61, // up to Sem 3 mid
      grade: 'B+',
      createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_25',
      studentId: 'student_1',
      examId: 'exam_6', // Sem 3 Final
      marks: [
        { subjectId: 'subject_7', total: 100, obtained: 90 },
        { subjectId: 'subject_8', total: 100, obtained: 85 },
        { subjectId: 'subject_9', total: 100, obtained: 88 }
      ],
      gpa: 3.87,
      cgpa: 3.66, // up to Sem 3
      grade: 'A',
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
    },

    // Other students (existing) — keep sample one exam to reduce noise
    {
      id: 'result_2',
      studentId: 'student_2',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 72 },
        { subjectId: 'subject_2', total: 100, obtained: 68 },
        { subjectId: 'subject_3', total: 100, obtained: 70 }
      ],
      gpa: 3.12,
      cgpa: 3.20,
      grade: 'B',
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_3',
      studentId: 'student_3',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 94 },
        { subjectId: 'subject_2', total: 100, obtained: 88 },
        { subjectId: 'subject_3', total: 100, obtained: 90 }
      ],
      gpa: 3.92,
      cgpa: 3.85,
      grade: 'A',
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_4',
      studentId: 'student_4',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 60 },
        { subjectId: 'subject_2', total: 100, obtained: 58 },
        { subjectId: 'subject_3', total: 100, obtained: 65 }
      ],
      gpa: 2.65,
      cgpa: 2.70,
      grade: 'C+',
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_5',
      studentId: 'student_5',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 90 },
        { subjectId: 'subject_2', total: 100, obtained: 84 },
        { subjectId: 'subject_3', total: 100, obtained: 89 }
      ],
      gpa: 3.85,
      cgpa: 3.75,
      grade: 'A-',
      createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_6',
      studentId: 'student_6',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 50 },
        { subjectId: 'subject_2', total: 100, obtained: 45 },
        { subjectId: 'subject_3', total: 100, obtained: 55 }
      ],
      gpa: 2.10,
      cgpa: 2.20,
      grade: 'C',
      createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_7',
      studentId: 'student_7',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 96 },
        { subjectId: 'subject_2', total: 100, obtained: 92 },
        { subjectId: 'subject_3', total: 100, obtained: 94 }
      ],
      gpa: 4.00,
      cgpa: 3.95,
      grade: 'A+',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_8',
      studentId: 'student_8',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 78 },
        { subjectId: 'subject_2', total: 100, obtained: 74 },
        { subjectId: 'subject_3', total: 100, obtained: 82 }
      ],
      gpa: 3.35,
      cgpa: 3.30,
      grade: 'B+',
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_9',
      studentId: 'student_9',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 88 },
        { subjectId: 'subject_2', total: 100, obtained: 90 },
        { subjectId: 'subject_3', total: 100, obtained: 85 }
      ],
      gpa: 3.76,
      cgpa: 3.70,
      grade: 'A-',
      createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'result_10',
      studentId: 'student_10',
      examId: 'exam_1',
      marks: [
        { subjectId: 'subject_1', total: 100, obtained: 40 },
        { subjectId: 'subject_2', total: 100, obtained: 42 },
        { subjectId: 'subject_3', total: 100, obtained: 38 }
      ],
      gpa: 1.80,
      cgpa: 1.90,
      grade: 'D',
      createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];


  // Extra Bangladeshi university-flavoured data (sessions, departments, semesters)
  const extraStudents = [
    {
      id: 'student_bd_rahim_cse_2021',
      name: 'Md. Rahim Uddin',
      roll: 'CSE210101',
      regNo: 'REG210101',
      department: 'Computer Science & Engineering',
      batch: '2021-22',
      email: 'rahim.uddin@university.edu.bd',
      phone: '+8801713000101',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_bd_rahim_eee_2022',
      name: 'Md. Rahim Uddin',
      roll: 'EEE220201',
      regNo: 'REG220201',
      department: 'Electrical & Electronic Engineering',
      batch: '2022-23',
      email: 'rahim.uddin2@university.edu.bd',
      phone: '+8801713000202',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_bd_rahim_bba_2023',
      name: 'Md. Rahim Uddin',
      roll: 'BBA230301',
      regNo: 'REG230301',
      department: 'Business Administration',
      batch: '2023-24',
      email: 'rahim.uddin3@university.edu.bd',
      phone: '+8801713000303',
      createdAt: new Date().toISOString()
    }
  ];

  const extraTeachers = [
    {
      id: 'teacher_11',
      name: 'Dr. A.K.M. Saiful Islam',
      email: 'saiful.islam@university.edu.bd',
      department: 'Electrical & Electronic Engineering',
      designation: 'Professor',
      phone: '+8801712000011',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_12',
      name: 'Ms. Farzana Yasmin',
      email: 'farzana.yasmin@university.edu.bd',
      department: 'Business Administration',
      designation: 'Lecturer',
      phone: '+8801712000012',
      createdAt: new Date().toISOString()
    },
    {
      id: 'teacher_13',
      name: 'Engr. Tanvir Ahmed',
      email: 'tanvir.ahmed@university.edu.bd',
      department: 'Electrical & Electronic Engineering',
      designation: 'Assistant Professor',
      phone: '+8801712000013',
      createdAt: new Date().toISOString()
    }
  ];

  const extraSubjects = [
    { id: 'subject_11', code: 'EEE101', title: 'Basic Electrical Engineering', credit: 3.0, department: 'Electrical & Electronic Engineering', semester: 1, createdAt: new Date().toISOString() },
    { id: 'subject_12', code: 'EEE102', title: 'Circuit Theory', credit: 3.0, department: 'Electrical & Electronic Engineering', semester: 2, createdAt: new Date().toISOString() },
    { id: 'subject_13', code: 'BBA101', title: 'Principles of Management', credit: 3.0, department: 'Business Administration', semester: 1, createdAt: new Date().toISOString() },
    { id: 'subject_14', code: 'BBA102', title: 'Financial Accounting', credit: 3.0, department: 'Business Administration', semester: 1, createdAt: new Date().toISOString() },
    { id: 'subject_15', code: 'CIV101', title: 'Engineering Drawing', credit: 2.0, department: 'Civil Engineering', semester: 1, createdAt: new Date().toISOString() },
    { id: 'subject_16', code: 'MAT111', title: 'Calculus I', credit: 3.0, department: 'Mathematics', semester: 1, createdAt: new Date().toISOString() }
  ];

  const extraClasses = [
    { id: 'class_11', name: 'EEE Session 2021-22 Batch A', department: 'Electrical & Electronic Engineering', semester: 1, subjects: ['subject_11', 'subject_16'], teacherId: 'teacher_11', createdAt: new Date().toISOString() },
    { id: 'class_12', name: 'BBA Session 2023-24 Batch A', department: 'Business Administration', semester: 1, subjects: ['subject_13', 'subject_14'], teacherId: 'teacher_12', createdAt: new Date().toISOString() }
  ];

  const extraExams = [
    { id: 'exam_11', title: 'Mid Term - Fall 2024 (EEE, 1st Sem)', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), semester: 1, department: 'Electrical & Electronic Engineering', subjects: ['subject_11', 'subject_16'], createdAt: new Date().toISOString() },
    { id: 'exam_12', title: 'Final - Fall 2024 (EEE, 1st Sem)', date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), semester: 1, department: 'Electrical & Electronic Engineering', subjects: ['subject_11', 'subject_16'], createdAt: new Date().toISOString() },
    { id: 'exam_13', title: 'Mid Term - Spring 2025 (BBA, 1st Sem)', date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), semester: 1, department: 'Business Administration', subjects: ['subject_13', 'subject_14'], createdAt: new Date().toISOString() },
    { id: 'exam_14', title: 'Mid Term - Spring 2025 (CSE, 2nd Sem Elective)', date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(), semester: 2, department: 'Computer Science & Engineering', subjects: ['subject_4', 'subject_16'], createdAt: new Date().toISOString() }
  ];

  const extraAssignments = [];
  const extraAnnouncements = [];

  const extraResults = [
    {
      id: 'result_11',
      studentId: 'student_bd_rahim_cse_2021',
      examId: 'exam_14',
      marks: [
        { subjectId: 'subject_4', total: 100, obtained: 82 },
        { subjectId: 'subject_16', total: 100, obtained: 91 }
      ],
      gpa: 3.70,
      cgpa: 3.70,
      grade: 'A-',
      createdAt: new Date().toISOString()
    },
    {
      id: 'result_12',
      studentId: 'student_bd_rahim_eee_2022',
      examId: 'exam_11',
      marks: [
        { subjectId: 'subject_11', total: 100, obtained: 76 },
        { subjectId: 'subject_16', total: 100, obtained: 88 }
      ],
      gpa: 3.45,
      cgpa: 3.45,
      grade: 'B+',
      createdAt: new Date().toISOString()
    },
    {
      id: 'result_13',
      studentId: 'student_bd_rahim_eee_2022',
      examId: 'exam_12',
      marks: [
        { subjectId: 'subject_11', total: 100, obtained: 81 },
        { subjectId: 'subject_16', total: 100, obtained: 84 }
      ],
      gpa: 3.55,
      cgpa: 3.50,
      grade: 'A-',
      createdAt: new Date().toISOString()
    },
    {
      id: 'result_14',
      studentId: 'student_bd_rahim_bba_2023',
      examId: 'exam_13',
      marks: [
        { subjectId: 'subject_13', total: 100, obtained: 89 },
        { subjectId: 'subject_14', total: 100, obtained: 86 }
      ],
      gpa: 3.85,
      cgpa: 3.85,
      grade: 'A',
      createdAt: new Date().toISOString()
    }
  ];

  // Seed Settings
  const settings = {
    theme: 'light',
    gradeScale: GRADE_SCALE
  };

  // Combine with existing data (additive, no duplication by id)
  const allStudents = mergeById(existing.students, students.concat(extraStudents));
  const allTeachers = mergeById(existing.teachers, teachers.concat(extraTeachers));
  const allSubjects = mergeById(existing.subjects, subjects.concat(extraSubjects));
  const allClasses = mergeById(existing.classes, classes.concat(extraClasses));
  const allExams = mergeById(existing.exams, exams.concat(extraExams));
  const allAssignments = mergeById(existing.assignments, assignments.concat(extraAssignments));
  const allAnnouncements = mergeById(existing.announcements, announcements.concat(extraAnnouncements));
  const allResults = mergeById(existing.results, results.concat(extraResults));
  const finalSettings = existing.settings || settings;

  // Save all seed data to localStorage
  storage.set(STORAGE_KEYS.STUDENTS, allStudents);
  storage.set(STORAGE_KEYS.TEACHERS, allTeachers);
  storage.set(STORAGE_KEYS.SUBJECTS, allSubjects);
  storage.set(STORAGE_KEYS.CLASSES, allClasses);
  storage.set(STORAGE_KEYS.EXAMS, allExams);
  storage.set(STORAGE_KEYS.ASSIGNMENTS, allAssignments);
  storage.set(STORAGE_KEYS.ANNOUNCEMENTS, allAnnouncements);
  storage.set(STORAGE_KEYS.RESULTS, allResults);
  storage.set(STORAGE_KEYS.SETTINGS, finalSettings);

  console.log('Seed data initialized successfully!');
};
