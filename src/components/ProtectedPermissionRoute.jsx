import React from 'react';
import { useUser } from '../context/UserContext';
import { hasPermission } from '../utils/permissions';

export default function ProtectedPermissionRoute({ action, children, fallback = null }) {
  const { role } = useUser();

  if (!hasPermission(role, action)) {
    if (fallback) return fallback;

    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700">
        You do not have permission to access this section.
      </div>
    );
  }

  return children;
}
