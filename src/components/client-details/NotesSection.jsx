import React, { useState } from 'react';

export default function NotesSection({ notes = [], onAdd, canAdd }) {
  const [value, setValue] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900">Notes Section</h2>

      {canAdd && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Add a new note..."
          />
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Add note
          </button>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{note.author}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {new Date(note.date).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-700 leading-6">{note.content || note.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
