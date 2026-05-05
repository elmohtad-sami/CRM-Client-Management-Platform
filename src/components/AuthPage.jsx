import React, { useEffect, useState } from 'react';
import { Building2, Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { authApi } from '../api/auth';

export default function AuthPage({ onLogin, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode !== 'register');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsLogin(initialMode !== 'register');
  }, [initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerificationMessage('');

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isLogin && (!fullName || !companyName || !email || !password)) {
        setError('All fields are required.');
        setIsSubmitting(false);
        return;
      }

      if (isLogin) {
        const payload = await authApi.login({ email, password });
        onLogin?.(payload);
      } else {
        // Registration
        const registrationData = await authApi.register({ fullName, companyName, email, password });
        setVerificationEmail(email);
        setAwaitingVerification(true);
        setVerificationMessage('A verification email has been sent to your inbox. Please enter the code below.');
        // Reset form
        setFullName('');
        setCompanyName('');
        setEmail('');
        setPassword('');
        setVerificationCode('');
      }
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode.trim()) {
      setError('Please enter your verification code.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = await authApi.verifyEmail(verificationCode);
      setAwaitingVerification(false);
      onLogin?.(payload);
    } catch (verificationError) {
      setError(verificationError.message || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      await authApi.resendVerificationEmail(verificationEmail);
      setVerificationMessage('A new verification email has been sent. Please check your inbox.');
      setResendCooldown(60); // 60 second cooldown
    } catch (resendError) {
      setError(resendError.message || 'Failed to resend verification email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToRegister = () => {
    setAwaitingVerification(false);
    setVerificationCode('');
    setVerificationMessage('');
    setVerificationEmail('');
    setError('');
  };

  // Verification form view
  if (awaitingVerification) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-stretch justify-center p-4 md:p-6 font-sans text-slate-900">
        <div className="w-full max-w-7xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] bg-transparent rounded-2xl overflow-hidden shadow-none md:shadow-xl flex flex-col md:flex-row">
          {/* Left split: welcome panel */}
          <div className="w-full md:w-1/2 bg-linear-to-b from-indigo-600 via-indigo-500 to-cyan-500 text-white px-6 py-10 md:p-12 flex flex-col justify-center order-1 md:order-0 min-h-65 md:min-h-0">
            <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6">
                <CheckCircle2 size={48} className="text-green-300" />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">VERIFY EMAIL</h2>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 opacity-90">One more step to go!</h3>
              <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-xl mx-auto md:mx-0">We've sent a verification email to <strong>{verificationEmail}</strong>. Enter the code from the email to complete your registration.</p>
            </div>
          </div>

          {/* Right split: verification card */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:p-6 order-2 md:order-0">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <Mail className="text-indigo-600" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Verify Email</h1>
                    <p className="text-sm text-slate-500">Secure your account</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-md">
                    {error}
                  </div>
                )}

                {verificationMessage && (
                  <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm font-medium rounded-r-md flex gap-2">
                    <Clock size={16} className="shrink-0 mt-0.5" />
                    <span>{verificationMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Verification Code</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all font-medium text-center tracking-wider"
                        placeholder="Enter the code from your email"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength="64"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Check your email inbox or spam folder for the verification link or code.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-bold tracking-wide py-3 rounded-lg mt-6 transition-all shadow-xl flex items-center justify-center gap-2 uppercase text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'} <ArrowRight size={16} />
                  </button>
                </form>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                  <p className="text-xs text-slate-500 text-center">Didn't receive the email?</p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isSubmitting || resendCooldown > 0}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 text-sm"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToRegister}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-all text-sm"
                  >
                    Back to Registration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Registration form view
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
