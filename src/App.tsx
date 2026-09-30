import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/modules/Dashboard';
import Assignments from '@/components/modules/Assignments';
import Lectures from '@/components/modules/Lectures';
import Performance from '@/components/modules/Performance';
import Fees from '@/components/modules/Fees';
import Planner from '@/components/modules/Planner';
import {
  seedAssignments,
  seedLectures,
  seedGrades,
  seedFeeCharges,
  seedPayments,
  seedTodos,
  seedNotifications,
} from '@/data/seed';
import type { ModuleKey, Assignment, Lecture, TodoTask, Notification, PaymentRecord, FeeCharge } from '@/types';

function EduQuestApp() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');

  // Persisted state
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('eduquest-assignments', seedAssignments);
  const [lectures, setLectures] = useLocalStorage<Lecture[]>('eduquest-lectures', seedLectures);
  const [grades] = useLocalStorage('eduquest-grades', seedGrades);
  const [feeCharges] = useLocalStorage<FeeCharge[]>('eduquest-fee-charges', seedFeeCharges);
  const [payments, setPayments] = useLocalStorage<PaymentRecord[]>('eduquest-payments', seedPayments);
  const [tasks, setTasks] = useLocalStorage<TodoTask[]>('eduquest-todos', seedTodos);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('eduquest-notifications', seedNotifications);

  const outstandingFee = feeCharges.reduce((s, c) => s + c.amount, 0) - payments.reduce((s, p) => s + p.amount, 0);

  // Assignment handlers
  const handleSubmitAssignment = useCallback((id: string, fileName: string, fileSize: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'submitted', fileName, fileSize, submittedAt: new Date().toISOString() }
          : a
      )
    );
  }, [setAssignments]);

  // Lecture handlers
  const handleToggleLectureComplete = useCallback((id: string) => {
    setLectures((prev) => prev.map((l) => (l.id === id ? { ...l, completed: !l.completed } : l)));
  }, [setLectures]);

  // Fee handlers
  const handlePayment = useCallback((amount: number, method: string) => {
    const transactionId = 'EDUQ' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newPayment: PaymentRecord = {
      id: 'p' + Math.random().toString(36).substring(2, 9),
      amount,
      method,
      date: new Date().toISOString().slice(0, 10),
      transactionId,
    };
    setPayments((prev) => [...prev, newPayment]);
    setNotifications((prev) => [
      {
        id: 'n' + Math.random().toString(36).substring(2, 9),
        title: 'Fee Payment Received',
        message: `Your fee payment of ₹${amount.toLocaleString('en-IN')} has been received. Transaction ID: ${transactionId}`,
        type: 'fee',
        read: false,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [setPayments, setNotifications]);

  // Todo handlers
  const handleAddTask = useCallback((task: Omit<TodoTask, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: TodoTask = {
      ...task,
      id: 't' + Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [setTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  // Notification handlers
  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  }, [setNotifications, showToast]);

  const handleDismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, [setNotifications]);

  const handleToggleNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }, [setNotifications]);

  if (!user) return <Login />;

  return (
    <Layout
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      onDismissNotification={handleDismissNotification}
      onToggleNotification={handleToggleNotification}
    >
      {activeModule === 'dashboard' && (
        <Dashboard assignments={assignments} outstandingFee={outstandingFee} onNavigate={setActiveModule} />
      )}
      {activeModule === 'assignments' && (
        <Assignments assignments={assignments} onSubmit={handleSubmitAssignment} />
      )}
      {activeModule === 'lectures' && (
        <Lectures lectures={lectures} onToggleComplete={handleToggleLectureComplete} />
      )}
      {activeModule === 'performance' && <Performance grades={grades} />}
      {activeModule === 'fees' && (
        <Fees charges={feeCharges} payments={payments} onPayment={handlePayment} />
      )}
      {activeModule === 'planner' && (
        <Planner tasks={tasks} onAdd={handleAddTask} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <EduQuestApp />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
