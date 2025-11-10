// Grade calculation system
export const GRADE_SCALE = [
  { min: 80, max: 100, letter: 'A+', gpa: 4.0 },
  { min: 75, max: 79, letter: 'A', gpa: 3.75 },
  { min: 70, max: 74, letter: 'A-', gpa: 3.5 },
  { min: 65, max: 69, letter: 'B+', gpa: 3.25 },
  { min: 60, max: 64, letter: 'B', gpa: 3.0 },
  { min: 55, max: 59, letter: 'B-', gpa: 2.75 },
  { min: 50, max: 54, letter: 'C+', gpa: 2.5 },
  { min: 45, max: 49, letter: 'C', gpa: 2.25 },
  { min: 40, max: 44, letter: 'D', gpa: 2.0 },
  { min: 0, max: 39, letter: 'F', gpa: 0.0 },
];

/**
 * Convert marks to percentage
 */
export const calculatePercentage = (obtained, total) => {
  if (!total || total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100; // Round to 2 decimal places
};

/**
 * Get grade info from percentage
 */
export const getGradeFromPercentage = (percentage) => {
  const grade = GRADE_SCALE.find(g => percentage >= g.min && percentage <= g.max);
  return grade || GRADE_SCALE[GRADE_SCALE.length - 1]; // Default to F if not found
};

/**
 * Get grade info from marks
 */
export const getGradeFromMarks = (obtained, total) => {
  const percentage = calculatePercentage(obtained, total);
  return getGradeFromPercentage(percentage);
};

/**
 * Calculate GPA for a single exam result
 * Takes array of subject results with credits
 */
export const calculateGPA = (subjectResults, subjects) => {
  if (!subjectResults || !subjects || subjectResults.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  subjectResults.forEach(result => {
    const subject = subjects.find(s => s.id === result.subjectId);
    if (subject && result.total && result.obtained !== undefined) {
      const percentage = calculatePercentage(result.obtained, result.total);
      const grade = getGradeFromPercentage(percentage);
      const credit = subject.credit || 3; // Default credit if not specified
      
      totalPoints += grade.gpa * credit;
      totalCredits += credit;
    }
  });
  
  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate CGPA from multiple exam results
 * Simple average of GPAs weighted by total credits
 */
export const calculateCGPA = (examResults, subjects) => {
  if (!examResults || examResults.length === 0) return 0;
  
  let totalGPAPoints = 0;
  let totalExams = 0;
  
  examResults.forEach(examResult => {
    if (examResult.gpa && examResult.gpa > 0) {
      totalGPAPoints += examResult.gpa;
      totalExams += 1;
    }
  });
  
  if (totalExams === 0) return 0;
  return Math.round((totalGPAPoints / totalExams) * 100) / 100; // Round to 2 decimal places
};

/**
 * Get overall grade from GPA
 */
export const getOverallGradeFromGPA = (gpa) => {
  if (!gpa || gpa === 0) {
    return { letter: 'F', gpa: 0.0 };
  }

  // For GPA 3.75 and above
  if (gpa >= 3.75) return { letter: 'A', gpa: 3.75 };
  
  // For GPA 3.5 to 3.74
  if (gpa >= 3.5) return { letter: 'A-', gpa: 3.5 };
  
  // For GPA 3.25 to 3.49
  if (gpa >= 3.25) return { letter: 'B+', gpa: 3.25 };
  
  // For GPA 3.0 to 3.24
  if (gpa >= 3.0) return { letter: 'B', gpa: 3.0 };
  
  // For GPA 2.75 to 2.99
  if (gpa >= 2.75) return { letter: 'B-', gpa: 2.75 };
  
  // For GPA 2.5 to 2.74
  if (gpa >= 2.5) return { letter: 'C+', gpa: 2.5 };
  
  // For GPA 2.25 to 2.49
  if (gpa >= 2.25) return { letter: 'C', gpa: 2.25 };
  
  // For GPA 2.0 to 2.24
  if (gpa >= 2.0) return { letter: 'D', gpa: 2.0 };
  
  // For GPA below 2.0
  return { letter: 'F', gpa: 0.0 };
  
  return GRADE_SCALE[GRADE_SCALE.length - 1]; // Default to F
};

/**
 * Format GPA display
 */
export const formatGPA = (gpa) => {
  return gpa ? gpa.toFixed(2) : '0.00';
};

/**
 * Get letter grade from percentage (shorthand function)
 */
export const getLetterGrade = (percentage) => {
  const grade = getGradeFromPercentage(percentage);
  return grade.letter;
};

/**
 * Get grade color for display
 */
export const getGradeColor = (letter) => {
  const colors = {
    'A+': 'text-green-600 bg-green-50',
    'A': 'text-green-600 bg-green-50',
    'A-': 'text-green-600 bg-green-50',
    'B+': 'text-blue-600 bg-blue-50',
    'B': 'text-blue-600 bg-blue-50',
    'B-': 'text-blue-600 bg-blue-50',
    'C+': 'text-yellow-600 bg-yellow-50',
    'C': 'text-yellow-600 bg-yellow-50',
    'D': 'text-orange-600 bg-orange-50',
    'F': 'text-red-600 bg-red-50',
  };
  return colors[letter] || 'text-gray-600 bg-gray-50';
};
