import { Award, Download, TrendingUp, BookOpen } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import type { Grade } from '@/types';

interface PerformanceProps {
  grades: Grade[];
}

const subjectColors: Record<string, string> = {
  'Software Engineering': 'from-blue-500 to-cyan-500',
  'Python Programming & Data Structures': 'from-emerald-500 to-green-600',
  'C++ Object-Oriented Programming': 'from-orange-500 to-red-500',
};

export default function Performance({ grades }: PerformanceProps) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const totalGradePoints = grades.reduce((sum, g) => sum + g.gradePoint * g.credits, 0);
  const sgpa = (totalGradePoints / totalCredits).toFixed(2);
  const cgpa = sgpa; // same for single semester

  const handleDownloadReport = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      showToast('Please allow popups to download the report', 'error');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>EduQuest Academic Transcript - ${user?.name || 'Student'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; padding: 40px; color: #1e293b; background: #fff; }
    .header { text-align: center; border-bottom: 3px double #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #1e40af; letter-spacing: 2px; }
    .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
    .title { font-size: 20px; font-weight: bold; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
    .student-info { display: flex; justify-content: space-between; margin-bottom: 25px; padding: 15px 20px; background: #f8fafc; border-radius: 8px; }
    .info-item { font-size: 13px; }
    .info-label { color: #64748b; font-weight: 600; }
    .info-value { color: #1e293b; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th { background: #1e40af; color: white; padding: 12px 10px; font-size: 12px; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    tr:nth-child(even) { background: #f8fafc; }
    .grade-cell { font-weight: bold; }
    .summary { display: flex; gap: 20px; margin-bottom: 30px; }
    .summary-card { flex: 1; padding: 20px; border-radius: 12px; text-align: center; }
    .sgpa-card { background: linear-gradient(135deg, #1e40af, #4f46e5); color: white; }
    .cgpa-card { background: linear-gradient(135deg, #059669, #10b981); color: white; }
    .summary-label { font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
    .summary-value { font-size: 36px; font-weight: bold; margin-top: 5px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 30px; }
    .sig-block { text-align: center; }
    .sig-line { border-top: 2px solid #1e293b; width: 200px; margin: 50px auto 8px; }
    .sig-label { font-size: 12px; color: #64748b; font-weight: 600; }
    .stamp { position: absolute; bottom: 80px; right: 60px; width: 120px; height: 120px; border: 3px solid #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); opacity: 0.8; }
    .stamp-text { color: #dc2626; font-weight: bold; font-size: 11px; text-align: center; line-height: 1.3; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">EDUQUEST ACADEMY</div>
    <div class="subtitle">Empower Your Learning Journey · Accredited Engineering Institution</div>
    <div class="title">Official Academic Transcript</div>
  </div>

  <div class="student-info">
    <div class="info-item"><span class="info-label">Student Name:</span> <span class="info-value">${user?.name || 'N/A'}</span></div>
    <div class="info-item"><span class="info-label">Roll Number:</span> <span class="info-value">${user?.rollNo || 'N/A'}</span></div>
    <div class="info-item"><span class="info-label">Semester:</span> <span class="info-value">Odd 2026</span></div>
    <div class="info-item"><span class="info-label">Date:</span> <span class="info-value">${new Date().toLocaleDateString('en-IN')}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Subject</th>
        <th>Credits</th>
        <th>Internal (40)</th>
        <th>Lab (20)</th>
        <th>External (80)</th>
        <th>Total (140)</th>
        <th>Grade</th>
        <th>Grade Point</th>
      </tr>
    </thead>
    <tbody>
      ${grades.map((g) => `
        <tr>
          <td><strong>${g.subject}</strong></td>
          <td>${g.credits}</td>
          <td>${g.internalMarks}</td>
          <td>${g.labMarks}</td>
          <td>${g.externalMarks}</td>
          <td><strong>${g.totalMarks}</strong></td>
          <td class="grade-cell">${g.grade}</td>
          <td class="grade-cell">${g.gradePoint}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-card sgpa-card">
      <div class="summary-label">SGPA (Semester)</div>
      <div class="summary-value">${sgpa}</div>
    </div>
    <div class="summary-card cgpa-card">
      <div class="summary-label">CGPA (Overall)</div>
      <div class="summary-value">${cgpa}</div>
    </div>
    <div class="summary-card" style="background: #f8fafc; border: 2px solid #e2e8f0;">
      <div class="summary-label" style="color: #64748b;">Total Credits</div>
      <div class="summary-value" style="color: #1e293b;">${totalCredits}</div>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Examination Controller</div>
    </div>
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">Principal, EduQuest Academy</div>
    </div>
  </div>

  <div class="stamp">
    <div class="stamp-text">EDUQUEST<br>ACADEMY<br>VERIFIED</div>
  </div>

  <div class="footer">
    This is a computer-generated transcript and is valid without physical signature.<br>
    Generated on ${new Date().toLocaleString('en-IN')} · EduQuest Academy Student Portal
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      showToast('Academic report opened for download', 'success');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Performance & Report Card</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Semester gradebook with SGPA/CGPA and downloadable transcript.</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download Academic Report
        </button>
      </div>

      {/* SGPA/CGPA widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">SGPA</span>
          </div>
          <p className="text-4xl font-bold">{sgpa}</p>
          <p className="text-sm opacity-80 mt-1">Semester Grade Point Average</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">CGPA</span>
          </div>
          <p className="text-4xl font-bold">{cgpa}</p>
          <p className="text-sm opacity-80 mt-1">Cumulative Grade Point Average</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Credits</span>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white">{totalCredits}</p>
          <p className="text-sm text-slate-400 mt-1">Earned this semester</p>
        </div>
      </div>

      {/* Gradebook table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Semester Gradebook</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed marks breakdown for all 3 core subjects</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credits</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Internal (40)</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lab (20)</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">External (80)</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {grades.map((grade) => (
                <tr key={grade.subject} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${subjectColors[grade.subject]}`} />
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">{grade.subject}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{grade.credits}</td>
                  <td className="px-5 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{grade.internalMarks}</td>
                  <td className="px-5 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{grade.labMarks}</td>
                  <td className="px-5 py-4 text-center text-sm text-slate-600 dark:text-slate-300">{grade.externalMarks}</td>
                  <td className="px-5 py-4 text-center text-sm font-bold text-slate-800 dark:text-white">{grade.totalMarks}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      grade.grade === 'A+' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      grade.grade === 'A' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-bold text-slate-800 dark:text-white">{grade.gradePoint}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                <td className="px-5 py-4 text-sm text-slate-800 dark:text-white">Total / Average</td>
                <td className="px-5 py-4 text-center text-sm text-slate-800 dark:text-white">{totalCredits}</td>
                <td className="px-5 py-4 text-center text-sm text-slate-800 dark:text-white">{grades.reduce((s, g) => s + g.internalMarks, 0)}</td>
                <td className="px-5 py-4 text-center text-sm text-slate-800 dark:text-white">{grades.reduce((s, g) => s + g.labMarks, 0)}</td>
                <td className="px-5 py-4 text-center text-sm text-slate-800 dark:text-white">{grades.reduce((s, g) => s + g.externalMarks, 0)}</td>
                <td className="px-5 py-4 text-center text-sm text-slate-800 dark:text-white">{grades.reduce((s, g) => s + g.totalMarks, 0)}</td>
                <td colSpan={2} className="px-5 py-4 text-center text-sm text-blue-600 dark:text-blue-400">SGPA: {sgpa}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
