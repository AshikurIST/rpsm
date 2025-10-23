import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Megaphone } from 'lucide-react';
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

const Announcements = () => {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useDataStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const handleAdd = () => {
    reset();
    setShowAddModal(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    Object.keys(announcement).forEach(key => setValue(key, announcement[key]));
    setShowEditModal(true);
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
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
      accessorKey: 'audience',
      header: 'Audience',
      cell: ({ row }) => (
        <Badge variant="secondary" size="sm">{row.original.audience}</Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Published',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{format(new Date(row.original.createdAt), 'MMM dd, yyyy')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleView(row.original); }}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Announcement"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(row.original); }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Announcement"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Announcement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [handleView, handleEdit, handleDelete]);



  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      createAnnouncement({ ...data });
      toast.success('Announcement published');
      setShowAddModal(false);
      reset();
    } catch {
      toast.error('Failed to publish announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      updateAnnouncement(selectedAnnouncement.id, data);
      toast.success('Announcement updated');
      setShowEditModal(false);
      setSelectedAnnouncement(null);
      reset();
    } catch {
      toast.error('Failed to update announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteAnnouncement(selectedAnnouncement.id);
      toast.success('Announcement deleted');
      setShowDeleteDialog(false);
      setSelectedAnnouncement(null);
    } catch {
      toast.error('Failed to delete announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const AnnouncementForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <FormField label="Title" error={errors.title?.message}>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input"
            placeholder="Announcement title"
          />
        </FormField>

        <FormField label="Audience" error={errors.audience?.message}>
          <select
            {...register('audience', { required: 'Audience is required' })}
            className="input"
          >
            <option value="">Select audience</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="all">All</option>
          </select>
        </FormField>

        <FormField label="Body" error={errors.body?.message}>
          <textarea
            {...register('body', { required: 'Body is required' })}
            rows={6}
            className="input"
            placeholder="Write the announcement content..."
          />
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); reset(); }} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Saving...' : (isEdit ? 'Update' : 'Publish')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Manage and publish announcements</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Megaphone className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No announcements yet</p>
            <button onClick={handleAdd} className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Publish Announcement</span>
            </button>
          </div>
        </Card>
      ) : (
        <DataTable
          data={[...announcements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          columns={columns}
          searchPlaceholder="Search by title or audience..."
          emptyStateTitle="No announcements found"
          emptyStateDescription="Try adjusting your search criteria."
        />
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Publish Announcement" size="lg">
        <AnnouncementForm onSubmit={onSubmitAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Announcement" size="lg">
        <AnnouncementForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Announcement Details" size="lg">
        {selectedAnnouncement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">{selectedAnnouncement.audience}</Badge>
              <span className="text-sm text-gray-500">{format(new Date(selectedAnnouncement.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{selectedAnnouncement.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{selectedAnnouncement.body}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${selectedAnnouncement?.title}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Announcements;
