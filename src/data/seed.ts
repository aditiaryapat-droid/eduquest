import type { Assignment, Lecture, Grade, FeeCharge, TodoTask, Notification, PaymentRecord } from '@/types';

export const seedAssignments: Assignment[] = [
  {
    id: 'a1',
    subject: 'Software Engineering',
    title: 'SRS Documentation & FSM Controller Design',
    description: 'Create a complete Software Requirements Specification document for a Library Management System, including a Finite State Machine diagram for the book checkout controller.',
    dueDate: '2026-10-10',
    status: 'pending',
  },
  {
    id: 'a2',
    subject: 'Software Engineering',
    title: 'Agile Sprint Planning & User Story Mapping',
    description: 'Design a 2-week sprint backlog with user stories, story points, and acceptance criteria for an e-commerce checkout flow.',
    dueDate: '2026-10-15',
    status: 'pending',
  },
  {
    id: 'a3',
    subject: 'Python Programming & Data Structures',
    title: 'Pandas Data Manipulation & Statistical Modeling',
    description: 'Use Pandas to clean, transform, and analyze a real-world CSV dataset. Apply statistical modeling with scikit-learn and submit a Jupyter notebook.',
    dueDate: '2026-10-08',
    status: 'pending',
  },
  {
    id: 'a4',
    subject: 'Python Programming & Data Structures',
    title: 'Multivariate Distributions & Hypothesis Testing',
    description: 'Implement multivariate Gaussian distribution sampling and perform hypothesis testing (t-test, ANOVA) on generated data.',
    dueDate: '2026-10-20',
    status: 'pending',
  },
  {
    id: 'a5',
    subject: 'C++ Object-Oriented Programming',
    title: 'Pointers, Memory Allocation & Call-by-Reference Practical',
    description: 'Write C++ programs demonstrating dynamic memory allocation (new/delete), pointer arithmetic, and call-by-reference using reference variables.',
    dueDate: '2026-10-12',
    status: 'pending',
  },
  {
    id: 'a6',
    subject: 'C++ Object-Oriented Programming',
    title: 'Inheritance, Polymorphism & Virtual Functions',
    description: 'Build a class hierarchy for a Banking System using single, multiple, and multilevel inheritance with virtual function overrides.',
    dueDate: '2026-10-18',
    status: 'pending',
  },
];

export const seedLectures: Lecture[] = [
  // Software Engineering
  {
    id: 'l1',
    subject: 'Software Engineering',
    module: 'Agile vs Waterfall',
    title: 'Introduction to SDLC Models',
    duration: '32:14',
    completed: false,
    description: 'Compare Waterfall and Agile methodologies, understand when to use each, and explore the Scrum framework.',
    notes: 'Waterfall: sequential, rigid, good for fixed-scope. Agile: iterative, flexible, good for evolving requirements. Scrum roles: Product Owner, Scrum Master, Development Team.',
  },
  {
    id: 'l2',
    subject: 'Software Engineering',
    module: 'SRS & Architecture',
    title: 'Writing Software Requirements Specifications',
    duration: '28:45',
    completed: false,
    description: 'Learn the IEEE 830 standard for SRS documents, functional vs non-functional requirements, and architectural patterns.',
    notes: 'SRS sections: Introduction, Overall Description, Specific Requirements. Functional = what the system does. Non-functional = performance, security, usability.',
  },
  {
    id: 'l3',
    subject: 'Software Engineering',
    module: 'Agile vs Waterfall',
    title: 'Scrum Ceremonies & Sprint Planning',
    duration: '35:20',
    completed: false,
    description: 'Deep dive into Daily Standups, Sprint Reviews, Retrospectives, and Backlog Refinement sessions.',
    notes: 'Sprint = 2-4 weeks. Daily Standup: What did I do? What will I do? Blockers? Review: demo working software. Retro: what went well, what to improve.',
  },
  // Python
  {
    id: 'l4',
    subject: 'Python Programming & Data Structures',
    module: 'Pandas & Series',
    title: 'Pandas DataFrames & Series Operations',
    duration: '41:10',
    completed: false,
    description: 'Master Pandas Series and DataFrame creation, indexing, slicing, and groupby operations for data analysis.',
    notes: 'Series: 1D labeled array. DataFrame: 2D labeled. Key ops: loc[], iloc[], groupby(), merge(), pivot_table(). Use read_csv() to load data.',
  },
  {
    id: 'l5',
    subject: 'Python Programming & Data Structures',
    module: 'Multivariate Distributions',
    title: 'Statistical Modeling with SciPy',
    duration: '38:55',
    completed: false,
    description: 'Explore multivariate Gaussian distributions, covariance matrices, and hypothesis testing using SciPy stats.',
    notes: 'scipy.stats.norm for Gaussian. ttest_ind() for two-sample t-test. f_oneway() for ANOVA. Covariance matrix: np.cov(). Multivariate normal: np.random.multivariate_normal().',
  },
  {
    id: 'l6',
    subject: 'Python Programming & Data Structures',
    module: 'Pandas & Series',
    title: 'Data Visualization with Matplotlib & Seaborn',
    duration: '29:30',
    completed: false,
    description: 'Create publication-quality plots: line charts, scatter plots, heatmaps, and pair plots for exploratory data analysis.',
    notes: 'plt.figure(), plt.subplot(). Seaborn: sns.heatmap(), sns.pairplot(), sns.distplot(). Always label axes and add titles.',
  },
  // C++
  {
    id: 'l7',
    subject: 'C++ Object-Oriented Programming',
    module: 'Memory Management & References',
    title: 'Pointers & Dynamic Memory Allocation',
    duration: '44:22',
    completed: false,
    description: 'Understand pointer arithmetic, dynamic allocation with new/delete, and memory leaks in C++.',
    notes: 'Pointer: variable storing address. & = address-of. * = dereference. new = heap alloc. delete = heap free. Always pair new/delete to avoid leaks. Smart pointers (unique_ptr, shared_ptr) recommended.',
  },
  {
    id: 'l8',
    subject: 'C++ Object-Oriented Programming',
    module: 'Memory Management & References',
    title: 'References & Call-by-Reference',
    duration: '26:18',
    completed: false,
    description: 'Learn reference variables, pass-by-reference vs pass-by-pointer, and when to use each in function parameters.',
    notes: 'Reference = alias for existing variable. Must be initialized. Cannot be null. Prefer references over pointers for function params. Use const reference for read-only.',
  },
  {
    id: 'l9',
    subject: 'C++ Object-Oriented Programming',
    module: 'OOP Concepts',
    title: 'Inheritance & Virtual Functions',
    duration: '39:50',
    completed: false,
    description: 'Deep dive into single/multiple inheritance, virtual functions, vtables, and runtime polymorphism.',
    notes: 'virtual = enables dynamic dispatch. Pure virtual (= 0) = abstract class. vtable = per-class function pointer table. Override keyword (C++11) catches signature mismatches.',
  },
];

