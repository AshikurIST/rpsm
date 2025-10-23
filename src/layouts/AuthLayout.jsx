import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="mb-8">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-4">
              Result Processing Management System
            </h1>
            <p className="text-xl text-primary-100 text-center max-w-md">
              Streamline your educational institution's result management with our comprehensive platform
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 text-center">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-primary-100">Students</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-primary-100">Teachers</div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>

        {/* Right side - Forms */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            {/* Logo for mobile */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="bg-primary-600 rounded-2xl p-3">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <Outlet />
            
            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>&copy; 2024 RPMS. All rights reserved.</p>
              <p className="mt-1">
                Built with React, Tailwind CSS, and modern web technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
