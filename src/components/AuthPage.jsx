import React, { useEffect, useState } from 'react';
import { BlocksIcon, MailIcon, LockIcon, UserIcon, UserCogIcon, ChevronRightIcon, CircleCheckIcon, BellIcon } from '@animateicons/react/lucide';
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
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />
        <div className="w-[500px] h-[500px] rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-10 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
          <div className="w-full max-w-[340px]">
            <div className="flex items-center gap-3 mb-5 justify-center">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <CircleCheckIcon className="text-white" size={26} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Verify Email</h1>
                <p className="text-xs text-white/50">Secure your account</p>
              </div>
            </div>
            {error && (
              <div className="mb-4 p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl text-center">
                {error}
              </div>
            )}
            {verificationMessage && (
              <div className="mb-4 p-2.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-medium rounded-xl flex items-center justify-center gap-2">
                <BellIcon size={14} className="shrink-0" />
                <span>{verificationMessage}</span>
              </div>
            )}
            <form onSubmit={handleVerificationSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1.5 text-center">Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium text-center tracking-widest text-sm"
                    placeholder="Enter the code from your email"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength="64"
                  />
                </div>
                <p className="text-[11px] text-white/40 mt-1.5 text-center">Check your email inbox or spam folder for the code.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/15 hover:bg-white/25 text-white font-bold tracking-wide py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs disabled:opacity-40 backdrop-blur-sm border border-white/10"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Sign In'} <ChevronRightIcon size={14} />
              </button>
            </form>
            <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4">
              <p className="text-[11px] text-white/40 text-center">Didn't receive the email?</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-semibold rounded-xl transition-all disabled:opacity-40 text-xs backdrop-blur-sm border border-white/10"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
              </button>
              <button
                type="button"
                onClick={handleBackToRegister}
                className="w-full py-2 px-4 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white font-semibold rounded-xl transition-all text-xs backdrop-blur-sm border border-white/5"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Registration form view
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans">
      {/* Neon glow - bottom-left golden/orange */}
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
      {/* Neon glow - right pink/purple */}
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />
      {/* Circular glass card */}
      <div className="w-[500px] h-[500px] rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-10 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <div className="w-full max-w-[340px] space-y-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 justify-center mb-1">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <BlocksIcon className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FinAudit Finance</h1>
              <p className="text-[11px] text-white/50">Enterprise Finance & Risk Management</p>
            </div>
          </div>
          {/* Tab buttons */}
          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/10">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${isLogin ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white/20 text-white shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              Create Account
            </button>
          </div>
          {error && (
            <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium text-sm pr-10"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <UserIcon size={15} className="text-white/60" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">Company Name (ICE)</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium text-sm pr-10"
                      placeholder="Acme Corp - 123456789"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <UserCogIcon size={15} className="text-white/60" />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium text-sm pr-10"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MailIcon size={15} className="text-white/60" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium text-sm pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LockIcon size={15} className="text-white/60" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white/15 hover:bg-white/25 text-white font-bold tracking-wider py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs disabled:opacity-40 backdrop-blur-sm border border-white/10"
            >
              {isSubmitting ? 'Please wait...' : isLogin ? 'LOGIN' : 'REGISTER'} <ChevronRightIcon size={14} />
            </button>
          </form>
          {/* Footer links */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer text-xs">
              <input type="checkbox" className="accent-white/50 rounded" />
              Remember me
            </label>
            <button type="button" onClick={(e) => e.preventDefault()} className="text-white/70 hover:text-white transition-colors text-xs">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
