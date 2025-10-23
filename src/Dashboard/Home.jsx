import React from 'react';
import { Users, BookOpen, Calendar, Trophy, TrendingUp, Clock } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const AdminHome = () => {
  const { getStats, announcements, exams } = useDataStore();
  const { user } = useAuthStore();
  const stats = getStats();

  // Get recent announcements (last 3)
  const recentAnnouncements = announcements
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Get upcoming exams
  const upcomingExams = exams
    .filter(exam => new Date(exam.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      title: 'Active Exams',
      value: stats.totalExams,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '12 upcoming',
      changeType: 'neutral'
    },
    {
      title: 'Results Processed',
      value: stats.totalResults,
      icon: Trophy,
      color: 'bg-yellow-500',
      change: '+8.7%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your institution today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ml-1 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <Card title="Recent Announcements">
          <div className="space-y-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {announcement.body}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="primary" size="xs">
                          {announcement.audience}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent announcements</p>
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming Exams */}
        <Card title="Upcoming Exams">
          <div className="space-y-4">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <p className="text-sm text-gray-600">{exam.department}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {format(new Date(exam.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">
                    {Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming exams</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Add Student</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Create Exam</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Add Results</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>New Subject</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminHome;
