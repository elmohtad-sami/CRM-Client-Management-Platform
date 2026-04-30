import React, { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientsContext';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export default function NotesSection({ clientId, notes = [], canAdd }) {
  const [value, setValue] = useState('');
  const [localNotes, setLocalNotes] = useState(notes);
  const [editingId, setEditingId] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const { addNote: addNoteApi, updateNote: updateNoteApi, deleteNote: deleteNoteApi } = useClients();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    const nextNote = {
      id: `${Date.now()}`,
      author: 'Current User',
      date: new Date().toISOString(),
      content: value.trim(),
      text: value.trim()
    };

    // optimistic UI
    setLocalNotes((current) => [nextNote, ...current]);
    setValue('');
    if (clientId) {
      setLoading(true);
      void (async () => {
        try {
          await addNoteApi(clientId, nextNote);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingValue(note.content || note.text || '');
  };

  const cancelEditing = () => {
    setEditingId('');
    setEditingValue('');
  };

  const saveEditing = (noteId) => {
    if (!editingValue.trim()) return;
    const updates = { content: editingValue.trim(), text: editingValue.trim() };

    setLocalNotes((current) => current.map((note) => (
      note.id === noteId
        ? { ...note, ...updates }
        : note
    )));
    cancelEditing();

    if (clientId) {
      setLoading(true);
      void (async () => {
        try {
          await updateNoteApi(clientId, noteId, updates);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const deleteNote = (noteId) => {
    setLocalNotes((current) => current.filter((note) => note.id !== noteId));
    if (editingId === noteId) cancelEditing();

    if (clientId) {
      setLoading(true);
      void (async () => {
        try {
          await deleteNoteApi(clientId, noteId);
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

      {loading && <p className="mt-2 text-sm text-slate-500">Saving...</p>}

      <div className="mt-4 space-y-3">
        {localNotes.map((note) => (
          <article key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{note.author}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {new Date(note.date).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={() => startEditing(note)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  title="Edit note"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  title="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {editingId === note.id ? (
              <div className="mt-3 space-y-3">
                <textarea
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEditing(note.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-700 leading-6">{note.content || note.text}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
