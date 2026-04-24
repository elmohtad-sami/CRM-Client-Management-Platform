import React from 'react';
import { Upload } from 'lucide-react';

export default function DocumentsSection({ documents = [], canUpload, onUpload }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      onUpload?.({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        uploadDate: new Date().toISOString(),
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`
      });
    });
    event.target.value = '';
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900">Documents Section</h2>

      {canUpload && (
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40">
          <Upload size={24} className="text-indigo-500" />
          <span className="mt-3 text-sm font-semibold text-slate-900">Upload documents</span>
          <span className="mt-1 text-xs text-slate-500">Front-end only (mock UI)</span>
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
          <div key={doc.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
              <p className="text-xs text-slate-500">{doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : doc.size}</p>
            </div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">Ready</span>
          </div>
        ))}
      </div>
    </section>
  );
}
