import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';

const Assignments = () => {
  const { assignments, subjects, createAssignment, updateAssignment, deleteAssignment } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const getSubjectTitle = (id) => subjects.find(s => s.id === id)?.title || 'Unknown';

  const handleAdd = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    Object.keys(assignment).forEach(key => {
      if (key === 'dueDate') {
        const date = new Date(assignment[key]);
        const formatted = date.toISOString().slice(0, 16);
        setValue(key, formatted);
      } else {
        setValue(key, assignment[key]);
      }
    });
    setShowEditModal(true);
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteDialog(true);
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'subjectId',
      header: 'Subject',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{getSubjectTitle(row.original.subjectId)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <Badge variant="warning" size="sm">{format(new Date(row.original.dueDate), 'MMM dd, yyyy')}</Badge>
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
            title="Edit Assignment"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Assignment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [subjects, handleEdit, handleDelete]);


  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      data.dueDate = new Date(data.dueDate).toISOString();
      createAssignment(data);
      toast.success('Assignment created');
      setShowAddModal(false);
      reset();
    } catch {
      toast.error('Failed to create assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      data.dueDate = new Date(data.dueDate).toISOString();
      updateAssignment(selectedAssignment.id, data);
      toast.success('Assignment updated');
      setShowEditModal(false);
      setSelectedAssignment(null);
      reset();
    } catch {
      toast.error('Failed to update assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteAssignment(selectedAssignment.id);
      toast.success('Assignment deleted');
      setShowDeleteDialog(false);
      setSelectedAssignment(null);
    } catch {
      toast.error('Failed to delete assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const AssignmentForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input"
            placeholder="Assignment title"
          />
        </FormField>

        <FormField label="Subject" error={errors.subjectId?.message}>
          <select
            {...register('subjectId', { required: 'Subject is required' })}
            className="input"
          >
            <option value="">Select subject</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.title} ({sub.code})</option>
            ))}
          </select>
        </FormField>

        <FormField label="Due Date" error={errors.dueDate?.message}>
          <input
            {...register('dueDate', { required: 'Due date is required' })}
            type="datetime-local"
            className="input"
          />
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={5}
          className="input"
          placeholder="Describe the assignment..."
        />
      </FormField>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); reset(); }} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : (isEdit ? 'Update Assignment' : 'Create Assignment')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">Create and track course assignments</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center">
          <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No assignments yet</p>
          <button onClick={handleAdd} className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </Card>
      ) : (
        <DataTable
          data={[...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))}
          columns={columns}
          searchPlaceholder="Search by title or subject..."
          emptyStateTitle="No assignments found"
          emptyStateDescription="Try adjusting your search."
        />
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Assignment" size="xl">
        <AssignmentForm onSubmit={onSubmitAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Assignment" size="xl">
        <AssignmentForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${selectedAssignment?.title}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Assignments;
