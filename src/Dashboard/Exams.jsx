import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, BookOpen, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useForm } from 'react-hook-form';

const Exams = () => {
  const { 
    exams, 
    subjects,
    createExam, 
    updateExam, 
    deleteExam,
    getResultsByExamId
  } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  // Watch selected subjects to update form
  const selectedSubjects = watch('subjects') || [];

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Exam Title',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.title}</div>
          <div className="text-sm text-gray-500">{row.original.department}</div>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const examDate = new Date(row.original.date);
        const now = new Date();
        const isUpcoming = examDate > now;
        
        return (
          <div>
            <div className="font-medium text-gray-900">
              {format(examDate, 'MMM dd, yyyy')}
            </div>
            <div className="text-sm">
              <Badge variant={isUpcoming ? 'warning' : 'secondary'} size="xs">
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'semester',
      header: 'Semester',
      cell: ({ row }) => (
        <Badge variant="primary" size="sm">{row.original.semester}</Badge>
      ),
    },
    {
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {row.original.subjects?.length || 0} subjects
          </span>
        </div>
      ),
    },
    {
      id: 'results',
      header: 'Results',
      cell: ({ row }) => {
        const results = getResultsByExamId(row.original.id);
        return (
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {results.length} submitted
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditExam(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Exam"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteExam(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Exam"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

  const handleAddExam = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    // Pre-fill form
    Object.keys(exam).forEach(key => {
      if (key === 'date') {
        // Format date for input[type=datetime-local]
        const date = new Date(exam[key]);
        const formattedDate = date.toISOString().slice(0, 16);
        setValue(key, formattedDate);
      } else {
        setValue(key, exam[key]);
      }
    });
    setShowEditModal(true);
  };

  const handleDeleteExam = (exam) => {
    setSelectedExam(exam);
    setShowDeleteDialog(true);
  };

  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      data.semester = parseInt(data.semester);
      data.date = new Date(data.date).toISOString();
      data.subjects = Array.isArray(data.subjects) ? data.subjects : [];
      createExam(data);
      toast.success('Exam created successfully');
      setShowAddModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to create exam');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      data.semester = parseInt(data.semester);
      data.date = new Date(data.date).toISOString();
      data.subjects = Array.isArray(data.subjects) ? data.subjects : [];
      updateExam(selectedExam.id, data);
      toast.success('Exam updated successfully');
      setShowEditModal(false);
      setSelectedExam(null);
      reset();
    } catch (error) {
      toast.error('Failed to update exam');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteExam(selectedExam.id);
      toast.success('Exam deleted successfully');
      setShowDeleteDialog(false);
      setSelectedExam(null);
    } catch (error) {
      toast.error('Failed to delete exam');
    } finally {
      setIsLoading(false);
    }
  };

  // Get exam stats
  const stats = {
    total: exams.length,
    upcoming: exams.filter(exam => new Date(exam.date) > new Date()).length,
    completed: exams.filter(exam => new Date(exam.date) <= new Date()).length,
    thisMonth: exams.filter(exam => {
      const examDate = new Date(exam.date);
      const now = new Date();
      return examDate.getMonth() === now.getMonth() && examDate.getFullYear() === now.getFullYear();
    }).length
  };

  const ExamForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Exam Title" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input"
            placeholder="e.g., Mid Term Examination"
          />
        </FormField>

        <FormField label="Date & Time" error={errors.date?.message}>
          <input
            {...register('date', { required: 'Date is required' })}
            type="datetime-local"
            className="input"
          />
        </FormField>

        <FormField label="Department" error={errors.department?.message}>
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

        <FormField label="Semester" error={errors.semester?.message}>
          <input
            {...register('semester', { 
              required: 'Semester is required', 
              valueAsNumber: true,
              min: { value: 1, message: 'Minimum semester is 1' }
            })}
            type="number"
            className="input"
            placeholder="e.g., 4"
          />
        </FormField>
      </div>

      {/* Subject Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Subjects
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          {subjects.map(subject => (
            <label key={subject.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                value={subject.id}
                {...register('subjects')}
                className="rounded border-gray-300 text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{subject.title}</div>
                <div className="text-xs text-gray-500">{subject.code} • {subject.credit} credits</div>
              </div>
            </label>
          ))}
        </div>
        {errors.subjects && (
          <div className="text-red-600 text-sm mt-1">{errors.subjects.message}</div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          onClick={() => { 
            setShowAddModal(false); 
            setShowEditModal(false); 
            reset(); 
          }} 
          className="btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="btn-primary"
        >
          {isLoading ? 'Saving...' : (isEdit ? 'Update Exam' : 'Create Exam')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage examinations
          </p>
        </div>
        <button 
          onClick={handleAddExam} 
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Exam</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Exams</div>
        </Card>
        <Card className="text-center">
          <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </Card>
        <Card className="text-center">
          <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="text-center">
          <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.thisMonth}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </Card>
      </div>

      {/* Exams Table */}
      {exams.length === 0 ? (
        <Card>
          <EmptyState
            title="No Exams Scheduled"
            description="Get started by scheduling your first examination."
            actionLabel="Schedule Exam"
            onAction={handleAddExam}
            icon={Calendar}
          />
        </Card>
      ) : (
        <DataTable
          data={exams}
          columns={columns}
          searchPlaceholder="Search by title, department, or date..."
          emptyStateTitle="No exams found"
          emptyStateDescription="Try adjusting your search criteria."
        />
      )}

      {/* Add Exam Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Schedule New Exam" 
        size="xl"
      >
        <ExamForm onSubmit={onSubmitAdd} />
      </Modal>

      {/* Edit Exam Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit Exam" 
        size="xl"
      >
        <ExamForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Exam"
        message={`Are you sure you want to delete "${selectedExam?.title}"? This will also remove all related results. This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Exams;
