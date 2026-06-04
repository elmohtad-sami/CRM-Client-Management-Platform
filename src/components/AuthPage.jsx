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
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />
        <div className="w-[500px] h-[500px] rounded-full bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-10 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
          <div className="w-full max-w-[340px]">
            <div className="flex items-center gap-3 mb-5 justify-center">
              <div className="p-2.5 bg-[var(--c-element)] rounded-xl">
                <CircleCheckIcon className="text-[var(--c-text)]" size={26} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--c-text)]">Verify Email</h1>
                <p className="text-xs text-[var(--c-text-3)]">Secure your account</p>
              </div>
            </div>
            {error && (
              <div className="mb-4 p-2.5 bg-[var(--c-danger-bg)] border border-[var(--c-danger-border)] text-[var(--c-danger)] text-xs font-medium rounded-xl text-center">
                {error}
              </div>
            )}
            {verificationMessage && (
              <div className="mb-4 p-2.5 bg-[var(--c-info-bg)] border border-[var(--c-info-border)] text-[var(--c-info)] text-xs font-medium rounded-xl flex items-center justify-center gap-2">
                <BellIcon size={14} className="shrink-0" />
                <span>{verificationMessage}</span>
              </div>
            )}
            <form onSubmit={handleVerificationSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-1.5 text-center">Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-[var(--c-element)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium text-center tracking-widest text-sm"
                    placeholder="Enter the code from your email"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength="64"
                  />
                </div>
                <p className="text-[11px] text-[var(--c-placeholder)] mt-1.5 text-center">Check your email inbox or spam folder for the code.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] font-bold tracking-wide py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs disabled:opacity-40 backdrop-blur-sm border border-[var(--c-border)]"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Sign In'} <ChevronRightIcon size={14} />
              </button>
            </form>
            <div className="mt-5 space-y-2.5 border-t border-[var(--c-border)] pt-4">
              <p className="text-[11px] text-[var(--c-placeholder)] text-center">Didn't receive the email?</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isSubmitting || resendCooldown > 0}
                className="w-full py-2 px-4 bg-[var(--c-element)] hover:bg-[var(--c-element-hover)] text-[var(--c-text)] hover:text-[var(--c-text)] font-semibold rounded-xl transition-all disabled:opacity-40 text-xs backdrop-blur-sm border border-[var(--c-border)]"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
              </button>
              <button
                type="button"
                onClick={handleBackToRegister}
                className="w-full py-2 px-4 bg-[var(--c-element)] hover:bg-[var(--c-element)] text-[var(--c-text-2)] hover:text-[var(--c-text)] font-semibold rounded-xl transition-all text-xs backdrop-blur-sm border border-[var(--c-border)]"
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
    <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Neon glow - bottom-left golden/orange */}
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
      {/* Neon glow - right pink/purple */}
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />
      {/* Circular glass card */}
      <div className="w-[500px] h-[500px] rounded-full bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-10 relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <div className="w-full max-w-[340px] space-y-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 justify-center mb-1">
            <div className="p-2.5 bg-[var(--c-element)] rounded-xl">
              <BlocksIcon className="text-[var(--c-text)]" size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--c-text)]">FinAudit Finance</h1>
              <p className="text-[11px] text-[var(--c-text-3)]">Enterprise Finance & Risk Management</p>
            </div>
          </div>
          {/* Tab buttons */}
          <div className="flex bg-[var(--c-element)] p-1 rounded-xl backdrop-blur-sm border border-[var(--c-border)]">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${isLogin ? 'bg-[var(--c-element-hover)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${!isLogin ? 'bg-[var(--c-element-hover)] text-[var(--c-text)] shadow-sm' : 'text-[var(--c-text-3)] hover:text-[var(--c-text)]'}`}
            >
              Create Account
            </button>
          </div>
          {error && (
            <div className="p-2.5 bg-[var(--c-danger-bg)] border border-[var(--c-danger-border)] text-[var(--c-danger)] text-xs font-medium rounded-xl text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-[var(--c-element)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium text-sm pr-10"
                      placeholder="FULL NAME"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <UserIcon size={15} className="text-[var(--c-text-2)]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-1">Company Name (ICE)</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-[var(--c-element)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium text-sm pr-10"
                      placeholder="ICE for company registration"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <UserCogIcon size={15} className="text-[var(--c-text-2)]" />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-2.5 bg-[var(--c-element)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium text-sm pr-10"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MailIcon size={15} className="text-[var(--c-text-2)]" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-2.5 bg-[var(--c-element)] border border-[var(--c-border)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium text-sm pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LockIcon size={15} className="text-[var(--c-text-2)]" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] font-bold tracking-wider py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs disabled:opacity-40 backdrop-blur-sm border border-[var(--c-border)]"
            >
              {isSubmitting ? 'Please wait...' : isLogin ? 'LOGIN' : 'REGISTER'} <ChevronRightIcon size={14} />
            </button>
          </form>
          {/* Footer links */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors cursor-pointer text-xs">
              <input type="checkbox" className="accent-white/50 rounded" />
              Remember me
            </label>
            <button type="button" onClick={(e) => e.preventDefault()} className="text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors text-xs">
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
