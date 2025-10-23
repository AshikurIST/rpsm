import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, User, GraduationCap, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useForm } from 'react-hook-form';

const Students = () => {
  const { 
    students, 
    createStudent, 
    updateStudent, 
    deleteStudent,
    getResultsByStudentId 
  } = useDataStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Table columns
  const columns = useMemo(() => [
    {
      accessorKey: 'roll',
      header: 'Roll Number',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.roll}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Full Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.regNo}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.original.email}</div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <Badge variant="secondary" size="sm">
          {row.original.department}
        </Badge>
      ),
    },
    {
      accessorKey: 'batch',
      header: 'Batch',
      cell: ({ row }) => (
        <Badge variant="primary" size="sm">
          {row.original.batch}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewStudent(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditStudent(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Student"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStudent(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

  // Handle actions
  const handleAddStudent = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    // Pre-fill form
    Object.keys(student).forEach(key => {
      setValue(key, student[key]);
    });
    setShowEditModal(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  // Form submissions
  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      createStudent(data);
      toast.success('Student created successfully');
      setShowAddModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to create student');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      updateStudent(selectedStudent.id, data);
      toast.success('Student updated successfully');
      setShowEditModal(false);
      setSelectedStudent(null);
      reset();
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteStudent(selectedStudent.id);
      toast.success('Student deleted successfully');
      setShowDeleteDialog(false);
      setSelectedStudent(null);
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setIsLoading(false);
    }
  };

  // Get student results for view modal
  const getStudentResults = (studentId) => {
    return getResultsByStudentId(studentId);
  };

  const StudentForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          error={errors.name?.message}
        >
          <input
            {...register('name', { required: 'Name is required' })}
            className="input"
            placeholder="Enter full name"
          />
        </FormField>

        <FormField
          label="Roll Number"
          error={errors.roll?.message}
        >
          <input
            {...register('roll', { required: 'Roll number is required' })}
            className="input"
            placeholder="Enter roll number"
          />
        </FormField>

        <FormField
          label="Registration Number"
          error={errors.regNo?.message}
        >
          <input
            {...register('regNo', { required: 'Registration number is required' })}
            className="input"
            placeholder="Enter registration number"
          />
        </FormField>

        <FormField
          label="Email"
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
            placeholder="Enter email address"
          />
        </FormField>

        <FormField
          label="Phone"
          error={errors.phone?.message}
        >
          <input
            {...register('phone', { required: 'Phone number is required' })}
            className="input"
            placeholder="Enter phone number"
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
          label="Batch"
          error={errors.batch?.message}
        >
          <input
            {...register('batch', { required: 'Batch is required' })}
            className="input"
            placeholder="Enter batch year (e.g., 2021)"
          />
        </FormField>
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
          {isLoading ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}
        </button>
      </div>
    </form>
  );

  const StudentDetails = ({ student }) => {
    const results = getStudentResults(student.id);
    
    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{student.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </label>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{student.roll}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <span className="text-gray-900">{student.regNo}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <Badge variant="secondary">{student.department}</Badge>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{student.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{student.phone}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch
            </label>
            <Badge variant="primary">{student.batch}</Badge>
          </div>
        </div>

        {/* Academic Performance */}
        {results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">Latest GPA</div>
                <div className="text-2xl font-bold text-blue-600">
                  {results[0]?.gpa?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600 mb-1">CGPA</div>
                <div className="text-2xl font-bold text-green-600">
                  {results[0]?.cgpa?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowViewModal(false)}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">
            Manage student information and academic records
          </p>
        </div>
        <button
          onClick={handleAddStudent}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Students Table */}
      {students.length === 0 ? (
        <Card>
          <EmptyState
            title="No Students Found"
            description="Get started by adding your first student to the system."
            actionLabel="Add Student"
            onAction={handleAddStudent}
            icon={User}
          />
        </Card>
      ) : (
        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="Search students by name, roll, or email..."
          emptyStateTitle="No students found"
          emptyStateDescription="Try adjusting your search criteria."
        />
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
        size="lg"
      >
        <StudentForm onSubmit={onSubmitAdd} />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Student"
        size="lg"
      >
        <StudentForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Student Details"
        size="lg"
      >
        {selectedStudent && <StudentDetails student={selectedStudent} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone and will also remove all related results.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Students;
