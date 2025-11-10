# Result Processing Management System (RPMS)

A comprehensive web application for educational institutions to manage students, teachers, subjects, exams, and results with automated GPA/CGPA calculations.

## 🚀 Features

### Admin Dashboard
- **Dashboard Overview**: Quick stats, recent announcements, upcoming exams
- **Student Management**: Add, edit, delete, and search students
- **Teacher Management**: Manage faculty information
- **Subject Management**: Define courses with credit hours
- **Class Management**: Organize students into classes with assigned subjects and teachers
- **Exam Management**: Create and schedule examinations
- **Result Processing**: Enter exam marks with automatic GPA/CGPA calculation
- **Announcements**: Broadcast messages to students, teachers, or all
- **Assignments**: Create and manage assignments linked to subjects

### Student Portal
- **Personal Dashboard**: View GPA, CGPA, and upcoming exams
- **Profile Management**: View personal information (read-only)
- **Results Access**: View detailed results with grade breakdown
- **Print-friendly Marksheets**: Export and print academic records

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.1
- **Routing**: React Router v6.30.x with nested routes and guards
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS 3.x with custom design system
- **Form Handling**: React Hook Form with Zod validation
- **Data Tables**: TanStack React Table with sorting, filtering, pagination
- **UI Components**: HeadlessUI for accessible components
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **Date Handling**: date-fns
- **Build Tool**: Vite 7.x for fast development and building

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 🔐 Admin & Student Login (Demo)

This project ships with demo credentials so you can quickly explore both admin and student views.

Admin (full access)
- Email: `admin@rpms.edu`
- Password: `admin123`
- Login route: `/login/admin`

Student (view-only demo)
- Email: `rakib.hasan@university.edu.bd`
- Password: `student123`
- Login route: `/login/student`

Quick notes and troubleshooting
- The demo student is mapped to the seeded student record `student_1` (Rakib Hasan). Student data (results, profile) comes from the seed data in `src/lib/fakeSeed.js`.
- If you don't see the expected demo data after a code change, clear the app localStorage and reload:
   1. Open DevTools → Application → Local Storage
   2. Remove keys that start with `rpms_` (or click Clear)
   3. Refresh the app; the seeder will re-populate demo data
- To change which student the demo login uses, edit the demo user in `src/store/authStore.js` (the `MOCK_USERS.student` object) to match the `id`/email of a seeded student.

Security reminder
- These credentials are for local development/demos only. Do not use them in production or on a publicly accessible server.


## 🎯 Key Features

- **Role-based Authentication**: Separate admin and student access
- **Automated Grade Calculation**: GPA/CGPA computed using configurable grade scale
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: All data stored in localStorage (no backend required)
- **Real-time Search & Filtering**: Instant search across all data tables
- **Comprehensive Validation**: Form validation using Zod schemas
- **Toast Notifications**: User-friendly feedback for all actions
- **Print-friendly Results**: Student marksheets ready for printing

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
