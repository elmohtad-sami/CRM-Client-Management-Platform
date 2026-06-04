import React, { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientsContext';
import { UserPenIcon, Trash2Icon, CheckIcon, XIcon } from '@animateicons/react/lucide';

export default function NotesSection({ clientId, notes = [], canAdd, currentUserName }) {
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
      author: currentUserName || 'User',
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
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-[var(--c-text)]">Notes Section</h2>

      {canAdd && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="flex-1 rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)]"
            placeholder="Add a new note..."
          />
          <button type="submit" className="bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors">
            Add note
          </button>
        </form>
      )}

      {loading && <p className="mt-2 text-sm text-[var(--c-text-3)]">Saving...</p>}

      <div className="mt-4 space-y-3">
        {localNotes.map((note) => (
          <article key={note.id} className="rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--c-text)]">{note.author}</p>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--c-text-3)]">
                  {new Date(note.date).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={() => startEditing(note)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-border-md)] bg-[var(--c-element)] text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors"
                  title="Edit note"
                >
                  <UserPenIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] text-[var(--c-danger)] hover:bg-[var(--c-danger-hover)] transition-colors"
                  title="Delete note"
                >
                  <Trash2Icon size={14} />
                </button>
              </div>
            </div>
            {editingId === note.id ? (
              <div className="mt-3 space-y-3">
                <textarea
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[var(--c-border-strong)] bg-[var(--c-element)] px-4 py-2.5 text-sm text-[var(--c-text)] placeholder-[var(--c-placeholder)] outline-none focus:ring-2 focus:ring-[var(--c-border)] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveEditing(note.id)}
                    className="inline-flex items-center gap-2 bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    <CheckIcon size={14} /> Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-4 py-2 text-xs font-semibold text-[var(--c-text-2)] transition-colors hover:bg-[var(--c-element-hover)]"
                  >
                    <XIcon size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--c-text-2)] leading-6">{note.content || note.text}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
