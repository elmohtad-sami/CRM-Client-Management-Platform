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
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-white">Notes Section</h2>

      {canAdd && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="flex-1 rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Add a new note..."
          />
          <button type="submit" className="bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-sm border border-white/10 px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors">
            Add note
          </button>
        </form>
      )}

      {loading && <p className="mt-2 text-sm text-white/50">Saving...</p>}

      <div className="mt-4 space-y-3">
        {localNotes.map((note) => (
          <article key={note.id} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{note.author}</p>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                  {new Date(note.date).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={() => startEditing(note)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.12] bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
                  title="Edit note"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
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
                  className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/30 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEditing(note.id)}
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-sm border border-white/10 px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/70 leading-6">{note.content || note.text}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
