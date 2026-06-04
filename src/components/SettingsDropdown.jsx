import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { UserIcon, LogoutIcon } from '@animateicons/react/lucide';

export default function SettingsDropdown({ user, onLogout, changeView }) {
  const roleBadgeClasses = {
    Admin: 'bg-[var(--c-accent-hover)] text-[var(--c-accent)] border-[var(--c-accent-border)]',
    Manager: 'bg-[var(--c-positive-hover)] text-[var(--c-positive)] border-[var(--c-positive-border)]',
    Viewer: 'bg-[var(--c-warning-hover)] text-[var(--c-warning)] border-[var(--c-warning-border)]',
  };
  const role = user?.role || 'Viewer';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] px-3 py-2 text-sm font-medium text-[var(--c-text-2)] transition-all hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] focus:outline-none focus:ring-2 focus:ring-[var(--c-border)]">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.fullName || 'User'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-[var(--c-text)] ring-1 ring-white/20">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <span className="hidden sm:inline max-w-[100px] truncate">{user?.fullName || 'User'}</span>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-[var(--c-overlay)] backdrop-blur-2xl p-1 shadow-lg border border-[var(--c-border-md)] transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="px-4 py-3 border-b border-[var(--c-border)]">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.fullName || 'User'}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20 shadow-lg shadow-indigo-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-[var(--c-text)] ring-1 ring-white/20 shadow-lg shadow-indigo-500/20">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-semibold text-[var(--c-text)] truncate">{user?.fullName || 'User'}</p>
              <p className="text-xs text-[var(--c-text-3)] truncate">{user?.companyName || 'Finance Dept'}</p>
            </div>
          </div>
          <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${roleBadgeClasses[role] || roleBadgeClasses.Viewer}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {role}
          </div>
        </div>

        <div className="p-1">
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={() => changeView?.('settings')}
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  focus ? 'bg-[var(--c-element-hover)] text-[var(--c-text)]' : 'text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)]'
                }`}
              >
                <UserIcon
                  size={18}
                  className={`mr-3 ${focus ? 'text-[var(--c-text)]' : 'text-[var(--c-placeholder)]'}`}
                />
                My Account
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              <button
                onClick={onLogout}
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  focus ? 'bg-[var(--c-danger-hover)] text-[var(--c-danger)]' : 'text-[var(--c-danger)]/70 hover:bg-[var(--c-danger-bg)]'
                }`}
              >
                <LogoutIcon
                  size={18}
                  className={`mr-3 ${focus ? 'text-[var(--c-danger)]' : 'text-[var(--c-danger)]/40'}`}
                />
                Sign Out
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
