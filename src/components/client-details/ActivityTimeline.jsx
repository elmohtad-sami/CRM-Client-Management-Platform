import React, { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientsContext';
import { UserPenIcon, Trash2Icon, CheckIcon, XIcon } from '@animateicons/react/lucide';

export default function ActivityTimeline({ clientId, activities }) {
  const [localActivities, setLocalActivities] = useState(activities);
  const { updateActivity: updateActivityApi, deleteActivity: deleteActivityApi } = useClients();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  const startEditing = (activity) => {
    setEditingId(activity.id);
    setForm({
      title: activity.title || '',
      description: activity.description || ''
    });
  };

  const cancelEditing = () => {
    setEditingId('');
    setForm({ title: '', description: '' });
  };

  const saveEditing = (activityId) => {
    const updates = { title: form.title.trim(), description: form.description.trim() };

    setLocalActivities((current) => current.map((activity) => (
      activity.id === activityId
        ? { ...activity, ...updates }
        : activity
    )));
    cancelEditing();

    if (clientId) {
      setLoading(true);
      void (async () => {
          try {
          await updateActivityApi(clientId, activityId, updates);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const deleteActivity = (activityId) => {
    setLocalActivities((current) => current.filter((activity) => activity.id !== activityId));
    if (editingId === activityId) cancelEditing();

    if (clientId) {
      setLoading(true);
      void (async () => {
        try {
          await deleteActivityApi(clientId, activityId);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  return (
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--c-text)]">Activity Timeline</h2>
        <span className="rounded-full border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-3 py-1 text-xs font-semibold text-[var(--c-text-3)]">
          Read only
        </span>
      </div>
      {loading && <p className="mt-3 text-xs text-[var(--c-text-3)]">Saving...</p>}
      <div className="mt-4 space-y-3">
        {localActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-[var(--c-accent)] ring-4 ring-[var(--c-accent-bg)]" />
              {index !== localActivities.length - 1 && <span className="mt-1 h-full w-px bg-[var(--c-element)]" />}
            </div>
            <article className="-mt-1 flex-1 rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {editingId === activity.id ? (
                    <div className="space-y-3">
                      <input
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm font-semibold text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)]"
                        placeholder="Activity title"
                      />
                      <textarea
                        value={form.description}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        rows={3}
                        className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm text-[var(--c-text-2)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] resize-none"
                        placeholder="Activity description"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-[var(--c-text)]">{activity.title}</h3>
                      <p className="mt-2 text-sm text-[var(--c-text-2)] leading-6">{activity.description}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--c-text-3)]">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {editingId === activity.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEditing(activity.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-element)] text-[var(--c-text)] transition-colors hover:bg-[var(--c-element-hover)]"
                          title="Save activity"
                        >
                          <CheckIcon size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-border-md)] bg-[var(--c-elevated)] text-[var(--c-text-3)] transition-colors hover:bg-[var(--c-element-hover)]"
                          title="Cancel edit"
                        >
                          <XIcon size={14} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditing(activity)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-border-md)] bg-[var(--c-element)] text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors"
                        title="Edit activity"
                      >
                        <UserPenIcon size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteActivity(activity.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] text-[var(--c-danger)] hover:bg-[var(--c-danger-hover)] transition-colors"
                      title="Delete activity"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
