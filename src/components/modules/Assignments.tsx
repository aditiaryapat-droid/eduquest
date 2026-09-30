import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Clock, Download, X, FileCode, FileArchive } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import type { Assignment, Subject } from '@/types';

interface AssignmentsProps {
  assignments: Assignment[];
  onSubmit: (id: string, fileName: string, fileSize: string) => void;
}

const subjectOrder: Subject[] = ['Software Engineering', 'Python Programming & Data Structures', 'C++ Object-Oriented Programming'];

const subjectColors: Record<Subject, string> = {
  'Software Engineering': 'from-blue-500 to-cyan-500',
  'Python Programming & Data Structures': 'from-emerald-500 to-green-600',
  'C++ Object-Oriented Programming': 'from-orange-500 to-red-500',
};

const subjectBadges: Record<Subject, string> = {
  'Software Engineering': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Python Programming & Data Structures': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'C++ Object-Oriented Programming': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'py' || ext === 'cpp' || ext === 'c' || ext === 'h') return <FileCode className="h-5 w-5" />;
  if (ext === 'zip' || ext === 'rar') return <FileArchive className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Assignments({ assignments, onSubmit }: AssignmentsProps) {
  const { showToast } = useToast();
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<{ name: string; size: string; data?: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (assignmentId: string, file: File) => {
    const validTypes = ['.pdf', '.docx', '.doc', '.zip', '.cpp', '.py', '.c', '.h', '.txt'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      showToast('Invalid file type. Use PDF, DOCX, ZIP, CPP, or PY', 'error');
      return;
    }

    setUploadingId(assignmentId);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            const size = formatFileSize(file.size);
            onSubmit(assignmentId, file.name, size);
            // Store file data for preview/download
            try {
              const stored = JSON.parse(localStorage.getItem('eduquest-uploaded-files') || '{}');
              stored[assignmentId] = { name: file.name, size, data };
              localStorage.setItem('eduquest-uploaded-files', JSON.stringify(stored));
            } catch {
              // localStorage might be full, skip storing data
            }
            setUploadingId(null);
            setUploadProgress(0);
            showToast(`"${file.name}" uploaded successfully!`, 'success');
            return 0;
          }
          return prev + 10;
        });
      }, 150);
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
      setUploadingId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (assignmentId: string, fileName: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('eduquest-uploaded-files') || '{}');
      const fileData = stored[assignmentId];
      if (fileData?.data) {
        const link = document.createElement('a');
        link.href = fileData.data;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('File download started', 'info');
      } else {
        showToast('File data not available', 'error');
      }
    } catch {
      showToast('Download failed', 'error');
    }
  };

  const handleView = (assignmentId: string, fileName: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('eduquest-uploaded-files') || '{}');
      const fileData = stored[assignmentId];
      setPreviewFile({ name: fileName, size: fileData?.size || 'Unknown', data: fileData?.data });
    } catch {
      setPreviewFile({ name: fileName, size: 'Unknown' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Assignment Upload Portal</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Submit your assignments for all 3 core engineering subjects. Drag & drop or browse to upload.</p>
      </div>

      {subjectOrder.map((subject) => {
        const subjectAssignments = assignments.filter((a) => a.subject === subject);
        if (subjectAssignments.length === 0) return null;

        return (
          <div key={subject} className="space-y-3">
            {/* Subject header */}
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${subjectColors[subject]}`} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{subject}</h3>
              <span className="text-xs text-slate-400">{subjectAssignments.length} assignments</span>
            </div>

            {/* Assignment cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {subjectAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-slate-800 dark:text-white">{assignment.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{assignment.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border flex-shrink-0 ${
                          assignment.status === 'submitted'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {assignment.status === 'submitted' ? (
                          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Submitted</span>
                        ) : (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                      <Clock className="h-3.5 w-3.5" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Upload zone or submitted file */}
                  {assignment.status === 'pending' ? (
                    <div className="px-5 pb-5">
                      <input
                        ref={(el) => { fileInputRefs.current[assignment.id] = el; }}
                        type="file"
                        accept=".pdf,.docx,.doc,.zip,.cpp,.py,.c,.h,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(assignment.id, file);
                          e.target.value = '';
                        }}
                      />
                      {uploadingId === assignment.id ? (
                        <div className="rounded-xl border-2 border-blue-500/30 bg-blue-500/5 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Uploading...</span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className="h-full rounded-full progress-shimmer animate-shimmer transition-all duration-150"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragOverId(assignment.id); }}
                          onDragLeave={() => setDragOverId(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverId(null);
                            const file = e.dataTransfer.files[0];
                            if (file) handleFileSelect(assignment.id, file);
                          }}
                          onClick={() => fileInputRefs.current[assignment.id]?.click()}
                          className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                            dragOverId === assignment.id
                              ? 'drag-active'
                              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Drag & drop or click to browse</p>
                          <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP, CPP, PY · Max 10MB</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 pb-5">
                      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            {getFileIcon(assignment.fileName || '')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{assignment.fileName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {assignment.fileSize} · Submitted on {new Date(assignment.submittedAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleView(assignment.id, assignment.fileName || '')}
                            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            View File
                          </button>
                          <button
                            onClick={() => handleDownload(assignment.id, assignment.fileName || '')}
                            className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Download className="h-4 w-4" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewFile(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[80vh] flex flex-col animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {getFileIcon(previewFile.name)}
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{previewFile.name}</p>
                  <p className="text-xs text-slate-400">{previewFile.size}</p>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {previewFile.data ? (
                <iframe src={previewFile.data} className="w-full h-full min-h-[400px] rounded-xl border-0" title={previewFile.name} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <FileText className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">File preview not available. Use Download instead.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
