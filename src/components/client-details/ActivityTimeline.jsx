import React from 'react';

export default function ActivityTimeline({ activities }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900">Activity Timeline</h2>

      <div className="mt-4 space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/15" />
              {index !== activities.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
            </div>
            <article className="-mt-1 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{activity.title}</h3>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-700 leading-6">{activity.description}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
