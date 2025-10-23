import React from 'react';
import Card from '../components/Card';
import { useAuthStore } from '../store/authStore';

const AdminProfile = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile information
        </p>
      </div>

      <Card title="Profile Information">
        <div className="space-y-4">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
