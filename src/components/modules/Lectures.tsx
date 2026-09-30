import { useState, useRef, useEffect } from 'react';
import { PlayCircle, Pause, Play, X, Clock, CheckCircle2, FileText, Volume2, Gauge, Maximize2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import type { Lecture, Subject } from '@/types';

interface LecturesProps {
  lectures: Lecture[];
  onToggleComplete: (id: string) => void;
}

const subjectTabs: Subject[] = ['Software Engineering', 'Python Programming & Data Structures', 'C++ Object-Oriented Programming'];

const subjectColors: Record<Subject, string> = {
  'Software Engineering': 'from-blue-500 to-cyan-500',
  'Python Programming & Data Structures': 'from-emerald-500 to-green-600',
  'C++ Object-Oriented Programming': 'from-orange-500 to-red-500',
};

export default function Lectures({ lectures, onToggleComplete }: LecturesProps) {
  const { showToast } = useToast();
  const [activeSubject, setActiveSubject] = useState<Subject>('Software Engineering');
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [activeTab, setActiveTab] = useState<'player' | 'notes'>('player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<number | null>(null);

  const subjectLectures = lectures.filter((l) => l.subject === activeSubject);
  const modules = [...new Set(subjectLectures.map((l) => l.module))];
  const completedCount = subjectLectures.filter((l) => l.completed).length;
  const progressPercent = subjectLectures.length > 0 ? Math.round((completedCount / subjectLectures.length) * 100) : 0;

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const openLecture = (lecture: Lecture) => {
    setActiveLecture(lecture);
    setActiveTab('player');
    setProgress(0);
    setIsPlaying(false);
  };

  const closeLecture = () => {
    setActiveLecture(null);
    setIsPlaying(false);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (progressInterval.current) clearInterval(progressInterval.current);
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
              progressInterval.current = null;
            }
            return duration;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    } else {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isPlaying && progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
              progressInterval.current = null;
            }
            return duration;
          }
          return prev + speed;
        });
      }, 1000);
    }
  };

  const handleMarkComplete = () => {
    if (!activeLecture) return;
    onToggleComplete(activeLecture.id);
    showToast(`"${activeLecture.title}" marked as completed!`, 'success');
    setActiveLecture({ ...activeLecture, completed: !activeLecture.completed });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Lectures & Course Videos</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Browse lecture modules, watch videos, and track your progress.</p>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
        {subjectTabs.map((subject) => {
          const shortName = subject.split(' ')[0];
          return (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeSubject === subject
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {shortName === 'Python' ? 'Python' : shortName === 'C++' ? 'C++' : 'SE'}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Course Progress</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${subjectColors[activeSubject]} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{completedCount} of {subjectLectures.length} lectures completed</p>
      </div>

      {/* Lecture cards grouped by module */}
      {modules.map((module) => (
        <div key={module} className="space-y-3">
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${subjectColors[activeSubject]}`} />
            {module}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectLectures
              .filter((l) => l.module === module)
              .map((lecture) => (
                <button
                  key={lecture.id}
                  onClick={() => openLecture(lecture)}
                  className="group text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-32 bg-gradient-to-br ${subjectColors[activeSubject]} flex items-center justify-center`}>
                    <PlayCircle className="h-12 w-12 text-white/80 group-hover:scale-110 group-hover:text-white transition-all" />
                    {lecture.completed && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-xs font-medium">
                      {lecture.duration}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-slate-400 mb-1">{lecture.module}</p>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2">{lecture.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{lecture.description}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      {/* Video Player Modal */}
      {activeLecture && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLecture} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{activeLecture.module}</p>
                <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">{activeLecture.title}</h3>
              </div>
              <button onClick={closeLecture} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-5 pt-3">
              <button
                onClick={() => setActiveTab('player')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'player' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Player
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Topic Notes / Cheat Sheet
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === 'player' ? (
                <div>
                  {/* Video player */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      poster={`https://images.unsplash.com/photo-1516259762381-22954f4cb9fc?w=800`}
                      onClick={togglePlay}
                    >
                      <source src="" type="video/mp4" />
                    </video>
                    {/* Overlay with play button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/80 to-blue-950/80 cursor-pointer" onClick={togglePlay}>
                      <div className="text-center">
                        <div className={`w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-3 ${isPlaying ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                          {isPlaying ? <Pause className="h-10 w-10 text-white" /> : <Play className="h-10 w-10 text-white ml-1" />}
                        </div>
                        <p className="text-white text-sm font-medium">{isPlaying ? 'Now Playing...' : 'Click to Play'}</p>
                        <p className="text-slate-400 text-xs mt-1">Duration: {activeLecture.duration}</p>
                      </div>
                    </div>
                    {/* Progress bar overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-white font-mono">{formatTime(progress)}</span>
                        <input
                          type="range"
                          min={0}
                          max={duration}
                          value={progress}
                          onChange={handleSeek}
                          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-blue-500"
                          style={{ background: `linear-gradient(to right, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%)` }}
                        />
                        <span className="text-xs text-white font-mono">{formatTime(duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlay}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>
                        <div className="flex items-center gap-1 ml-2">
                          <Gauge className="h-4 w-4 text-white/60" />
                          {[1, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => handleSpeedChange(speed)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${playbackSpeed === speed ? 'bg-blue-500 text-white' : 'text-white/60 hover:text-white'}`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-white/60" />
                          <Maximize2 className="h-4 w-4 text-white/60" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{activeLecture.description}</p>
                  </div>

                  {/* Mark as completed */}
                  <button
                    onClick={handleMarkComplete}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeLecture.completed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-[1.01]'
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    {activeLecture.completed ? 'Completed' : 'Mark as Completed'}
                  </button>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">Topic Notes & Cheat Sheet</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeLecture.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
