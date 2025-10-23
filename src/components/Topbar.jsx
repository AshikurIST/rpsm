import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Bell } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const Topbar = ({ onToggleSidebar, isSidebarCollapsed = false }) => {
  const { user, logout, isAdmin } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <X className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin() ? 'Admin Dashboard' : 'Student Portal'}
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Bell className="h-5 w-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <HeadlessMenu as="div" className="relative">
            <HeadlessMenu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </HeadlessMenu.Button>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 focus:outline-none z-50">
                <div className="p-1">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        to={isAdmin() ? '/admin/profile' : '/student/profile'}
                        className={`
                          flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                          ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}
                        `}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                    )}
                  </HeadlessMenu.Item>

                  {isAdmin() && (
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin/settings"
                          className={`
                            flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                            ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}
                          `}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>

                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`
                          flex items-center w-full px-4 py-3 text-sm rounded-lg transition-colors
                          ${active ? 'bg-red-50 text-red-700' : 'text-gray-700'}
                        `}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    )}
                  </HeadlessMenu.Item>
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50" />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
            {/* Mobile menu content would go here */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
