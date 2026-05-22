import React from 'react';
import { useUser } from '../context/UserContext';
import { hasPermission } from '../utils/permissions';

export default function ProtectedPermissionRoute({ action, children, fallback = null }) {
  const { role } = useUser();

  if (!hasPermission(role, action)) {
    if (fallback) return fallback;

    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/15 p-4 text-xs text-amber-300 backdrop-blur-sm">
        You do not have permission to access this section.
      </div>
    );
  }

  return children;
}
