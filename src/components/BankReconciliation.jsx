import { useState, useRef, useCallback } from 'react';
import { UploadIcon, CircleCheckIcon, XIcon, TriangleAlertIcon, LoaderCircleIcon, ClipboardIcon } from '@animateicons/react/lucide';
import { reconciliationApi } from '../api/reconciliation';

const ANIMATION_CLASS = 'transition-all duration-300 ease-in-out';

export default function BankReconciliation() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const token = localStorage.getItem('token');

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'text/csv' || dropped?.name?.endsWith('.csv')) {
      setFile(dropped);
      setResult(null);
      setError('');
    } else {
      setError('Please upload a valid CSV file');
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError('');
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !token) return;
    setUploading(true);
    setError('');
    try {
      const data = await reconciliationApi.upload(file, token);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [file, token]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-px">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--c-info-bg)] border border-[var(--c-info-border)]">
            <ClipboardIcon size={20} className="text-[var(--c-info)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--c-text)]">Bank Reconciliation</h2>
            <p className="text-sm text-[var(--c-text-3)]">Upload a bank CSV statement to auto-match unpaid invoices</p>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      {!result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer ${ANIMATION_CLASS} ${
            dragOver
              ? 'border-[var(--c-info)] bg-[var(--c-info-bg)] scale-[1.02]'
              : file
                ? 'border-[var(--c-positive)] bg-[var(--c-positive-bg)]'
                : 'border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-text-3)] hover:bg-[var(--c-element)]'
          }`}
        >
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

          {file ? (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--c-positive-bg)] border border-[var(--c-positive-border)]">
                <CircleCheckIcon size={28} className="text-[var(--c-positive)]" />
              </div>
              <p className="font-semibold text-[var(--c-text)]">{file.name}</p>
              <p className="text-sm text-[var(--c-text-3)]">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--c-accent)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {uploading ? (
                    <LoaderCircleIcon size={16} className="animate-spin" />
                  ) : (
                    <UploadIcon size={16} />
                  )}
                  {uploading ? 'Processing...' : 'Upload & Reconcile'}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--c-border)] text-[var(--c-text-2)] font-semibold text-sm hover:bg-[var(--c-element-hover)] transition-all"
                >
                  <XIcon size={16} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--c-element)] border border-[var(--c-border)]">
                <UploadIcon size={28} className="text-[var(--c-text-3)]" />
              </div>
              <p className="font-semibold text-[var(--c-text)]">
                {dragOver ? 'Drop your CSV here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-sm text-[var(--c-text-3)]">
                or <span className="text-[var(--c-info)] underline underline-offset-2 font-medium">browse files</span>
              </p>
              <p className="text-xs text-[var(--c-text-3)] mt-2">CSV with columns: Date, Description, Amount</p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--c-danger-bg)] border border-[var(--c-danger-border)]">
          <TriangleAlertIcon size={18} className="text-[var(--c-danger)] mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--c-danger)]">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--c-positive-bg)] border border-[var(--c-positive-border)]">
              <p className="text-xs font-bold text-[var(--c-positive)] uppercase tracking-wider">Matched</p>
              <p className="text-3xl font-black text-[var(--c-positive)] mt-1">{result.matchedCount}</p>
              <p className="text-xs text-[var(--c-positive)] mt-1 opacity-80">invoices auto-paid</p>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--c-warning-bg)] border border-[var(--c-warning-border)]">
              <p className="text-xs font-bold text-[var(--c-warning)] uppercase tracking-wider">Unmatched</p>
              <p className="text-3xl font-black text-[var(--c-warning)] mt-1">{result.unmatched.length}</p>
              <p className="text-xs text-[var(--c-warning)] mt-1 opacity-80">transactions</p>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)]">
              <p className="text-xs font-bold text-[var(--c-text-3)] uppercase tracking-wider">Total Rows</p>
              <p className="text-3xl font-black text-[var(--c-text)] mt-1">{result.totalRows}</p>
              <p className="text-xs text-[var(--c-text-3)] mt-1 opacity-80">CSV entries</p>
            </div>
          </div>

          {/* Matched Details */}
          {result.matched.length > 0 && (
            <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--c-border)] flex items-center gap-2">
                <CircleCheckIcon size={16} className="text-[var(--c-positive)]" />
                <span className="font-semibold text-sm text-[var(--c-text)]">Matched Transactions</span>
              </div>
              <div className="divide-y divide-[var(--c-border)]">
                {result.matched.map((m, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-[var(--c-element)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <CircleCheckIcon size={14} className="text-[var(--c-positive)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[var(--c-text)] font-medium truncate">{m.description}</p>
                        <p className="text-xs text-[var(--c-text-3)]">{m.date} &middot; {m.clientName} &middot; Ref: {m.invoiceReference}</p>
                      </div>
                    </div>
                    <span className="text-[var(--c-text)] font-semibold shrink-0 ml-4">
                      ${m.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unmatched Details */}
          {result.unmatched.length > 0 && (
            <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--c-border)] flex items-center gap-2">
                <TriangleAlertIcon size={16} className="text-[var(--c-warning)]" />
                <span className="font-semibold text-sm text-[var(--c-text)]">Unmatched Transactions</span>
              </div>
              <div className="divide-y divide-[var(--c-border)]">
                {result.unmatched.map((u, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-[var(--c-element)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <XIcon size={14} className="text-[var(--c-text-3)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[var(--c-text)] font-medium truncate">{u.description}</p>
                        <p className="text-xs text-[var(--c-text-3)]">{u.date}</p>
                      </div>
                    </div>
                    <span className="text-[var(--c-text-3)] font-semibold shrink-0 ml-4">
                      ${u.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Re-upload */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--c-border)] text-[var(--c-text-2)] font-semibold text-sm hover:bg-[var(--c-element-hover)] transition-all"
            >
              <UploadIcon size={16} />
              Upload another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
