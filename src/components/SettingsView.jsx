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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">User Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Review and update your account information.</p>
          </div>
          <button
            onClick={handleEditToggle}
            type="button"
            className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors whitespace-nowrap ${
              isEditingProfile
                ? 'bg-slate-500 hover:bg-slate-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4">
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
              <p className="text-lg font-bold text-slate-900">{user?.fullName || 'User'}</p>
              <p className="text-sm text-slate-500">{user?.email || 'No email'}</p>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="grid gap-4" noValidate>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Department</label>
                <input
                  type="text"
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  placeholder="Enter your department"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image</label>
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-4-12l-3.172-3.172a4 4 0 00-5.656 0L28 8m0 0l4 4m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 font-semibold text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
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
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProfileSaving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                <span className="text-slate-500">Image</span>
                <span className="font-semibold text-slate-900">{user?.profileImage ? 'Custom image' : 'Default avatar'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-900">{user?.fullName || 'User'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-900 break-all">{user?.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900">{user?.companyName || 'Finance'}</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-400/40"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-xl font-black text-slate-900">Change Password</h3>
          <p className="text-sm text-slate-500 mt-1">Update your login password securely.</p>

          <form onSubmit={handleChangePassword} className="mt-6 grid gap-4" noValidate>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Update Password
            </button>
          </form>
        </div>

        {settingsMessage && (
          <div className={`rounded-2xl border p-4 flex gap-3 ${
            isMessageError
              ? 'border-rose-200 bg-rose-50'
              : isMessageSuccess
              ? 'border-green-200 bg-green-50'
              : 'border-slate-200 bg-slate-50'
          }`}>
            {isMessageError ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            ) : isMessageSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            ) : null}
            <p className={`text-sm ${
              isMessageError
                ? 'text-rose-800'
                : isMessageSuccess
                ? 'text-green-800'
                : 'text-slate-700'
            }`}>
              {settingsMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}