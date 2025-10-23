import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';

const Classes = () => {
  const { classes, subjects, teachers, createClass, updateClass, deleteClass } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const getTeacherName = (id) => teachers.find(t => t.id === id)?.name || 'Unassigned';

  const handleAdd = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEdit = (cls) => {
    setSelectedClass(cls);
    Object.keys(cls).forEach(key => setValue(key, cls[key]));
    setShowEditModal(true);
  };

  const handleDelete = (cls) => {
    setSelectedClass(cls);
    setShowDeleteDialog(true);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Class',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.name}</div>
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
      accessorKey: 'semester',
      header: 'Semester',
      cell: ({ row }) => (
        <Badge variant="primary" size="sm">{row.original.semester}</Badge>
      ),
    },
    {
      accessorKey: 'teacherId',
      header: 'Teacher',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{getTeacherName(row.original.teacherId)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{row.original.subjects?.length || 0} subjects</span>
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
            title="Edit Class"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Class"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [teachers, handleEdit, handleDelete]);


  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      data.semester = parseInt(data.semester);
      data.subjects = Array.isArray(data.subjects) ? data.subjects : [];
      createClass(data);
      toast.success('Class created');
      setShowAddModal(false);
      reset();
    } catch {
      toast.error('Failed to create class');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      data.semester = parseInt(data.semester);
      data.subjects = Array.isArray(data.subjects) ? data.subjects : [];
      updateClass(selectedClass.id, data);
      toast.success('Class updated');
      setShowEditModal(false);
      setSelectedClass(null);
      reset();
    } catch {
      toast.error('Failed to update class');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteClass(selectedClass.id);
      toast.success('Class deleted');
      setShowDeleteDialog(false);
      setSelectedClass(null);
    } catch {
      toast.error('Failed to delete class');
    } finally {
      setIsLoading(false);
    }
  };

  const ClassForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Class Name" error={errors.name?.message}>
          <input
            {...register('name', { required: 'Class name is required' })}
            className="input"
            placeholder="e.g., CS 2021 Batch A"
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

        <FormField label="Semester" error={errors.semester?.message}>
          <input
            {...register('semester', { required: 'Semester is required', valueAsNumber: true, min: { value: 1, message: 'Minimum 1' } })}
            type="number"
            className="input"
            placeholder="e.g., 4"
          />
        </FormField>

        <FormField label="Class Teacher" error={errors.teacherId?.message}>
          <select {...register('teacherId', { required: 'Class teacher is required' })} className="input">
            <option value="">Select Teacher</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          {subjects.map(subject => (
            <label key={subject.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input type="checkbox" value={subject.id} {...register('subjects')} className="rounded border-gray-300 text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{subject.title}</div>
                <div className="text-xs text-gray-500">{subject.code} • {subject.credit} credits</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); reset(); }} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : (isEdit ? 'Update Class' : 'Create Class')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-2">Manage classes, subjects, and class teachers</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Class</span>
        </button>
      </div>

      <DataTable
        data={classes}
        columns={columns}
        searchPlaceholder="Search by name, department..."
        emptyStateTitle="No classes found"
        emptyStateDescription="Try adjusting your search."
      />

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Class" size="xl">
        <ClassForm onSubmit={onSubmitAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Class" size="xl">
        <ClassForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Classes;
