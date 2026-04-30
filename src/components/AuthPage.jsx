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
    <div className="min-h-screen bg-slate-50 flex items-stretch justify-center p-4 md:p-6 font-sans text-slate-900">
      <div className="w-full max-w-7xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] bg-transparent rounded-2xl overflow-hidden shadow-none md:shadow-xl flex flex-col md:flex-row">
        {/* Left split: welcome panel */}
        <div className="w-full md:w-1/2 bg-linear-to-b from-indigo-600 via-indigo-500 to-cyan-500 text-white px-6 py-10 md:p-12 flex flex-col justify-center order-1 md:order-0 min-h-65 md:min-h-0">
          <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">WELCOME</h2>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 opacity-90">FinAudit CRM — Finance & Risk</h3>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-xl mx-auto md:mx-0">Securely manage invoices, run audit scans, and track client solvency with an integrated financial CRM designed for audit teams and finance departments.</p>
          </div>
        </div>

        {/* Right split: auth card */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:p-6 order-2 md:order-0">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Building2 className="text-indigo-600" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900">FinAudit CRM</h1>
                  <p className="text-sm text-slate-500">Enterprise Finance & Risk Management</p>
                </div>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                    !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-md">
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
                          className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all font-medium"
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
                          className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all font-medium"
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
                      className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all font-medium"
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
                      className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all font-medium"
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
                  className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-bold tracking-wide py-3 rounded-lg mt-4 transition-all shadow-xl flex items-center justify-center gap-2 uppercase text-sm"
                >
                  {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In Securely' : 'Complete Setup'} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
