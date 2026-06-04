import React from 'react';
import { UploadIcon, EyeIcon } from '@animateicons/react/lucide';

export default function DocumentsSection({ documents = [], canUpload, onUpload, onView }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const obj = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        uploadDate: new Date().toISOString(),
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        url: URL.createObjectURL(file),
        file
      };
      onUpload?.(obj);
    });
    event.target.value = '';
  };

  return (
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-[var(--c-text)]">Documents Section</h2>

      {canUpload && (
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--c-border-strong)] bg-[var(--c-elevated)] px-6 py-8 text-center transition-colors hover:border-[var(--c-border)] hover:bg-[var(--c-element-hover)]">
          <UploadIcon size={20} className="text-[var(--c-text)]" />
          <span className="mt-3 text-sm font-semibold text-[var(--c-text)]">Upload documents</span>
          <span className="mt-1 text-[11px] text-[var(--c-text-3)]">Front-end only (mock UI)</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}

      <div className="mt-4 space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] px-4 py-2.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)]">{doc.name}</p>
              <p className="text-[11px] text-[var(--c-text-3)]">{doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : doc.size}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof onView === 'function') {
                    try { onView(doc); } catch (e) {}
                  }

                  if (doc.url) {
                    window.open(doc.url, '_blank', 'noopener,noreferrer');
                    return;
                  }

                  if (doc.file) {
                    try {
                      const blob = doc.file instanceof Blob ? doc.file : null;
                      if (blob) {
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank', 'noopener,noreferrer');
                        // revoke after a while
                        setTimeout(() => URL.revokeObjectURL(url), 10000);
                        return;
                      }
                    } catch (e) {
                      // fallthrough
                    }
                  }

                  alert('No preview available for this document.');
                }}
                title="View document"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-3 py-1 text-xs font-semibold text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors"
              >
                <EyeIcon size={14} />
                View
              </button>

              <span className="inline-flex rounded-full border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-3 py-1 text-xs font-semibold text-[var(--c-text-3)]">Ready</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
