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
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-white">Documents Section</h2>

      {canUpload && (
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.15] bg-white/[0.04] px-6 py-8 text-center transition-colors hover:border-white/30 hover:bg-white/10">
          <UploadIcon size={20} className="text-white" />
          <span className="mt-3 text-sm font-semibold text-white">Upload documents</span>
          <span className="mt-1 text-[11px] text-white/50">Front-end only (mock UI)</span>
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
          <div key={doc.id} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">{doc.name}</p>
              <p className="text-[11px] text-white/50">{doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : doc.size}</p>
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
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/70 hover:bg-white/10 transition-colors"
              >
                <EyeIcon size={14} />
                View
              </button>

              <span className="inline-flex rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/50">Ready</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
