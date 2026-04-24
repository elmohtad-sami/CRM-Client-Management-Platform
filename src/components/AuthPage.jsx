import React, { useEffect, useState } from 'react';
import { Building2, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import { authApi } from '../api/auth';

export default function AuthPage({ onLogin, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsLogin(initialMode !== 'register');
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isLogin && (!fullName || !companyName || !email || !password)) {
        setError('All fields are required.');
        return;
      }

      const payload = isLogin
        ? await authApi.login({ email, password })
        : await authApi.register({ fullName, companyName, email, password });

      onLogin?.(payload);
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          <div className="flex justify-center mb-4">
            <Building2 className="text-indigo-400" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">FinAudit CRM</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Enterprise Finance & Risk Management</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name (ICE)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                      placeholder="Acme Corp - 123456789"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide py-3 rounded-xl mt-6 transition-all shadow-md hover:shadow-indigo-500/30 flex items-center justify-center gap-2 uppercase text-sm"
            >
              {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In Securely' : 'Complete Setup'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