export const seedGrades: Grade[] = [
  {
    subject: 'Software Engineering',
    credits: 4,
    internalMarks: 38,
    labMarks: 18,
    externalMarks: 72,
    totalMarks: 128,
    grade: 'A',
    gradePoint: 8,
  },
  {
    subject: 'Python Programming & Data Structures',
    credits: 4,
    internalMarks: 40,
    labMarks: 19,
    externalMarks: 75,
    totalMarks: 134,
    grade: 'A+',
    gradePoint: 9,
  },
  {
    subject: 'C++ Object-Oriented Programming',
    credits: 4,
    internalMarks: 36,
    labMarks: 17,
    externalMarks: 68,
    totalMarks: 121,
    grade: 'A',
    gradePoint: 8,
  },
];

export const seedFeeCharges: FeeCharge[] = [
  { label: 'Tuition Fee', amount: 55000 },
  { label: 'Lab & Computer Centre Fee', amount: 12000 },
  { label: 'Examination Fee', amount: 10000 },
  { label: 'Library Charges', amount: 8000 },
];

export const seedPayments: PaymentRecord[] = [
  {
    id: 'p1',
    amount: 60000,
    method: 'UPI - Google Pay',
    date: '2026-07-15',
    transactionId: 'EDUQ20260715001',
  },
];

export const seedTodos: TodoTask[] = [
  {
    id: 't1',
    title: 'Complete Python Pandas lab exercise',
    subject: 'Python Programming & Data Structures',
    priority: 'High',
    dueDate: '2026-10-05',
    completed: false,
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 't2',
    title: 'Prepare for C++ viva on pointers',
    subject: 'C++ Object-Oriented Programming',
    priority: 'High',
    dueDate: '2026-10-07',
    completed: false,
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 't3',
    title: 'Review Agile vs Waterfall notes',
    subject: 'Software Engineering',
    priority: 'Medium',
    dueDate: '2026-10-09',
    completed: false,
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 't4',
    title: 'Buy graph paper for FSM diagrams',
    subject: 'General',
    priority: 'Low',
    dueDate: '2026-10-03',
    completed: true,
    createdAt: '2026-09-25T10:00:00Z',
  },
];

export const seedNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Python Lab Assignment Due',
    message: 'Pandas Data Manipulation & Statistical Modeling is due this Friday. Submit before 11:59 PM.',
    type: 'assignment',
    read: false,
    timestamp: '2026-09-29T09:30:00Z',
  },
  {
    id: 'n2',
    title: 'Fee Payment Received',
    message: 'Your fee payment of ₹60,000 has been received. Transaction ID: EDUQ20260715001.',
    type: 'fee',
    read: false,
    timestamp: '2026-07-15T14:00:00Z',
  },
  {
    id: 'n3',
    title: 'New C++ Lecture Uploaded',
    message: 'Inheritance & Virtual Functions lecture is now available in the C++ module.',
    type: 'lecture',
    read: false,
    timestamp: '2026-09-28T16:00:00Z',
  },
  {
    id: 'n4',
    title: 'Outstanding Fee Reminder',
    message: 'You have an outstanding fee balance of ₹25,000. Please clear it before the exam period.',
    type: 'fee',
    read: true,
    timestamp: '2026-09-20T11:00:00Z',
  },
];

export const codingQuotes: string[] = [
  'The best way to predict the future is to invent it. — Alan Kay',
  'Code is like humor. When you have to explain it, it\'s bad. — Cory House',
  'First, solve the problem. Then, write the code. — John Johnson',
  'Talk is cheap. Show me the code. — Linus Torvalds',
  'Programs must be written for people to read. — Harold Abelson',
  'The function of good software is to make the complex appear simple. — Grady Booch',
  'Simplicity is the soul of efficiency. — Austin Freeman',
  'Make it work, make it right, make it fast. — Kent Beck',
];

export const todayTimetable = [
  { time: '09:00 - 10:30', subject: 'Software Engineering' as const, room: 'Lab 204', instructor: 'Dr. Rajesh Kumar' },
  { time: '11:00 - 12:30', subject: 'Python Programming & Data Structures' as const, room: 'Lab 101', instructor: 'Prof. Anita Sharma' },
  { time: '14:00 - 15:30', subject: 'C++ Object-Oriented Programming' as const, room: 'Lab 307', instructor: 'Dr. Vikram Singh' },
];
