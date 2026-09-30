import { BookOpen, FileWarning, CalendarClock, CreditCard, Clock, MapPin, User as UserIcon, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { todayTimetable } from '@/data/seed';
import type { Assignment, ModuleKey } from '@/types';

interface DashboardProps {
  assignments: Assignment[];
  outstandingFee: number;
  onNavigate: (m: ModuleKey) => void;
}

export default function Dashboard({ assignments, outstandingFee, onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;

  const metrics = [
    {
      label: 'Active Courses',
      value: '3',
      sub: 'SE · Python · C++',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Pending Assignments',
      value: String(pendingCount),
      sub: `${submittedCount} submitted`,
      icon: <FileWarning className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Current Attendance',
      value: '88.5%',
      sub: 'Above 75% minimum',
      icon: <CalendarClock className="h-6 w-6" />,
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Outstanding Dues',
      value: `₹${outstandingFee.toLocaleString('en-IN')}`,
      sub: outstandingFee > 0 ? 'Payment pending' : 'All cleared',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'EduQuest Scholar'}!</h2>
          <p className="text-blue-300 text-sm sm:text-base">You have {pendingCount} pending assignments and {outstandingFee > 0 ? `₹${outstandingFee.toLocaleString('en-IN')} in dues` : 'no outstanding dues'}.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => onNavigate('assignments')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-all flex items-center gap-2"
            >
              View Assignments <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-all flex items-center gap-2"
            >
              Pay Fees <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center ${m.text} group-hover:scale-110 transition-transform`}>
                {m.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{m.value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">{m.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-200 dark:border-slate-800">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Today's Schedule</h3>
          <span className="ml-auto text-xs text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {todayTimetable.map((slot, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex-shrink-0 w-28 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {slot.time}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{slot.subject}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {slot.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-3 w-3" /> {slot.instructor}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                Scheduled
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Assignment Progress</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-300">Submitted</span>
                <span className="font-semibold text-slate-800 dark:text-white">{submittedCount} / {assignments.length}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
                  style={{ width: `${assignments.length > 0 ? (submittedCount / assignments.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-300">Pending</span>
                <span className="font-semibold text-slate-800 dark:text-white">{pendingCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${assignments.length > 0 ? (pendingCount / assignments.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Course Overview</h3>
          </div>
          <div className="space-y-2">
            {['Software Engineering', 'Python Programming & Data Structures', 'C++ Object-Oriented Programming'].map((course) => (
              <div key={course} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{course}</span>
                <span className="text-xs text-slate-400 flex-shrink-0 ml-2">4 Credits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
