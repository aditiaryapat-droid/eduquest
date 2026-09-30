import { useState, useEffect } from 'react';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, X, CheckCircle2, Code2, Brain, Cpu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { codingQuotes } from '@/data/seed';
import type { Role } from '@/types';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Role>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % codingQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
      login({
        name: activeTab === 'student' ? 'Aarav Sharma' : 'Dr. Rajesh Kumar',
        email: identifier,
        role: activeTab,
        rollNo: activeTab === 'student' ? 'EQ2026-042' : undefined,
        avatar: activeTab === 'student' ? 'AS' : 'RK',
      });
      showToast(`Welcome to EduQuest!`, 'success');
      setIsLoggingIn(false);
    }, 800);
  };

  const handleDemoLogin = (role: Role) => {
    setIsLoggingIn(true);
    const email = role === 'student' ? 'student@eduquest.ac.in' : 'faculty@eduquest.ac.in';
    setIdentifier(email);
    setPassword('demo1234');
    setTimeout(() => {
      login({
        name: role === 'student' ? 'Aarav Sharma' : 'Dr. Rajesh Kumar',
        email,
        role,
        rollNo: role === 'student' ? 'EQ2026-042' : undefined,
        avatar: role === 'student' ? 'AS' : 'RK',
      });
      showToast(`Logged in as Demo ${role === 'student' ? 'Student' : 'Faculty'}`, 'success');
      setIsLoggingIn(false);
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email', 'error');
      return;
    }
    setForgotSent(true);
    showToast('Password reset link sent to your email', 'success');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-7 w-7" />
              </div>
              <span className="text-3xl font-bold tracking-tight">EduQuest</span>
            </div>
            <p className="text-blue-300 text-lg font-light ml-1">Empower Your Learning Journey</p>
          </div>

          {/* Tech illustration */}
          <div className="flex flex-col items-center gap-8 py-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Code2 className="h-10 w-10 text-blue-400" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Brain className="h-10 w-10 text-indigo-400" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Cpu className="h-10 w-10 text-cyan-400" />
              </div>
            </div>

            <div className="text-center max-w-md">
              <p className="text-xl font-light leading-relaxed text-slate-200 min-h-[3rem] animate-fade-in" key={quoteIndex}>
                "{codingQuotes[quoteIndex]}"
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>3 Core Engineering Subjects with Hands-on Labs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>Real-time Assignment Portal & Lecture Library</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>Performance Tracking & Digital Report Cards</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-800 dark:text-white">EduQuest</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Sign in to continue your learning journey</p>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
              <button
                onClick={() => { setActiveTab('student'); setIdentifier(''); setPassword(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'student' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Student Login
              </button>
              <button
                onClick={() => { setActiveTab('faculty'); setIdentifier(''); setPassword(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'faculty' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Faculty Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {activeTab === 'student' ? 'Roll No / Email ID' : 'Faculty Email ID'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeTab === 'student' ? 'EQ2026-042 or student@eduquest.ac.in' : 'faculty@eduquest.ac.in'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}
                  >
                    {rememberMe && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgot(true); setForgotSent(false); setForgotEmail(''); }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo buttons */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDemoLogin('student')}
                  disabled={isLoggingIn}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => handleDemoLogin('faculty')}
                  disabled={isLoggingIn}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50"
                >
                  Demo Faculty
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">© 2026 EduQuest Academy. All rights reserved.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForgot(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full animate-scale-in">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            {!forgotSent ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Reset Your Password</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Enter your registered email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your.email@eduquest.ac.in"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Send Reset Link
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Check Your Email</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">A password reset link has been sent to {forgotEmail}</p>
                <button
                  onClick={() => setShowForgot(false)}
                  className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
