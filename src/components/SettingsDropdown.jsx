import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Settings, User, LogOut } from 'lucide-react';

export default function SettingsDropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center justify-center rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <Settings size={20} />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="p-1">
          <MenuItem>
            {({ focus }) => (
              <button
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  focus ? 'bg-indigo-500 text-white' : 'text-slate-700'
                }`}
              >
                <User
                  size={18}
                  className={`mr-3 ${focus ? 'text-white' : 'text-slate-400'}`}
                />
                My Profile
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              <button
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  focus ? 'bg-indigo-500 text-white' : 'text-slate-700'
                }`}
              >
                <LogOut
                  size={18}
                  className={`mr-3 ${focus ? 'text-white' : 'text-slate-400'}`}
                />
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}