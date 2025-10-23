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

## 🔐 Demo Credentials

### Admin Access
- **Email**: `admin@rpms.dev`
- **Password**: `admin123`
- **Access**: Full administrative capabilities

### Student Access
- **Email**: `student@rpms.dev`
- **Password**: `student123`
- **Access**: View-only student portal

*Note: You can click "Use demo credentials" on the login forms to auto-fill these credentials.*

## 🎯 Key Features

- **Role-based Authentication**: Separate admin and student access
- **Automated Grade Calculation**: GPA/CGPA computed using configurable grade scale
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: All data stored in localStorage (no backend required)
- **Real-time Search & Filtering**: Instant search across all data tables
- **Comprehensive Validation**: Form validation using Zod schemas
- **Toast Notifications**: User-friendly feedback for all actions
- **Print-friendly Results**: Student marksheets ready for printing

## 📊 Grade Scale

| Percentage | Letter Grade | GPA Points |
|------------|--------------|------------|
| 80-100     | A+           | 4.0        |
| 75-79      | A            | 3.75       |
| 70-74      | A-           | 3.5        |
| 65-69      | B+           | 3.25       |
| 60-64      | B            | 3.0        |
| 55-59      | B-           | 2.75       |
| 50-54      | C+           | 2.5        |
| 45-49      | C            | 2.25       |
| 40-44      | D            | 2.0        |
| 0-39       | F            | 0.0        |

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
