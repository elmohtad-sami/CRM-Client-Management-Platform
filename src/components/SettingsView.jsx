import React from 'react';

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
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">User Profile</h3>
            <p className="text-sm text-slate-500 mt-1">Review and update your account information.</p>
          </div>
          <button
            onClick={() => setIsEditingProfile(prev => !prev)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
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
            <form onSubmit={handleSaveProfile} className="grid gap-4">
              <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} placeholder="Full name" />
              <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="Email" />
              <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={profileForm.companyName} onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })} placeholder="Department" />
              <label className="flex flex-col gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Profile image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                />
              </label>
              <button type="submit" disabled={isProfileSaving} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">{isProfileSaving ? 'Saving Profile...' : 'Save Profile'}</button>
            </form>
          ) : (
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200"><span className="text-slate-500">Image</span><span className="font-semibold text-slate-900">{user?.profileImage ? 'Custom image set' : 'Default avatar'}</span></div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200"><span className="text-slate-500">Name</span><span className="font-semibold text-slate-900">{user?.fullName || 'User'}</span></div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-900">{user?.email || '-'}</span></div>
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-slate-200"><span className="text-slate-500">Department</span><span className="font-semibold text-slate-900">{user?.companyName || 'Finance'}</span></div>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="w-full rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500 hover:text-white hover:border-rose-400/40">
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-xl font-black text-slate-900">Change Password</h3>
          <p className="text-sm text-slate-500 mt-1">Update your login password securely.</p>
          <form onSubmit={handleChangePassword} className="mt-6 grid gap-4">
            <input type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current password" />
            <input type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" />
            <input type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
            <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">Change Password</button>
          </form>
        </div>

        {settingsMessage && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {settingsMessage}
          </div>
        )}
      </div>
    </div>
  );
}