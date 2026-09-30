export type Subject = 'Software Engineering' | 'Python Programming & Data Structures' | 'C++ Object-Oriented Programming';

export type Role = 'student' | 'faculty';

export interface User {
  name: string;
  email: string;
  role: Role;
  rollNo?: string;
  avatar: string;
}

export interface Assignment {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted';
  fileName?: string;
  fileSize?: string;
  submittedAt?: string;
}

export interface Lecture {
  id: string;
  subject: Subject;
  module: string;
  title: string;
  duration: string;
  completed: boolean;
  description: string;
  notes: string;
}

export interface Grade {
  subject: Subject;
  credits: number;
  internalMarks: number;
  labMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface FeeCharge {
  label: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  date: string;
  transactionId: string;
}

export interface TodoTask {
  id: string;
  title: string;
  subject: Subject | 'General';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'fee' | 'lecture' | 'general';
  read: boolean;
  timestamp: string;
}

export type ModuleKey = 'dashboard' | 'assignments' | 'lectures' | 'performance' | 'fees' | 'planner';
