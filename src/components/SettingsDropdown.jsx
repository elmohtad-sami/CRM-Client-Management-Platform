import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Settings, User, LogOut } from 'lucide-react';

export default function SettingsDropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center justify-center rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2">
          <Settings size={20} />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-black/80 backdrop-blur-2xl p-1 shadow-lg border border-white/[0.12] transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <div className="p-1">
          <MenuItem>
            {({ focus }) => (
              <button
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  focus ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <User
                  size={18}
                  className={`mr-3 ${focus ? 'text-white' : 'text-white/40'}`}
                />
                My Profile
              </button>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              <button
                className={`group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  focus ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <LogOut
                  size={18}
                  className={`mr-3 ${focus ? 'text-white' : 'text-white/40'}`}
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