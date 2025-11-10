import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import FormField from '../components/FormField';
import { toast } from 'sonner';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/home';

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const result = await login({
      ...data,
      role: 'admin'
    });
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    }
  };

  const fillDemoCredentials = () => {
    // For demo purposes - you might want to remove this in production
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    if (emailInput && passwordInput) {
      emailInput.value = 'admin@rpms.edu';
      passwordInput.value = 'admin123';
      // Trigger change events
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Sign In</h2>
        <p className="mt-2 text-gray-600">
          Access the administrative dashboard to manage your institution
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="email"
          control={control}
          label="Email Address"
          type="email"
          placeholder="admin@rpms.edu"
          required
          className="space-y-2"
        />

        <div className="relative">
          <FormField
            name="password"
            control={control}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            className="space-y-2"
            inputClassName="pr-12"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex mt-8 items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* <div className="text-sm">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-primary-600 hover:text-primary-500"
            >
              Use demo credentials
            </button>
          </div> */}
          <div className="text-sm">
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Need student access?{' '}
          <Link to="/login/student" className="text-primary-600 hover:text-primary-500 font-medium">
            Student Portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
