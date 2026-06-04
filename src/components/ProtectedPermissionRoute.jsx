import React from 'react';
import { useUser } from '../context/UserContext';
import { hasPermission } from '../utils/permissions';

export default function ProtectedPermissionRoute({ action, children, fallback = null }) {
  const { role } = useUser();

  if (!hasPermission(role, action)) {
    if (fallback) return fallback;

    return (
      <div className="rounded-2xl border border-[var(--c-warning-border)] bg-[var(--c-warning-bg)] p-4 text-xs text-[var(--c-warning)] backdrop-blur-sm">
        You do not have permission to access this section.
      </div>
    );
  }

  return children;
}
