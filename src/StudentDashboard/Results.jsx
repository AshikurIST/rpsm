import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, FileText, Download, Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { getLetterGrade, calculateCGPA, getOverallGradeFromGPA } from '../lib/grade';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { toast } from 'sonner';

const StudentResults = () => {
  const { user } = useAuthStore();
  const { 
    results,
    getResultsByStudentId, 
    getExamById, 
    getSubjectById,
    exams,
    subjects,
    createResult,
  } = useDataStore();
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Get student's results (subscribe to results so UI updates when results change)
  const studentResults = (results || []).filter(r => r.studentId === (user?.id || 'student_1'));

  // Attach semester info to results and sort by time (oldest first for cumulative calculations)
  const deriveSemester = (result) => {
    const examSem = getExamById(result.examId)?.semester;
    if (typeof examSem === 'number') return examSem;
    // Fallback: infer from subjects' defined semesters (pick the most frequent, then lowest)
    const sems = (result.marks || [])
      .map(m => getSubjectById(m.subjectId)?.semester)
      .filter(s => typeof s === 'number');
    if (sems.length === 0) return null;
    const freq = sems.reduce((acc, s) => (acc[s] = (acc[s] || 0) + 1, acc), {});
    const mode = Object.keys(freq)
      .map(k => ({ s: Number(k), c: freq[k] }))
      .sort((a, b) => b.c - a.c || a.s - b.s)[0].s;
    return mode;
  };

  const resultsWithSemester = studentResults
    .map(r => ({ ...r, semester: deriveSemester(r) }))
    .filter(r => r.semester !== null)
    .sort((a, b) => a.semester - b.semester || new Date(a.createdAt) - new Date(b.createdAt));

  // Build semester options from the student's results and available exams
  const semesters = Array.from(new Set([
    1, // ensure Semester 1 is always considered
    ...resultsWithSemester.map(r => r.semester),
    ...(exams || []).map(e => e.semester).filter(s => typeof s === 'number')
  ])).sort((a, b) => a - b);

  // Filter by selected semester (if any)
  const filteredResults = selectedSemester === 'all'
    ? resultsWithSemester
    : resultsWithSemester.filter(r => r.semester === Number(selectedSemester));

  const sortedResults = filteredResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Per-semester CGPA up to the selected semester (inclusive)
  const cgpaUpToSelected = selectedSemester === 'all'
    ? (studentResults.length > 0 ? (studentResults[0]?.cgpa?.toFixed(2) || '0.00') : '0.00')
    : (calculateCGPA(resultsWithSemester.filter(r => r.semester <= Number(selectedSemester))) || 0).toFixed(2);

  // Prepare semester overview summaries
  const semesterSummaries = semesters.map(sem => {
    const inSem = resultsWithSemester.filter(r => r.semester === sem);
    const examsCount = inSem.length;
    
    // Calculate GPA only from completed exams with valid marks
    const validExams = inSem.filter(r => 
      r.marks && 
      r.marks.length > 0 && 
      r.marks.every(m => m.total > 0 && typeof m.obtained === 'number')
    );
    
    const semGPA = validExams.length > 0 
      ? (validExams.reduce((s, r) => s + (r.gpa || 0), 0) / validExams.length) 
      : 0;
    
    // Calculate CGPA up to this semester
    const cgpaToSem = calculateCGPA(
      resultsWithSemester.filter(r => r.semester <= sem && r.gpa)
    ) || 0;
    
    // Calculate average percentage from valid marks only
    const avgPercent = validExams.length > 0 
      ? validExams.map(r => {
          const total = r.marks.reduce((s, m) => s + m.total, 0);
          const obt = r.marks.reduce((s, m) => s + m.obtained, 0);
          return total > 0 ? (obt / total) * 100 : 0;
        }).reduce((s, p) => s + p, 0) / validExams.length
      : 0;
    
    const grade = validExams.length > 0 
      ? getOverallGradeFromGPA(semGPA).letter 
      : 'F';
    
    return {
      semester: sem,
      examsCount: validExams.length, // Only count valid exams
      semesterGPA: semGPA.toFixed(2),
      cgpaToSem: cgpaToSem.toFixed(2),
      avgPercent: avgPercent.toFixed(1),
      grade,
    };
  });

  // Calculate performance stats
  const stats = {
    totalExams: filteredResults.length,
    averageGPA: filteredResults.length > 0 ? 
      (filteredResults.reduce((sum, r) => sum + (r.gpa || 0), 0) / filteredResults.length).toFixed(2) : '0.00',
    currentCGPA: resultsWithSemester.length > 0 ? (calculateCGPA(resultsWithSemester) || 0).toFixed(2) : '0.00',
    highestGPA: filteredResults.length > 0 ? 
      Math.max(...filteredResults.map(r => r.gpa || 0)).toFixed(2) : '0.00'
  };

  // Initialize semester 1 data if missing
  useEffect(() => {
    const initializeSemester1 = async () => {
      if (!user) return;

      // Check if semester 1 data exists
      const sem1Results = resultsWithSemester.filter(r => r.semester === 1);
      if (sem1Results.length > 0) return;

      // Find all CSE semester-1 exams and subjects
      const sem1Exams = (exams || []).filter(e =>
        e?.semester === 1 &&
        (e?.department || '').toLowerCase().includes('computer science')
      );
      const sem1Subjects = (subjects || []).filter(s =>
        s?.semester === 1 &&
        (s?.department || '').toLowerCase().includes('computer science')
      );

      if (sem1Exams.length === 0 || sem1Subjects.length === 0) return;

      // Create a result for each semester 1 exam if not exists
      sem1Exams.forEach(exam => {
        const already = studentResults.some(r =>
          r.examId === exam.id &&
          r.studentId === (user.id || 'student_1')
        );

        if (!already) {
          const marks = sem1Subjects.map((s, idx) => ({
            subjectId: s.id,
            total: 100,
            obtained: [88, 82, 86][idx % 3] // Good passing grades for baseline
          }));

          createResult({
            studentId: user.id || 'student_1',
            examId: exam.id,
            marks,
          });
        }
      });
    };

    // Run initializer
    initializeSemester1();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, resultsWithSemester, exams, subjects, studentResults]);

  // Handle result details
  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const ResultCard = ({ result, index }) => {
    const exam = getExamById(result.examId);
    const totalMarks = result.marks?.reduce((sum, mark) => sum + mark.total, 0) || 0;
    const obtainedMarks = result.marks?.reduce((sum, mark) => sum + mark.obtained, 0) || 0;
    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(1) : 0;
    const grade = getLetterGrade(parseFloat(percentage));
    
    return (
      <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(result)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {exam?.title || 'Unknown Exam'}
            </h3>
            {exam?.date && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(exam.date), 'MMMM dd, yyyy')}
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Department: {exam?.department}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Overall Grade</div>
            <Badge 
              variant={parseFloat(percentage) >= 80 ? 'success' : 
                     parseFloat(percentage) >= 60 ? 'primary' : 
                     parseFloat(percentage) >= 40 ? 'warning' : 'danger'}
              size="lg"
            >
              {grade}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">GPA</div>
            <div className="text-lg font-bold text-blue-600">
              {result.gpa?.toFixed(2) || 'N/A'}
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">CGPA</div>
            <div className="text-lg font-bold text-green-600">
              {result.cgpa?.toFixed(2) || 'N/A'}
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Percentage</div>
            <div className="text-lg font-bold text-purple-600">
              {percentage}%
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Marks</div>
            <div className="text-lg font-bold text-gray-900">
              {obtainedMarks}/{totalMarks}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {result.marks?.length || 0} subjects
          </span>
          <div className="flex items-center text-blue-600 hover:text-blue-700">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </div>
        </div>
      </Card>
    );
  };

  const ResultDetails = ({ result }) => {
    const exam = getExamById(result.examId);
    const totalMarks = result.marks?.reduce((sum, mark) => sum + mark.total, 0) || 0;
    const obtainedMarks = result.marks?.reduce((sum, mark) => sum + mark.obtained, 0) || 0;
    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(1) : 0;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {exam?.title || 'Exam Result'}
          </h2>
          {exam?.date && (
            <p className="text-gray-600">
              {format(new Date(exam.date), 'MMMM dd, yyyy')}
            </p>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center">
            <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-600 mb-1">GPA</div>
            <div className="text-3xl font-bold text-blue-600">
              {result.gpa?.toFixed(2) || 'N/A'}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-600 mb-1">CGPA</div>
            <div className="text-3xl font-bold text-green-600">
              {result.cgpa?.toFixed(2) || 'N/A'}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg text-center">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-600 mb-1">Percentage</div>
            <div className="text-3xl font-bold text-purple-600">
              {percentage}%
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">Grade</div>
            <div className="text-3xl font-bold text-yellow-600">
              {getLetterGrade(parseFloat(percentage))}
            </div>
          </div>
        </div>

        {/* Subject-wise Performance */}
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
                  const subjectPercentage = ((mark.obtained / mark.total) * 100).toFixed(1);
                  const subjectGrade = getLetterGrade(parseFloat(subjectPercentage));
                  
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
                        {subjectPercentage}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant={parseFloat(subjectPercentage) >= 80 ? 'success' : 
                                 parseFloat(subjectPercentage) >= 60 ? 'primary' : 
                                 parseFloat(subjectPercentage) >= 40 ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {subjectGrade}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => toast.info('Print functionality coming soon!')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Marksheet</span>
          </button>
          <button
            onClick={() => setShowDetailModal(false)}
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
        <p className="text-gray-600 mt-2">
          View your academic performance and download marksheets
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalExams}</div>
          <div className="text-sm text-gray-600">{selectedSemester === 'all' ? 'Total Exams' : `Exams in Semester ${selectedSemester}`}</div>
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.averageGPA}</div>
          <div className="text-sm text-gray-600">{selectedSemester === 'all' ? 'Average GPA' : `Semester GPA (Sem ${selectedSemester})`}</div>
        </Card>
        <Card className="text-center">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.currentCGPA}</div>
          <div className="text-sm text-gray-600">Overall CGPA</div>
          {selectedSemester !== 'all' && (
            <div className="text-xs text-gray-500 mt-1">Up to Sem {selectedSemester}: {cgpaUpToSelected}</div>
          )}
        </Card>
        <Card className="text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stats.highestGPA}</div>
          <div className="text-sm text-gray-600">Highest GPA{selectedSemester !== 'all' ? ` (Sem ${selectedSemester})` : ''}</div>
        </Card>
      </div>

      {/* Semester Overview */}
      {semesters.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Semester</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Exams</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Semester GPA</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">CGPA up to Sem</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Avg %</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {semesterSummaries.map(s => (
                  <tr key={s.semester} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.semester}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{s.examsCount}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{s.semesterGPA}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{s.cgpaToSem}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{s.avgPercent}%</td>
                    <td className="px-4 py-3 text-center">
                      <Badge 
                        variant={s.grade.startsWith('A') ? 'success' : s.grade.startsWith('B') ? 'primary' : s.grade === 'C' || s.grade === 'C+' ? 'warning' : s.grade === 'D' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {s.grade}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Results List */}
      {sortedResults.length === 0 ? (
        <Card>
          <EmptyState
            title="No Results Available"
            description="Your exam results will appear here once they are published by the administration."
            icon={FileText}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Exam Results</h2>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
              <div className="text-sm text-gray-500">
                {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Selected Semester Summary */}
          {selectedSemester !== 'all' && (
            (() => {
              const s = semesterSummaries.find(x => x.semester === Number(selectedSemester));
              if (!s) return null;
              return (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester {s.semester} Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Semester GPA</div>
                      <div className="text-lg font-bold text-blue-600">{s.semesterGPA}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">CGPA up to Sem</div>
                      <div className="text-lg font-bold text-green-600">{s.cgpaToSem}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Avg %</div>
                      <div className="text-lg font-bold text-purple-600">{s.avgPercent}%</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Grade</div>
                      <div className="text-lg font-bold text-yellow-600">{s.grade}</div>
                    </div>
                  </div>
                </Card>
              );
            })()
          )}

          <div className="grid gap-6">
            {sortedResults.map((result, index) => (
              <ResultCard key={result.id} result={result} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Result Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detailed Result"
        size="xl"
      >
        {selectedResult && <ResultDetails result={selectedResult} />}
      </Modal>
    </div>
  );
};

export default StudentResults;
