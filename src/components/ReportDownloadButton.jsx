import React, { useState } from 'react';
import { DownloadIcon, LoaderCircleIcon } from '@animateicons/react/lucide';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);
import { useClients } from '../context/ClientsContext';

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} MAD`;

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const COLORS = {
  primary: '#1E293B',
  secondary: '#64748B',
  accent: '#7C3AED',
  border: '#E2E8F0',
  cardBg: '#F8FAFC',
  white: '#FFFFFF',
  emerald: '#10B981',
  rose: '#F43F5E',
  blue: '#3B82F6',
};

export default function ReportDownloadButton({ stats, monthlyRevenueData }) {
  const { clients } = useClients();
  const invoices = clients.flatMap((client) =>
    Array.isArray(client.invoices) ? client.invoices : []
  );
  const [isPreparing, setIsPreparing] = useState(false);

  const normalizeClientStatus = (value) => {
    const normalized = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes('insolv')) return 'Insolvable';
    if (normalized.includes('fid')) return 'Fidèle';
    if (normalized.includes('solv')) return 'Solvable';
    return 'Solvable';
  };

  const generatePDF = async () => {
    setIsPreparing(true);

    try {
      const clientStatuses = clients.map((client) => normalizeClientStatus(client.status));
      const solvableClients = clientStatuses.filter((status) => status === 'Solvable').length;
      const totalAssessed = clients.length;
      const totalRevenue = stats?.totalRevenue ?? invoices.reduce((sum, inv) => sum + Number(inv.totalTTC ?? inv.amountHT ?? inv.amount ?? 0), 0);
      const solvabilityRate = stats?.solvabilityRate ?? (totalAssessed > 0 ? Math.round((solvableClients / totalAssessed) * 100) : 0);
      const regulatoryRisks = stats?.totalRisks ?? clients.filter((client) => Number(client.riskScore || 0) > 70).length;

      const chartData = monthlyRevenueData?.length ? monthlyRevenueData : [];
      const sortedInvoices = [...(invoices || [])].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pw - 2 * margin;

      pdf.setFillColor('#FFFFFF');
      pdf.rect(0, 0, pw, pdf.internal.pageSize.getHeight(), 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(COLORS.primary);
      pdf.text('Enterprise Dashboard Report', margin, 22);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(COLORS.secondary);
      pdf.text('FinAudit Finance', margin, 30);

      pdf.setFontSize(10);
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      pdf.text(dateStr, pw - margin, 22, { align: 'right' });

      pdf.setDrawColor(COLORS.border);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 35, pw - margin, 35);

      const cardY = 44;
      const cardH = 32;
      const cardW = (contentWidth - 8) / 3;

      const cards = [
        { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: COLORS.emerald },
        { label: 'Solvability Rate', value: `${solvabilityRate}%`, color: COLORS.blue },
        { label: 'Regulatory Risks', value: String(regulatoryRisks), color: COLORS.rose },
      ];

      cards.forEach((card, i) => {
        const cx = margin + i * (cardW + 4);

        pdf.setFillColor(COLORS.cardBg);
        pdf.setDrawColor(COLORS.border);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(cx, cardY, cardW, cardH, 3, 3, 'FD');

        pdf.setFillColor(card.color);
        pdf.rect(cx, cardY, cardW, 2.5, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(COLORS.secondary);
        pdf.text(card.label, cx + 8, cardY + 11);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(COLORS.primary);
        pdf.text(card.value, cx + 8, cardY + 25);
      });

      const chartY = 86;
      const chartH = 65;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(COLORS.primary);
      pdf.text('Monthly Revenue', margin, chartY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(COLORS.secondary);
      pdf.text('Revenue performance in MAD', margin, chartY + 5);

      if (chartData.length > 0) {
        const barChartY = chartY + 12;
        const barChartH = chartH - 18;
        const barChartW = contentWidth - 4;
        const barLeft = margin + 2;
        const barTop = barChartY;
        const barBottom = barChartY + barChartH;

        pdf.setFillColor(COLORS.white);
        pdf.setDrawColor(COLORS.border);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(barLeft - 2, barTop, barChartW, barChartH, 3, 3, 'FD');

        const maxRev = Math.max(...chartData.map((d) => d.revenue), 1);
        const barCount = chartData.length;
        const barAreaWidth = barChartW - 20;
        const barWidth = Math.min((barAreaWidth - 8 * (barCount + 1)) / barCount, 30);
        const gap = barCount > 1 ? (barAreaWidth - barWidth * barCount) / (barCount + 1) : barAreaWidth / 3;

        pdf.setDrawColor('#E2E8F0');
        pdf.setLineWidth(0.3);
        for (let i = 0; i <= 4; i++) {
          const yVal = Math.round((maxRev / 4) * i);
          const yPos = barBottom - (barChartH / 4) * i;
          pdf.line(barLeft + 15, yPos, barLeft + barChartW - 5, yPos);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(COLORS.secondary);
          pdf.text(yVal >= 1000 ? `${(yVal / 1000).toFixed(1)}k` : String(yVal), barLeft + 12, yPos + 2, { align: 'right' });
        }

        chartData.forEach((d, i) => {
          const barH = (d.revenue / maxRev) * (barChartH - 8);
          const bx = barLeft + 20 + gap + i * (barWidth + gap);
          const by = barBottom - 4 - barH;

          pdf.setFillColor('#7C3AED');
          pdf.roundedRect(bx, by, barWidth, barH, 2, 2, 'F');

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(6.5);
          pdf.setTextColor(COLORS.secondary);
          const monthLabel = d.month.length > 6 ? d.month.substring(0, 3) : d.month;
          pdf.text(monthLabel, bx + barWidth / 2, barBottom + 3, { align: 'center' });
        });
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(COLORS.secondary);
        pdf.text('No invoice data available', margin + 10, chartY + 35);
      }

      const tableTitleY = chartY + chartH + 10;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(COLORS.primary);
      pdf.text('Invoices (All)', margin, tableTitleY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(COLORS.secondary);
      pdf.text(`${sortedInvoices.length} invoices`, margin + 50, tableTitleY);

      const tableData = sortedInvoices.slice(0, 50).map((inv) => ({
        clientName: inv.clientName || '-',
        date: formatDate(inv.date),
        totalTTC: formatCurrency(inv.totalTTC ?? inv.amountHT ?? inv.amount),
        method: inv.method || inv.paymentMethod || '-',
        status: inv.status || inv.paymentStatus || '-',
        flags: inv.flags?.length ? `${inv.flags.length} risk${inv.flags.length > 1 ? 's' : ''}` : 'None',
      }));

      pdf.autoTable({
        head: [['Client', 'Date', 'Total TTC', 'Payment Method', 'Status', 'Risk Flags']],
        body: tableData.map((r) => [r.clientName, r.date, r.totalTTC, r.method, r.status, r.flags]),
        startY: tableTitleY + 5,
        margin: { left: margin, right: margin },
        tableWidth: contentWidth,
        styles: {
          font: 'helvetica',
          fontSize: 8,
          textColor: COLORS.primary,
          lineColor: COLORS.border,
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: COLORS.cardBg,
          textColor: COLORS.secondary,
          fontStyle: 'bold',
          fontSize: 7,
          halign: 'left',
          cellPadding: 3,
        },
        bodyStyles: {
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: contentWidth / 6 },
          1: { cellWidth: contentWidth / 6 },
          2: { cellWidth: contentWidth / 6 },
          3: { cellWidth: contentWidth / 6 },
          4: { cellWidth: contentWidth / 6 },
          5: { cellWidth: contentWidth / 6 },
        },
        theme: 'plain',
        tableLineColor: COLORS.border,
        tableLineWidth: 0.3,
      });

      pdf.save('Enterprise-Dashboard-Report.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert(`PDF generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generatePDF}
      disabled={isPreparing}
      className="no-print inline-flex items-center gap-2 rounded-xl bg-[var(--c-danger-bg)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-[var(--c-danger)] shadow transition-all hover:bg-[var(--c-danger-hover)] disabled:cursor-not-allowed disabled:opacity-80 backdrop-blur-sm border border-[var(--c-danger-border)] focus:outline-none focus:ring-2 focus:ring-[var(--c-danger-border)] focus:ring-offset-2"
      title="Download dashboard as PDF"
    >
      {isPreparing ? <LoaderCircleIcon size={14} className="animate-spin" /> : <DownloadIcon size={14} />}
      <span>{isPreparing ? 'Generating PDF...' : 'Download PDF'}</span>
    </button>
  );
}
