export const PERMISSIONS_BY_ROLE = {
  Admin: ['view_clients', 'edit_client', 'delete_client', 'add_notes', 'upload_documents', 'view_analytics'],
  Finance: ['view_clients', 'edit_client', 'add_notes', 'upload_documents', 'view_analytics'],
  Analyst: ['view_clients', 'view_analytics', 'add_notes'],
  Viewer: ['view_clients']
};

export function hasPermission(role, action) {
  const permissions = PERMISSIONS_BY_ROLE[role] || [];
  return permissions.includes(action);
}
