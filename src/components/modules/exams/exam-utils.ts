import type { StudentExamResultItem } from "@/types";

/**
 * Letter grade to GPA mapping based on standard Bangladeshi grading system
 */
export function letterGradeToGpa(grade?: string | null): number {
  if (!grade) return 0;
  const normalized = grade.trim().toUpperCase();
  switch (normalized) {
    case "A+":
      return 5.0;
    case "A":
      return 4.0;
    case "A-":
      return 3.5;
    case "B":
      return 3.0;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    default:
      return 0.0;
  }
}

/**
 * Robust grading calculator based on marks obtained and total marks
 */
export function computeGradeAndGpa(
  marks: number,
  totalMarks: number,
  passMarks: number,
): {
  letterGrade: string;
  gpa: string;
  gpaNumber: number;
  isPassed: boolean;
} {
  const safeTotal = totalMarks > 0 ? totalMarks : 100;
  const safeMarks = Number(marks) || 0;
  const safePassMarks = Number(passMarks) || 40;

  if (safeMarks < safePassMarks) {
    return {
      letterGrade: "F",
      gpa: "0.00",
      gpaNumber: 0.0,
      isPassed: false,
    };
  }

  const percentage = (safeMarks / safeTotal) * 100;

  if (percentage >= 80) {
    return { letterGrade: "A+", gpa: "5.00", gpaNumber: 5.0, isPassed: true };
  }
  if (percentage >= 70) {
    return { letterGrade: "A", gpa: "4.00", gpaNumber: 4.0, isPassed: true };
  }
  if (percentage >= 60) {
    return { letterGrade: "A-", gpa: "3.50", gpaNumber: 3.5, isPassed: true };
  }
  if (percentage >= 50) {
    return { letterGrade: "B", gpa: "3.00", gpaNumber: 3.0, isPassed: true };
  }
  if (percentage >= 40) {
    return { letterGrade: "C", gpa: "2.00", gpaNumber: 2.0, isPassed: true };
  }
  if (percentage >= 33) {
    return { letterGrade: "D", gpa: "1.00", gpaNumber: 1.0, isPassed: true };
  }

  return {
    letterGrade: "F",
    gpa: "0.00",
    gpaNumber: 0.0,
    isPassed: false,
  };
}

/**
 * Format any GPA value safely to 2 decimal places
 */
export function formatGpa(gpa?: number | string | null): string {
  if (gpa === undefined || gpa === null) return "—";
  const num = typeof gpa === "number" ? gpa : Number(gpa);
  if (Number.isNaN(num) || num < 0) return "—";
  return num.toFixed(2);
}

/**
 * Normalizes raw API exam result items from various backend response shapes
 * (e.g. backend `{ exam: ..., result: ... }` or flattened `{ examId, ... }`)
 * into a uniform `StudentExamResultItem`.
 */
export function normalizeStudentExamResult(
  raw: unknown,
): StudentExamResultItem {
  if (!raw || typeof raw !== "object") {
    return {
      id: "",
      examId: "",
      examTitle: "Assessment",
      examDate: "",
      batchName: "Enrolled Batch",
      totalMarks: 100,
      passMarks: 40,
      marksObtained: 0,
      letterGrade: "F",
      gpa: 0,
      isPassed: false,
    };
  }

  const record = raw as Record<string, unknown>;
  const exam = (record.exam as Record<string, unknown>) ?? record;
  const result = (record.result as Record<string, unknown>) ?? record;

  const totalMarks = Number(exam.totalMarks ?? record.totalMarks ?? 100);
  const passMarks = Number(exam.passMarks ?? record.passMarks ?? 40);
  const marksObtained = Number(
    result.marksObtained ?? record.marksObtained ?? 0,
  );

  const computed = computeGradeAndGpa(marksObtained, totalMarks, passMarks);

  const letterGrade =
    (typeof result.grade === "string" && result.grade) ||
    (typeof result.letterGrade === "string" && result.letterGrade) ||
    (typeof record.letterGrade === "string" && record.letterGrade) ||
    computed.letterGrade;

  let gpa: number = computed.gpaNumber;
  const rawGpa = result.gpa ?? record.gpa;
  if (typeof rawGpa === "number" && !Number.isNaN(rawGpa)) {
    gpa = rawGpa;
  } else if (
    rawGpa !== undefined &&
    rawGpa !== null &&
    !Number.isNaN(Number(rawGpa))
  ) {
    gpa = Number(rawGpa);
  } else if (letterGrade) {
    gpa = letterGradeToGpa(letterGrade);
  }

  const isPassed =
    result.isPassed !== undefined
      ? Boolean(result.isPassed)
      : record.isPassed !== undefined
        ? Boolean(record.isPassed)
        : marksObtained >= passMarks;

  const examBatch = exam.batch as Record<string, unknown> | undefined;
  const recordBatch = record.batch as Record<string, unknown> | undefined;

  const batchName =
    (typeof examBatch?.name === "string" && examBatch.name) ||
    (typeof record.batchName === "string" && record.batchName) ||
    (typeof recordBatch?.name === "string" && recordBatch.name) ||
    "Enrolled Batch";

  const examTitle =
    (typeof exam.title === "string" && exam.title) ||
    (typeof record.examTitle === "string" && record.examTitle) ||
    (typeof record.title === "string" && record.title) ||
    "Assessment";

  const examDate =
    (typeof exam.examDate === "string" && exam.examDate) ||
    (typeof record.examDate === "string" && record.examDate) ||
    "";

  const examId =
    (typeof exam.id === "string" && exam.id) ||
    (typeof result.examId === "string" && result.examId) ||
    (typeof record.examId === "string" && record.examId) ||
    "";

  const id =
    (typeof result.id === "string" && result.id) ||
    (typeof record.id === "string" && record.id) ||
    examId ||
    Math.random().toString();

  const rank =
    typeof result.rank === "number"
      ? result.rank
      : typeof record.rank === "number"
        ? record.rank
        : undefined;

  const remarks =
    (typeof result.remarks === "string" && result.remarks) ||
    (typeof record.remarks === "string" && record.remarks) ||
    null;

  const examStats = exam.stats as Record<string, unknown> | undefined;
  const highestMark =
    typeof examStats?.highestMark === "number"
      ? examStats.highestMark
      : typeof record.highestMark === "number"
        ? record.highestMark
        : undefined;

  const averageMark =
    typeof examStats?.averageMark === "number"
      ? examStats.averageMark
      : typeof record.averageMark === "number"
        ? record.averageMark
        : undefined;

  return {
    id,
    examId,
    examTitle,
    examDate,
    batchName,
    totalMarks,
    passMarks,
    marksObtained,
    letterGrade,
    gpa,
    isPassed,
    rank,
    remarks,
    highestMark,
    averageMark,
  };
}
