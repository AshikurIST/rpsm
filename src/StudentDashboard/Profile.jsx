import React, { useState } from 'react';
import { User, Mail, Phone, GraduationCap, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import FormField from '../components/FormField';
import { useForm } from 'react-hook-form';

const StudentProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const { 
    getResultsByStudentId, 
    exams,
    announcements 
  } = useDataStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Get student's academic data
  const studentResults = getResultsByStudentId(user?.id || 'student_1');
  const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date()).slice(0, 3);
  const recentAnnouncements = announcements
    .filter(ann => ann.audience === 'students' || ann.audience === 'all')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Calculate academic stats
  const academicStats = {
    totalExams: studentResults.length,
    currentCGPA: studentResults.length > 0 ? studentResults[0]?.cgpa?.toFixed(2) || '0.00' : '0.00',
    averageGPA: studentResults.length > 0 ? 
      (studentResults.reduce((sum, r) => sum + (r.gpa || 0), 0) / studentResults.length).toFixed(2) : '0.00'
  };

  const handleEdit = () => {
    // Pre-fill form with current user data
    Object.keys(user || {}).forEach(key => {
      setValue(key, user[key]);
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    try {
      const result = updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        reset();
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileField = ({ label, value, icon: Icon }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
        <div className="text-gray-900">{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            View and manage your personal information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title={isEditing ? "Edit Profile Information" : "Profile Information"}>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    error={errors.name?.message}
                  >
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    error={errors.email?.message}
                  >
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input"
                      placeholder="Enter your email"
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    error={errors.phone?.message}
                  >
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      className="input"
                      placeholder="Enter your phone number"
                    />
                  </FormField>

                  <FormField
                    label="Department"
                    error={errors.department?.message}
                  >
                    <select
                      {...register('department', { required: 'Department is required' })}
                      className="input"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Roll Number"
                  >
                    <input
                      value={user?.roll || ''}
                      className="input bg-gray-100"
                      disabled
                      placeholder="Roll number (read-only)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Roll number cannot be changed
                    </div>
                  </FormField>

                  <FormField
                    label="Registration Number"
                  >
                    <input
                      value={user?.regNo || ''}
                      className="input bg-gray-100"
                      disabled
                      placeholder="Registration number (read-only)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Registration number cannot be changed
                    </div>
                  </FormField>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="primary" size="sm">{user?.roll}</Badge>
                      <Badge variant="secondary" size="sm">{user?.batch}</Badge>
                    </div>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileField 
                    label="Full Name" 
                    value={user?.name} 
                    icon={User}
                  />
                  <ProfileField 
                    label="Email Address" 
                    value={user?.email} 
                    icon={Mail}
                  />
                  <ProfileField 
                    label="Phone Number" 
                    value={user?.phone} 
                    icon={Phone}
                  />
                  <ProfileField 
                    label="Department" 
                    value={user?.department} 
                    icon={GraduationCap}
                  />
                  <ProfileField 
                    label="Roll Number" 
                    value={user?.roll} 
                    icon={GraduationCap}
                  />
                  <ProfileField 
                    label="Registration Number" 
                    value={user?.regNo} 
                    icon={GraduationCap}
                  />
                  <ProfileField 
                    label="Batch" 
                    value={user?.batch} 
                    icon={Calendar}
                  />
                  <ProfileField 
                    label="Role" 
                    value="Student" 
                    icon={User}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Academic Performance Summary */}
          <Card title="Academic Performance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {academicStats.totalExams}
                </div>
                <div className="text-sm font-medium text-gray-600">Total Exams</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {academicStats.averageGPA}
                </div>
                <div className="text-sm font-medium text-gray-600">Average GPA</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {academicStats.currentCGPA}
                </div>
                <div className="text-sm font-medium text-gray-600">Current CGPA</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <Card title="Upcoming Exams">
            <div className="space-y-3">
              {upcomingExams.length > 0 ? (
                upcomingExams.map(exam => (
                  <div key={exam.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900 text-sm">{exam.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(exam.date), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming exams</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Announcements */}
          <Card title="Recent Announcements">
            <div className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map(announcement => (
                  <div key={announcement.id} className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                    <div className="font-medium text-gray-900 text-sm mb-1">
                      {announcement.title}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {announcement.body}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent announcements</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Info">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Student Since</span>
                <span className="text-sm font-medium text-gray-900">
                  {user?.batch || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department</span>
                <Badge variant="secondary" size="xs">
                  {user?.department || 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Results Available</span>
                <span className="text-sm font-medium text-gray-900">
                  {studentResults.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
