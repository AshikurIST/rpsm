import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Components
import AdminLogin from '../auth/AdminLogin';
import StudentLogin from '../auth/StudentLogin';
import ProtectedRoute from '../auth/ProtectedRoute';
import RoleRoute from '../auth/RoleRoute';

// Admin Pages
import AdminHome from '../Dashboard/Home';
import AdminProfile from '../Dashboard/Profile';
import AdminSettings from '../Dashboard/Settings';
import Announcements from '../Dashboard/Announcements';
import Assignments from '../Dashboard/Assignments';
import Classes from '../Dashboard/Classes';
import Exams from '../Dashboard/Exams';
import Results from '../Dashboard/Results';
import Students from '../Dashboard/Students';
import Teachers from '../Dashboard/Teachers';
import Subjects from '../Dashboard/Subjects';

// Student Pages
import StudentHome from '../StudentDashboard/Home';
import StudentProfile from '../StudentDashboard/Profile';
import StudentResults from '../StudentDashboard/Results';

// Error Pages
import NotFound from '../pages/NotFound';
import ErrorBoundary from '../pages/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login/admin" replace />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login/admin" replace />,
      },
      {
        path: 'admin',
        element: <AdminLogin />,
      },
      {
        path: 'student',
        element: <StudentLogin />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleRoute role="admin">
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/home" replace />,
      },
      {
        path: 'home',
        element: <AdminHome />,
      },
      {
        path: 'profile',
        element: <AdminProfile />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'assignments',
        element: <Assignments />,
      },
      {
        path: 'classes',
        element: <Classes />,
      },
      {
        path: 'exams',
        element: <Exams />,
      },
      {
        path: 'results',
        element: <Results />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'teachers',
        element: <Teachers />,
      },
      {
        path: 'subjects',
        element: <Subjects />,
      },
    ],
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <RoleRoute role="student">
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/student/home" replace />,
      },
      {
        path: 'home',
        element: <StudentHome />,
      },
      {
        path: 'profile',
        element: <StudentProfile />,
      },
      {
        path: 'results',
        element: <StudentResults />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
