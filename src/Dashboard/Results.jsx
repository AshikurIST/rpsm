import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, Trophy, Calculator, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useDataStore } from '../store/dataStore';
import { calculateGPA, getLetterGrade, GRADE_SCALE } from '../lib/grade';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useForm } from 'react-hook-form';

const Results = () => {
  const { 
    results, 
    students,
    exams,
    subjects,
    createResult, 
    updateResult, 
    deleteResult,
    getStudentById,
    getExamById,
    getSubjectById
  } = useDataStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  // Watch for exam selection to get subjects
  const watchedExam = watch('examId');
  const selectedExamData = exams.find(exam => exam.id === watchedExam);
  const examSubjects = selectedExamData ? selectedExamData.subjects.map(subjectId => 
    subjects.find(subject => subject.id === subjectId)
  ).filter(Boolean) : [];

  // Enhanced results data with student and exam info
  const enhancedResults = useMemo(() => {
    return results.map(result => {
      const student = getStudentById(result.studentId);
      const exam = getExamById(result.examId);
      return {
        ...result,
        studentName: student?.name || 'Unknown Student',
        studentRoll: student?.roll || 'N/A',
        examTitle: exam?.title || 'Unknown Exam',
        examDate: exam?.date || null,
        totalMarks: result.marks?.reduce((sum, mark) => sum + mark.total, 0) || 0,
        obtainedMarks: result.marks?.reduce((sum, mark) => sum + mark.obtained, 0) || 0,
        percentage: result.marks?.length > 0 ? 
          ((result.marks.reduce((sum, mark) => sum + mark.obtained, 0) / 
            result.marks.reduce((sum, mark) => sum + mark.total, 0)) * 100).toFixed(2) : 0
      };
    });
  }, [results, students, exams]);

  // Table columns
  const columns = useMemo(() => [
    {
      accessorKey: 'studentName',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.original.studentName}</div>
            <div className="text-sm text-gray-500">{row.original.studentRoll}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'examTitle',
      header: 'Exam',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.examTitle}</div>
          {row.original.examDate && (
            <div className="text-sm text-gray-500">
              {format(new Date(row.original.examDate), 'MMM dd, yyyy')}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{row.original.percentage}%</div>
          <div className="text-sm text-gray-500">
            {row.original.obtainedMarks}/{row.original.totalMarks}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'gpa',
      header: 'GPA',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-semibold text-blue-600">
            {row.original.gpa?.toFixed(2) || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'cgpa',
      header: 'CGPA',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-semibold text-green-600">
            {row.original.cgpa?.toFixed(2) || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => {
        const percentage = parseFloat(row.original.percentage);
        const grade = getLetterGrade(percentage);
        return (
          <Badge 
            variant={percentage >= 80 ? 'success' : percentage >= 60 ? 'primary' : percentage >= 40 ? 'warning' : 'danger'}
            size="sm"
          >
            {grade}
          </Badge>
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
              handleViewResult(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditResult(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit Result"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteResult(row.original);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Result"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

  // Handle actions
  const handleAddResult = () => {
    reset();
    setSelectedExam('');
    setShowAddModal(true);
  };

  const handleEditResult = (result) => {
    setSelectedResult(result);
    // Pre-fill form
    setValue('studentId', result.studentId);
    setValue('examId', result.examId);
    setSelectedExam(result.examId);
    
    // Set marks for each subject
    if (result.marks) {
      result.marks.forEach(mark => {
        setValue(`marks.${mark.subjectId}.total`, mark.total);
        setValue(`marks.${mark.subjectId}.obtained`, mark.obtained);
      });
    }
    
    setShowEditModal(true);
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowViewModal(true);
  };

  const handleDeleteResult = (result) => {
    setSelectedResult(result);
    setShowDeleteDialog(true);
  };

  // Form submissions
  const onSubmitAdd = async (data) => {
    setIsLoading(true);
    try {
      // Transform marks data
      const marksArray = examSubjects.map(subject => ({
        subjectId: subject.id,
        total: parseInt(data.marks[subject.id].total) || 0,
        obtained: parseInt(data.marks[subject.id].obtained) || 0
      }));

      const resultData = {
        studentId: data.studentId,
        examId: data.examId,
        marks: marksArray
      };

      createResult(resultData);
      toast.success('Result created successfully');
      setShowAddModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to create result');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data) => {
    setIsLoading(true);
    try {
      // Transform marks data
      const marksArray = examSubjects.map(subject => ({
        subjectId: subject.id,
        total: parseInt(data.marks[subject.id].total) || 0,
        obtained: parseInt(data.marks[subject.id].obtained) || 0
      }));

      const resultData = {
        studentId: data.studentId,
        examId: data.examId,
        marks: marksArray
      };

      updateResult(selectedResult.id, resultData);
      toast.success('Result updated successfully');
      setShowEditModal(false);
      setSelectedResult(null);
      reset();
    } catch (error) {
      toast.error('Failed to update result');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      deleteResult(selectedResult.id);
      toast.success('Result deleted successfully');
      setShowDeleteDialog(false);
      setSelectedResult(null);
    } catch (error) {
      toast.error('Failed to delete result');
    } finally {
      setIsLoading(false);
    }
  };

  const ResultForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Student"
          error={errors.studentId?.message}
        >
          <select
            {...register('studentId', { required: 'Student is required' })}
            className="input"
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.roll})
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Exam"
          error={errors.examId?.message}
        >
          <select
            {...register('examId', { 
              required: 'Exam is required',
              onChange: (e) => setSelectedExam(e.target.value)
            })}
            className="input"
          >
            <option value="">Select Exam</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Subject Marks */}
      {examSubjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Marks</h3>
          <div className="space-y-4">
            {examSubjects.map(subject => (
              <div key={subject.id} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">
                  {subject.title} ({subject.code})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Total Marks"
                    error={errors.marks?.[subject.id]?.total?.message}
                  >
                    <input
                      {...register(`marks.${subject.id}.total`, { 
                        required: 'Total marks required',
                        min: { value: 1, message: 'Must be at least 1' },
                        valueAsNumber: true
                      })}
                      type="number"
                      className="input"
                      placeholder="Enter total marks"
                    />
                  </FormField>

                  <FormField
                    label="Obtained Marks"
                    error={errors.marks?.[subject.id]?.obtained?.message}
                  >
                    <input
                      {...register(`marks.${subject.id}.obtained`, { 
                        required: 'Obtained marks required',
                        min: { value: 0, message: 'Cannot be negative' },
                        valueAsNumber: true
                      })}
                      type="number"
                      className="input"
                      placeholder="Enter obtained marks"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          disabled={isLoading || examSubjects.length === 0}
          className="btn-primary"
        >
          {isLoading ? 'Saving...' : (isEdit ? 'Update Result' : 'Create Result')}
        </button>
      </div>
    </form>
  );

  const ResultDetails = ({ result }) => {
    const student = getStudentById(result.studentId);
    const exam = getExamById(result.examId);
    
    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student
              </label>
              <div className="text-gray-900">
                <div className="font-semibold">{student?.name}</div>
                <div className="text-sm text-gray-500">{student?.roll} • {student?.regNo}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam
              </label>
              <div className="text-gray-900">
                <div className="font-semibold">{exam?.title}</div>
                {exam?.date && (
                  <div className="text-sm text-gray-500">
                    {format(new Date(exam.date), 'MMMM dd, yyyy')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">GPA</div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.gpa?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">CGPA</div>
                <div className="text-2xl font-bold text-green-600">
                  {result.cgpa?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">Overall Percentage</div>
              <div className="text-2xl font-bold text-purple-600">
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Grade: {getLetterGrade(parseFloat(result.percentage))}
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Marks */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Obtained</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Percentage</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result.marks?.map(mark => {
                  const subject = getSubjectById(mark.subjectId);
                  const percentage = ((mark.obtained / mark.total) * 100).toFixed(1);
                  const grade = getLetterGrade(parseFloat(percentage));
                  
                  return (
                    <tr key={mark.subjectId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{subject?.title}</div>
                        <div className="text-sm text-gray-500">{subject?.code}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900">
                        {mark.obtained}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {mark.total}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900">
                        {percentage}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant={parseFloat(percentage) >= 80 ? 'success' : 
                                 parseFloat(percentage) >= 60 ? 'primary' : 
                                 parseFloat(percentage) >= 40 ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {grade}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => toast.info('Print functionality coming soon!')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
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
          <h1 className="text-3xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-600 mt-2">
            Manage exam results and calculate GPA/CGPA automatically
          </p>
        </div>
        <button
          onClick={handleAddResult}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Result</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{results.length}</div>
          <div className="text-sm text-gray-600">Total Results</div>
        </Card>
        <Card className="text-center">
          <Calculator className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.length > 0 ? 
              (results.reduce((sum, r) => sum + (r.gpa || 0), 0) / results.length).toFixed(2) : 
              '0.00'
            }
          </div>
          <div className="text-sm text-gray-600">Average GPA</div>
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.filter(r => {
              const percentage = r.marks?.length > 0 ? 
                ((r.marks.reduce((sum, mark) => sum + mark.obtained, 0) / 
                  r.marks.reduce((sum, mark) => sum + mark.total, 0)) * 100) : 0;
              return percentage >= 80;
            }).length}
          </div>
          <div className="text-sm text-gray-600">A+ Grades</div>
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {results.filter(r => {
              const percentage = r.marks?.length > 0 ? 
                ((r.marks.reduce((sum, mark) => sum + mark.obtained, 0) / 
                  r.marks.reduce((sum, mark) => sum + mark.total, 0)) * 100) : 0;
              return percentage < 40;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Failed</div>
        </Card>
      </div>

      {/* Results Table */}
      {enhancedResults.length === 0 ? (
        <Card>
          <EmptyState
            title="No Results Found"
            description="Start by adding exam results to track student performance."
            actionLabel="Add Result"
            onAction={handleAddResult}
            icon={Trophy}
          />
        </Card>
      ) : (
        <DataTable
          data={enhancedResults}
          columns={columns}
          searchPlaceholder="Search by student name, exam, or roll number..."
          emptyStateTitle="No results found"
          emptyStateDescription="Try adjusting your search criteria."
        />
      )}

      {/* Add Result Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Result"
        size="xl"
      >
        <ResultForm onSubmit={onSubmitAdd} />
      </Modal>

      {/* Edit Result Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Result"
        size="xl"
      >
        <ResultForm onSubmit={onSubmitEdit} isEdit />
      </Modal>

      {/* View Result Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Result Details"
        size="xl"
      >
        {selectedResult && <ResultDetails result={selectedResult} />}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Result"
        message={`Are you sure you want to delete this result? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Results;
