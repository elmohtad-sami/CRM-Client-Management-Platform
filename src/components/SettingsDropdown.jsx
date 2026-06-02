import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { UserIcon, LogoutIcon } from '@animateicons/react/lucide';

export default function SettingsDropdown({ user, onLogout, changeView }) {
  const roleBadgeClasses = {
    Admin: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Manager: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Viewer: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  const role = user?.role || 'Viewer';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.fullName || 'User'}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-white/20">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <span className="hidden sm:inline max-w-[100px] truncate">{user?.fullName || 'User'}</span>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-black/80 backdrop-blur-2xl p-1 shadow-lg border border-white/[0.12] transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="px-4 py-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.fullName || 'User'}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20 shadow-lg shadow-indigo-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white ring-1 ring-white/20 shadow-lg shadow-indigo-500/20">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-semibold text-white/90 truncate">{user?.fullName || 'User'}</p>
              <p className="text-xs text-white/50 truncate">{user?.companyName || 'Finance Dept'}</p>
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
                  focus ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <UserIcon
                  size={18}
                  className={`mr-3 ${focus ? 'text-white' : 'text-white/40'}`}
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
                  focus ? 'bg-rose-500/20 text-rose-300' : 'text-rose-400/70 hover:bg-rose-500/10'
                }`}
              >
                <LogoutIcon
                  size={18}
                  className={`mr-3 ${focus ? 'text-rose-300' : 'text-rose-400/40'}`}
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
