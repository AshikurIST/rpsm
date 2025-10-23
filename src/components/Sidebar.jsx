import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Home,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  ClipboardList,
  Trophy,
  Megaphone,
  Settings,
  GraduationCap,
  User,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const { user, isAdmin, isStudent } = useAuthStore();

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/home' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: ClipboardList, label: 'Assignments', path: '/admin/assignments' },
    { icon: Users, label: 'Classes', path: '/admin/classes' },
    { icon: Calendar, label: 'Exams', path: '/admin/exams' },
    { icon: Trophy, label: 'Results', path: '/admin/results' },
    { icon: GraduationCap, label: 'Students', path: '/admin/students' },
    { icon: UserCheck, label: 'Teachers', path: '/admin/teachers' },
    { icon: BookOpen, label: 'Subjects', path: '/admin/subjects' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const studentMenuItems = [
    { icon: Home, label: 'Home', path: '/student/home' },
    { icon: User, label: 'Profile', path: '/student/profile' },
    { icon: BarChart3, label: 'Results', path: '/student/results' },
  ];

  const menuItems = isAdmin() ? adminMenuItems : studentMenuItems;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`
      bg-white border-r border-gray-200 h-full flex flex-col
      ${isCollapsed ? 'w-16' : 'w-64'}
      transition-all duration-300 ease-in-out
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-primary-600 rounded-lg p-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">RPMS</h1>
              <p className="text-sm text-gray-500">
                {isAdmin() ? 'Admin Panel' : 'Student Portal'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                sidebar-link group
                ${active ? 'active' : ''}
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`
                h-5 w-5 
                ${active ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}
                transition-colors
              `} />
              {!isCollapsed && (
                <span className={`
                  ml-3 font-medium
                  ${active ? 'text-primary-600' : 'text-gray-700 group-hover:text-primary-600'}
                  transition-colors
                `}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
