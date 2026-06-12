import React, { useState } from 'react';
import { CircleCheckIcon, InfoIcon, EyeIcon, EyeOffIcon } from '@animateicons/react/lucide';

export default function SettingsView({
  user,
  profileForm,
  setProfileForm,
  isEditingProfile,
  setIsEditingProfile,
  handleSaveProfile,
  handleProfileImageChange,
  passwordForm,
  setPasswordForm,
  handleChangePassword,
  settingsMessage,
  handleLogout,
  isProfileSaving
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMessageError = settingsMessage?.toLowerCase().includes('error') || settingsMessage?.toLowerCase().includes('failed');
  const isMessageSuccess = settingsMessage?.toLowerCase().includes('success') || settingsMessage?.toLowerCase().includes('updated');

  const handleEditToggle = () => {
    setProfileForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      companyName: user?.companyName || '',
      profileImage: user?.profileImage || ''
    });
    setIsEditingProfile(prev => !prev);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[var(--c-text)]">User Profile</h3>
            <p className="text-xs text-[var(--c-text-3)] mt-1">Review and update your account information.</p>
          </div>
          <button
            onClick={handleEditToggle}
            type="button"
               className={`px-4 py-2 rounded-lg text-[var(--c-text)] text-xs font-semibold transition-colors whitespace-nowrap ${
               isEditingProfile
                 ? 'border border-[var(--c-border-md)] bg-[var(--c-elevated)] text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)]'
                 : 'bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)]'
             }`}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="rounded-2xl bg-[var(--c-elevated)] border border-[var(--c-border)] p-5 space-y-4">
          <div className="flex items-center gap-4">
            {profileForm.profileImage ? (
              <img
                src={profileForm.profileImage}
                alt={user?.fullName || 'User'}
                className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-indigo-500/20 ring-1 ring-white/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[var(--c-text)] font-black text-lg shadow-lg shadow-indigo-500/20">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-[var(--c-text)]">{user?.fullName || 'User'}</p>
              <p className="text-xs text-[var(--c-text-3)]">{user?.email || 'No email'}</p>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="grid gap-3" noValidate>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  placeholder="Enter your department"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider mb-2">Profile Image</label>
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--c-border-strong)] bg-[var(--c-elevated)] px-4 py-4 text-xs text-[var(--c-text-2)] cursor-pointer hover:bg-[var(--c-element-hover)] transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-[var(--c-placeholder)]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m4-12l-3.172-3.172a4 4 0 00-5.656 0L28 8m0 0l4 4m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 font-semibold text-[var(--c-text-2)]">Click to upload or drag and drop</p>
                    <p className="text-[11px] text-[var(--c-text-3)]">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isProfileSaving}
                className="w-full rounded-xl bg-[var(--c-element)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-[var(--c-text)] transition-colors hover:bg-[var(--c-element-hover-2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 backdrop-blur-sm border border-[var(--c-border)]"
              >
                {isProfileSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[var(--c-border)] border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CircleCheckIcon size={14} />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="grid gap-3 text-sm text-[var(--c-text-2)]">
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-elevated)] px-4 py-2.5 border border-[var(--c-border)]">
                <span className="text-[var(--c-text-3)]">Image</span>
                <span className="font-semibold text-[var(--c-text)]">{user?.profileImage ? 'Custom image' : 'Default avatar'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-elevated)] px-4 py-2.5 border border-[var(--c-border)]">
                <span className="text-[var(--c-text-3)]">Name</span>
                <span className="font-semibold text-[var(--c-text)]">{user?.fullName || 'User'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-elevated)] px-4 py-2.5 border border-[var(--c-border)]">
                <span className="text-[var(--c-text-3)]">Email</span>
                <span className="font-semibold text-[var(--c-text)] break-all">{user?.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-elevated)] px-4 py-2.5 border border-[var(--c-border)]">
                <span className="text-[var(--c-text-3)]">Department</span>
                <span className="font-semibold text-[var(--c-text)]">{user?.companyName || 'Finance'}</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[var(--c-danger)] transition-all hover:bg-[var(--c-danger-hover)] hover:text-[var(--c-danger)]"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6">
          <h3 className="text-xl font-black text-[var(--c-text)]">Change Password</h3>
          <p className="text-xs text-[var(--c-text-3)] mt-1">Update your login password securely.</p>

          <form onSubmit={handleChangePassword} className="mt-6 grid gap-2.5" noValidate>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 pr-10 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-placeholder)] hover:text-[var(--c-text-2)]"
                >
                  {showCurrentPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 pr-10 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-placeholder)] hover:text-[var(--c-text-2)]"
                >
                  {showNewPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--c-text-2)] uppercase tracking-wider">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 pr-10 text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-placeholder)] hover:text-[var(--c-text-2)]"
                >
                  {showConfirmPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--c-element)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-[var(--c-text)] transition-colors hover:bg-[var(--c-element-hover-2)] flex items-center justify-center gap-2 backdrop-blur-sm border border-[var(--c-border)]"
            >
              <CircleCheckIcon size={14} />
              Update Password
            </button>
          </form>
        </div>

        {settingsMessage && (
          <div className={`rounded-2xl border p-4 flex gap-3 ${
            isMessageError
              ? 'border-[var(--c-danger-border)] bg-[var(--c-danger-bg)]'
              : isMessageSuccess
              ? 'border-[var(--c-positive-border)] bg-[var(--c-positive-bg)]'
              : 'border-[var(--c-border-md)] bg-[var(--c-elevated)]'
          }`}>
            {isMessageError ? (
              <InfoIcon className="h-5 w-5 text-[var(--c-danger)] shrink-0 mt-0.5" />
            ) : isMessageSuccess ? (
              <CircleCheckIcon className="h-5 w-5 text-[var(--c-positive)] shrink-0 mt-0.5" />
            ) : null}
            <p className={`text-xs ${
              isMessageError
                ? 'text-[var(--c-danger)]'
                : isMessageSuccess
                ? 'text-[var(--c-positive)]'
                : 'text-[var(--c-text-2)]'
            }`}>
              {settingsMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}