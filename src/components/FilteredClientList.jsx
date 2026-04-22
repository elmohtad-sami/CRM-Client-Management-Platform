import React from 'react';
import { Edit2, Trash2, Receipt, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FilteredClientList({
  status,
  hasSelectedClient,
  displayedInvoices,
  hasAudited,
  openModal,
  handleDelete,
  setSelectedInvoice,
  setIsDrawerOpen
}) {
  const handleExportPDF = (inv) => {
    console.log('Generating invoice PDF for:', inv);

    const doc = new jsPDF();
    const primaryColor = [108, 166, 50]; // Text Green
    const secondaryColor = [159, 198, 66]; // Table Header Green
    const lightGreen = [238, 248, 226]; // Row alternate Green
    
    // Top Left: LOGO Box (placeholder)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, 15, 35, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', 26, 23);
    
    // Top Left: Company Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("Nom de l'entreprise", 20, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Adresse de l'entreprise\nVille et Code Postal\nNuméro: +33 1 23 45 67 89\nEmail: contact@entreprise.com", 20, 47);

    // Top Right: Facture N°
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('FACTURE', 120, 24);
    
    // Date & Number
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const invoiceDate = new Date(inv.date).toLocaleDateString('fr-FR');
    doc.text(`N° de facture : ${inv.id.padStart(3, '0')}`, 120, 32);
    doc.text(`Date : le ${invoiceDate}`, 120, 38);
    
    // Top Right: Client Box
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
    doc.rect(120, 48, 70, 35, 'FD'); // Fill and Draw
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Facturé à :", 125, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${inv.clientName || 'Nom du Client'}`, 125, 62);
    doc.setFontSize(9);
    doc.text("Adresse du client\nCode Postal et Ville\nTéléphone / Email", 125, 68);

    // Main Table
    const amountHT = parseFloat(inv.amountHT || 0).toFixed(2);
    const tva = parseFloat(inv.tva || 0).toFixed(2);
    const totalTTC = parseFloat(inv.totalTTC || 0).toFixed(2);
    
    autoTable(doc, {
      startY: 95,
      head: [['Description', 'Prix\nunitaire\nHT', 'Unité', 'Quantité', 'Montant HT']],
      body: [
        [ 'Prestation de service / Vente', `${amountHT} MAD`, 'heures', '1', `${amountHT} MAD` ],
        [ '', '... MAD', 'heures', '', '... MAD' ],
        [ '', '... MAD', 'heures', '', '... MAD' ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: secondaryColor,
        textColor: 255,
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: lightGreen
      },
      styles: {
        textColor: 0,
        halign: 'center',
        lineColor: [200, 220, 180]
      },
      columnStyles: {
        0: { halign: 'left' }
      }
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Totals Table (Bottom Right)
    autoTable(doc, {
      startY: finalY,
      margin: { left: 130 },
      tableWidth: 60,
      theme: 'grid',
      body: [
        ['Total HT', `${amountHT} MAD`],
        ['TVA', `${tva} MAD`],
        ['Total TTC', `${totalTTC} MAD`]
      ],
      styles: {
        halign: 'right',
        textColor: 0,
        fontSize: 10,
        lineColor: [200, 220, 180]
      },
      alternateRowStyles: {
        fillColor: lightGreen
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { fontStyle: 'bold' }
      }
    });

    // Bottom Left: Conditions Box
    const issueDateStr = invoiceDate;
    const dueDateStr = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('fr-FR') : 'À réception';
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Modalités et Conditions", 20, finalY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text("Paiement dû à réception. Merci de mentionner le", 20, finalY + 6);
    doc.text("numéro de facture lors du transfert bancaire.", 20, finalY + 11);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Date d'émission : `, 20, finalY + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`${issueDateStr}`, 52, finalY + 20);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Date d'échéance : `, 20, finalY + 25);
    doc.setFont('helvetica', 'normal');
    doc.text(`${dueDateStr}`, 52, finalY + 25);
    
    // Signature box
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Signature / Cachet", 120, finalY);
    
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(0.5);
    doc.setFillColor(250, 250, 250);
    doc.rect(120, finalY + 4, 70, 22, 'FD');

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const pageHeight = doc.internal.pageSize.height;
    doc.text("Société Anonyme ... au capital de ... euros - SIRET : 123 456 789 00012", 105, pageHeight - 15, { align: 'center' });
    doc.text("TVA Intracommunautaire: FR01234567890 | IBAN: FR76 xxxx xxxx xxxx xxxx xxxxx xx", 105, pageHeight - 10, { align: 'center' });

    // Save with dynamic filename
    const safeFilename = inv.clientName ? inv.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'client';
    doc.save(`facture_${safeFilename}_${inv.id}.pdf`);
  };
  if (displayedInvoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Receipt size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No invoices found</h3>
        <p className="text-slate-500 max-w-sm">
          {hasSelectedClient 
            ? "This client has no recorded invoices yet." 
            : `No invoices currently match the '${status}' filter.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {hasSelectedClient ? "Client Invoices" : `Invoices (${status})`}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Showing {displayedInvoices.length} {displayedInvoices.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Client</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Date</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Total TTC</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Payment Method</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Payment Status</th>
              {hasAudited && <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs text-center">Audit Status</th>}
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedInvoices.map((inv) => {
              const hasFlags = inv.flags && inv.flags.length > 0;
              return (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.clientName}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    {Number(inv.totalTTC).toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-slate-600">{inv.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.paymentStatus === 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      {inv.paymentStatus !== 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                      {inv.paymentStatus}
                    </span>
                  </td>
                  {hasAudited && (
                    <td className="px-6 py-4 text-center">
                      {hasFlags ? (
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          <AlertTriangle size={14} className="text-rose-500" />
                          <span>{inv.flags.length} Risks</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 size={16} />
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleExportPDF(inv)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => openModal(inv)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        title="Edit Invoice"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inv.id)} 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
