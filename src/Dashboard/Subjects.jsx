import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { useForm } from 'react-hook-form';

const Subjects = () => {
  const { subjects, createSubject, updateSubject, deleteSubject } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const columns = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">{row.original.code}</div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.title}</div>
          <div className="text-sm text-gray-500">{row.original.department}</div>
        </div>
      ),
    },
    {
      accessorKey: 'credit',
      header: 'Credit',
      cell: ({ row }) => (
        <Badge variant="secondary" size="sm">{row.original.credit}</Badge>
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditSubject(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Subject"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSubject(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Subject"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

  const handleAddSubject = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    Object.keys(subject).forEach(key => setValue(key, subject[key]));
    setShowEditModal(true);
  };

  const handleDeleteSubject = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteDialog(true);
  };

  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      data.credit = parseFloat(data.credit);
      data.semester = parseInt(data.semester);
      createSubject(data);
      toast.success('Subject created successfully');
      setShowAddModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to create subject');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      data.credit = parseFloat(data.credit);
      data.semester = parseInt(data.semester);
      updateSubject(selectedSubject.id, data);
      toast.success('Subject updated successfully');
      setShowEditModal(false);
      setSelectedSubject(null);
      reset();
    } catch (error) {
      toast.error('Failed to update subject');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteSubject(selectedSubject.id);
      toast.success('Subject deleted successfully');
      setShowDeleteDialog(false);
      setSelectedSubject(null);
    } catch (error) {
      toast.error('Failed to delete subject');
    } finally {
      setIsLoading(false);
    }
  };

  const SubjectForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Code" error={errors.code?.message}>
          <input
            {...register('code', { required: 'Code is required' })}
            className="input"
            placeholder="e.g., CS101"
          />
        </FormField>
        <FormField label="Title" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input"
            placeholder="Subject title"
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
        <FormField label="Credit" error={errors.credit?.message}>
          <input
            {...register('credit', { required: 'Credit is required', valueAsNumber: true, min: { value: 0.5, message: 'Minimum 0.5' } })}
            type="number"
            step="0.5"
            className="input"
            placeholder="e.g., 3.0"
          />
        </FormField>
        <FormField label="Semester" error={errors.semester?.message}>
          <input
            {...register('semester', { required: 'Semester is required', valueAsNumber: true, min: { value: 1, message: 'Minimum 1' } })}
            type="number"
            className="input"
            placeholder="e.g., 1"
          />
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); reset(); }} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : (isEdit ? 'Update Subject' : 'Create Subject')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-2">Manage academic subjects and credits</p>
        </div>
        <button onClick={handleAddSubject} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      <DataTable
        data={subjects}
        columns={columns}
        searchPlaceholder="Search by code, title, or department..."
        emptyStateTitle="No subjects found"
        emptyStateDescription="Try adjusting your search criteria."
      />

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Subject" size="lg">
        <SubjectForm onSubmit={onSubmitAdd} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Subject" size="lg">
        <SubjectForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${selectedSubject?.title}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Subjects;
