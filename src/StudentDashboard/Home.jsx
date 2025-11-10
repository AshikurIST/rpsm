import React from 'react';
import Card from '../components/Card';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { Calendar, Trophy, BookOpen } from 'lucide-react';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const StudentHome = () => {
  const { user } = useAuthStore();
  const { exams, results, getResultsByStudentId } = useDataStore();
  
  const studentResults = getResultsByStudentId(user?.id || 'student_1');
  const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date());
  const latestResult = studentResults[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your academic overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Latest GPA</h3>
          <p className="text-3xl font-bold text-primary-600">
            {latestResult?.gpa?.toFixed(2) || 'N/A'}
          </p>
        </Card>

        <Card className="text-center">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">CGPA</h3>
          <p className="text-3xl font-bold text-primary-600">
            {latestResult?.cgpa?.toFixed(2) || 'N/A'}
          </p>
        </Card>

        <Card className="text-center">
          <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Exam</h3>
          <p className="text-lg font-bold text-gray-900">
            {upcomingExams.length > 0 
              ? format(new Date(upcomingExams[0].date), 'MMM dd')
              : 'None scheduled'
            }
          </p>
        </Card>
      </div>

      <Card title="Upcoming Exams">
        <div className="space-y-4">
          {upcomingExams.length > 0 ? (
            upcomingExams.slice(0, 3).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{exam.title}</h4>
                  <p className="text-sm text-gray-600">{exam.department}</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">
                    {format(new Date(exam.date), 'MMM dd, yyyy')}
                  </Badge>
                </div>
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
  );
};

export default StudentHome;
