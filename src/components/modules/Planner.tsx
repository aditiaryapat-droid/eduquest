import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, X, Flag, Calendar } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import type { TodoTask, Subject } from '@/types';

interface PlannerProps {
  tasks: TodoTask[];
  onAdd: (task: Omit<TodoTask, 'id' | 'createdAt' | 'completed'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const subjectOptions: (Subject | 'General')[] = [
  'Software Engineering',
  'Python Programming & Data Structures',
  'C++ Object-Oriented Programming',
  'General',
];

const priorityColors = {
  High: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
};

const subjectShort: Record<string, string> = {
  'Software Engineering': 'SE',
  'Python Programming & Data Structures': 'Python',
  'C++ Object-Oriented Programming': 'C++',
  General: 'General',
};

type FilterTab = 'all' | 'active' | 'completed';

export default function Planner({ tasks, onAdd, onToggle, onDelete }: PlannerProps) {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject | 'General'>('General');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDate, setNewDate] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }
    if (!newDate) {
      showToast('Please select a target date', 'error');
      return;
    }
    onAdd({ title: newTitle.trim(), subject: newSubject, priority: newPriority, dueDate: newDate });
    setNewTitle('');
    setNewSubject('General');
    setNewPriority('Medium');
    setNewDate('');
    setShowAdd(false);
    showToast('Task added successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Exam Planner & To-Do List</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track coding exercises, lab practicals, and viva preparations.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Circle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {([
          { key: 'all', label: 'All', count: tasks.length },
          { key: 'active', label: 'Active', count: activeCount },
          { key: 'completed', label: 'Completed', count: completedCount },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === tab.key ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ListTodo className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">No tasks {filter !== 'all' ? `in ${filter}` : ''}. Add one to get started!</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center gap-3 p-4 rounded-xl border transition-all bg-white dark:bg-slate-900 ${
                task.completed
                  ? 'border-slate-200 dark:border-slate-800 opacity-60'
                  : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => onToggle(task.id)}
                className="flex-shrink-0 transition-transform hover:scale-110"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{subjectShort[task.subject]}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${priorityColors[task.priority]}`}>
                    <Flag className="h-3 w-3 inline mr-1" />{task.priority}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onDelete(task.id);
                  showToast('Task deleted', 'info');
                }}
                className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add New Task</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Complete Python sorting algorithm exercise"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as Subject | 'General')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjectOptions.map((s) => (
                      <option key={s} value={s}>{subjectShort[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" /> Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
