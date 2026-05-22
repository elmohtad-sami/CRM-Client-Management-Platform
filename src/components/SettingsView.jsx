import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

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
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMessageError = settingsMessage?.toLowerCase().includes('error') || settingsMessage?.toLowerCase().includes('failed');
  const isMessageSuccess = settingsMessage?.toLowerCase().includes('success') || settingsMessage?.toLowerCase().includes('updated');

  const handleEditToggle = () => {
    if (isEditingProfile) {
      // Reset form when canceling
      setProfileForm({
        fullName: user?.fullName || '',
        email: user?.email || '',
        companyName: user?.companyName || '',
        profileImage: user?.profileImage || ''
      });
    }
    setIsEditingProfile(prev => !prev);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">User Profile</h3>
            <p className="text-xs text-white/50 mt-1">Review and update your account information.</p>
          </div>
          <button
            onClick={handleEditToggle}
            type="button"
               className={`px-4 py-2 rounded-lg text-white text-xs font-semibold transition-colors whitespace-nowrap ${
               isEditingProfile
                 ? 'border border-white/[0.12] bg-white/[0.04] text-white/70 hover:bg-white/10'
                 : 'bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-sm border border-white/10'
             }`}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center gap-4">
            {profileForm.profileImage ? (
              <img
                src={profileForm.profileImage}
                alt={user?.fullName || 'User'}
                className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-indigo-500/20 ring-1 ring-white/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-white">{user?.fullName || 'User'}</p>
              <p className="text-xs text-white/50">{user?.email || 'No email'}</p>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="grid gap-3" noValidate>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  placeholder="Enter your department"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-2">Profile Image</label>
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-white/[0.15] bg-white/[0.04] px-4 py-4 text-xs text-white/60 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-white/40" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m4-12l-3.172-3.172a4 4 0 00-5.656 0L28 8m0 0l4 4m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 font-semibold text-white/70">Click to upload or drag and drop</p>
                    <p className="text-[11px] text-white/50">PNG, JPG, GIF up to 10MB</p>
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
                className="w-full rounded-xl bg-white/15 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-white transition-colors hover:bg-white/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
              >
                {isProfileSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="grid gap-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 border border-white/[0.08]">
                <span className="text-white/50">Image</span>
                <span className="font-semibold text-white">{user?.profileImage ? 'Custom image' : 'Default avatar'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 border border-white/[0.08]">
                <span className="text-white/50">Name</span>
                <span className="font-semibold text-white">{user?.fullName || 'User'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 border border-white/[0.08]">
                <span className="text-white/50">Email</span>
                <span className="font-semibold text-white break-all">{user?.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 border border-white/[0.08]">
                <span className="text-white/50">Department</span>
                <span className="font-semibold text-white">{user?.companyName || 'Finance'}</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-rose-500/20 bg-rose-500/15 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-rose-300 transition-all hover:bg-rose-500/25 hover:text-rose-200"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6">
          <h3 className="text-xl font-black text-white">Change Password</h3>
          <p className="text-xs text-white/50 mt-1">Update your login password securely.</p>

          <form onSubmit={handleChangePassword} className="mt-6 grid gap-2.5" noValidate>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 pr-10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 pr-10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 pr-10 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white/15 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-white transition-colors hover:bg-white/25 flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
            >
              <CheckCircle size={14} />
              Update Password
            </button>
          </form>
        </div>

        {settingsMessage && (
          <div className={`rounded-2xl border p-4 flex gap-3 ${
            isMessageError
              ? 'border-rose-500/30 bg-rose-500/15'
              : isMessageSuccess
              ? 'border-emerald-500/30 bg-emerald-500/15'
              : 'border-white/[0.12] bg-white/[0.04]'
          }`}>
            {isMessageError ? (
              <AlertCircle className="h-5 w-5 text-rose-300 shrink-0 mt-0.5" />
            ) : isMessageSuccess ? (
              <CheckCircle className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
            ) : null}
            <p className={`text-xs ${
              isMessageError
                ? 'text-rose-300'
                : isMessageSuccess
                ? 'text-emerald-300'
                : 'text-white/70'
            }`}>
              {settingsMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}