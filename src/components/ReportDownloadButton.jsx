import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

export default function ReportDownloadButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    
    try {
      const input = document.getElementById('dashboard-content');
      if (!input) {
        console.error('Conteneur du tableau de bord introuvable.');
        setIsExporting(false);
        return;
      }

      // Temporarily hide scrollbars or overflow that can break html2canvas layout
      const originalStyle = input.style.overflow;
      input.style.overflow = 'visible';

      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#f8fafc' // matched dashboard background
      });
      
      input.style.overflow = originalStyle;
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If height is larger than 1 page, let's keep things contained to avoid crash
      // But adding multiple pages if necessary
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Rapport-Tableau-de-bord.pdf');
    } catch (error) {
      console.error('Erreur lors de la generation du PDF :', error);
      alert('Impossible de generer le PDF. Verifiez la console pour plus de details.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadReport}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
        isExporting ? 'bg-rose-500 cursor-not-allowed opacity-80' : 'bg-rose-600 hover:bg-rose-700'
      }`}
      title="Telecharger le tableau de bord en PDF"
    >
      {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
      <span>{isExporting ? 'Export en cours...' : 'Exporter PDF'}</span>
    </button>
  );
}