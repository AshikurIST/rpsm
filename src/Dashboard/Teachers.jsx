import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';

const Teachers = () => {
  const { teachers, createTeacher, updateTeacher, deleteTeacher } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const handleAdd = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    Object.keys(teacher).forEach(key => setValue(key, teacher[key]));
    setShowEditModal(true);
  };

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteDialog(true);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.designation}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => (
        <Badge variant="secondary" size="sm">{row.original.department}</Badge>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{row.original.phone}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(row.original); }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Teacher"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Teacher"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [handleEdit, handleDelete]);


  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      createTeacher(data);
      toast.success('Teacher added');
      setShowAddModal(false);
      reset();
    } catch {
      toast.error('Failed to add teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      updateTeacher(selectedTeacher.id, data);
      toast.success('Teacher updated');
      setShowEditModal(false);
      setSelectedTeacher(null);
      reset();
    } catch {
      toast.error('Failed to update teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteTeacher(selectedTeacher.id);
      toast.success('Teacher deleted');
      setShowDeleteDialog(false);
      setSelectedTeacher(null);
    } catch {
      toast.error('Failed to delete teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const TeacherForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Full Name" error={errors.name?.message}>
          <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Enter full name" />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
            type="email"
            className="input"
            placeholder="Enter email"
          />
        </FormField>

        <FormField label="Department" error={errors.department?.message}>
          <select {...register('department', { required: 'Department is required' })} className="input">
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>
        </FormField>

        <FormField label="Designation" error={errors.designation?.message}>
          <select {...register('designation', { required: 'Designation is required' })} className="input">
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <input {...register('phone', { required: 'Phone is required' })} className="input" placeholder="Enter phone number" />
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); reset(); }} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : (isEdit ? 'Update Teacher' : 'Add Teacher')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-2">Manage faculty information</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchPlaceholder="Search by name, email, or department..."
        emptyStateTitle="No teachers found"
        emptyStateDescription="Try adjusting your search."
      />

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Teacher" size="lg">
        <TeacherForm onSubmit={onSubmitAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Teacher" size="lg">
        <TeacherForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.name}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Teachers;
