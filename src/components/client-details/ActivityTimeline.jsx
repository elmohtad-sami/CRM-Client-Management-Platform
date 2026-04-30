import React, { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientsContext';
import { Edit2, Trash2, Check, X } from 'lucide-react';

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
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Activity Timeline</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
          Read only
        </span>
      </div>
      {loading && <p className="mt-3 text-sm text-slate-500">Saving...</p>}
      <div className="mt-4 space-y-4">
        {localActivities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/15" />
              {index !== localActivities.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
            </div>
            <article className="-mt-1 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {editingId === activity.id ? (
                    <div className="space-y-3">
                      <input
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Activity title"
                      />
                      <textarea
                        value={form.description}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Activity description"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-slate-900">{activity.title}</h3>
                      <p className="mt-2 text-sm text-slate-700 leading-6">{activity.description}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {editingId === activity.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEditing(activity.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
                          title="Save activity"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100"
                          title="Cancel edit"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditing(activity)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        title="Edit activity"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteActivity(activity.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="Delete activity"
                    >
                      <Trash2 size={14} />
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
