import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';

export default function ReportDownloadButton({ contentRef }) {
  const [isPreparing, setIsPreparing] = useState(false);

  const onClickPrint = () => {
    if (!contentRef?.current && !document.getElementById('dashboard-content')) {
      alert('Dashboard content not found. Please refresh and try again.');
      return;
    }

    setIsPreparing(true);

    const originalTitle = document.title;
    document.title = 'Rapport-Tableau-de-bord';

    const finishPrint = () => {
      document.title = originalTitle;
      setIsPreparing(false);
      window.removeEventListener('afterprint', finishPrint);
      window.removeEventListener('focus', finishPrint);
    };

    window.addEventListener('afterprint', finishPrint);
    window.addEventListener('focus', finishPrint);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.print();
        window.setTimeout(finishPrint, 1500);
      });
    });
  };

  return (
    <button
      type="button"
      onClick={onClickPrint}
      disabled={isPreparing}
      className="no-print inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-rose-300 shadow transition-all hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-80 backdrop-blur-sm border border-rose-500/30 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:ring-offset-2"
      title="Download dashboard as PDF"
    >
      {isPreparing ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
      <span>{isPreparing ? 'Opening print...' : 'Download PDF'}</span>
    </button>
  );
}