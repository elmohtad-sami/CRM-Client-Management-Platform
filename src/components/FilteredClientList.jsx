import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPenIcon, Trash2Icon, ClipboardIcon, TriangleAlertIcon, CircleCheckIcon, DownloadIcon, EyeIcon, SearchIcon } from '@animateicons/react/lucide';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useClients } from '../context/ClientsContext';

export default function FilteredClientList({
  status,
  hasSelectedClient,
  displayedInvoices,
  hasAudited,
  openModal,
  handleDelete,
  setSelectedInvoice,
  setIsDrawerOpen,
  onRowClick,
  searchQuery,
  setSearchQuery
}) {
  const navigate = useNavigate();
  const { clients } = useClients();

  const resolveClientId = (clientName) => {
    const normalizedName = String(clientName || '').trim().toLowerCase();
    const client = clients.find((entry) => {
      const entryId = String(entry._id || '').trim().toLowerCase();
      const entryName = String(entry.name || '').trim().toLowerCase();
      return entryId === normalizedName || entryName === normalizedName;
    });

    return client?._id || '';
  };

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
  const showEmpty = displayedInvoices.length === 0;

  return (
    <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-[var(--c-border)] flex flex-wrap justify-between items-center gap-3 bg-[var(--c-elevated)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--c-text)]">
            {hasSelectedClient ? "Client Invoices" : `Invoices (${status})`}
          </h3>
          <p className="text-sm text-[var(--c-text-3)] mt-1">
            {showEmpty ? '0 records' : `Showing ${displayedInvoices.length} ${displayedInvoices.length === 1 ? 'record' : 'records'}`}
          </p>
        </div>
        {setSearchQuery && (
          <div className="relative w-full sm:w-64 no-print">
            <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-placeholder)] pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom de client..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--c-border)] focus:bg-[var(--c-element-hover)] transition-all"
            />
          </div>
        )}
      </div>
      
      {showEmpty ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[var(--c-element)] text-[var(--c-text-3)] rounded-full flex items-center justify-center mb-4">
            <ClipboardIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-[var(--c-text)] mb-2">No invoices found</h3>
          <p className="text-[var(--c-text-3)] max-w-sm">
            {hasSelectedClient 
              ? "This client has no recorded invoices yet." 
              : `No invoices currently match the '${status}' filter.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--c-elevated)] border-b border-[var(--c-border)] text-[var(--c-text-3)]">
            <tr>
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs">Client</th>
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs">Date</th>
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs">Total TTC</th>
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs">Payment Method</th>
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs">Payment Status</th>
              {hasAudited && <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs text-center">Audit Status</th>}
              <th className="px-4 py-3 font-bold tracking-wider uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--c-border)]">
            {displayedInvoices.map((inv) => {
              const hasFlags = inv.flags && inv.flags.length > 0;
              const isClientSummaryRow = inv.sourceType === 'client';
              return (
                <tr
                  key={inv.id}
                  className="hover:bg-[var(--c-elevated)] transition-colors group cursor-pointer"
                  onClick={() => onRowClick?.(inv.clientId || resolveClientId(inv.clientName))}
                >
                  <td className="px-4 py-3 font-bold text-[var(--c-text)]">{inv.clientName}</td>
                  <td className="px-4 py-3 text-[var(--c-text-2)]">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-bold text-[var(--c-text)]">
                    {Number(inv.totalTTC).toLocaleString()} MAD
                  </td>
                  <td className="px-4 py-3 text-[var(--c-text-2)]">{inv.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'Paid' 
                        ? 'bg-[var(--c-positive-bg)] text-[var(--c-positive)] border border-[var(--c-positive-border)]' 
                        : 'bg-[var(--c-warning-bg)] text-[var(--c-warning)] border border-[var(--c-warning-border)]'
                    }`}>
                      {inv.paymentStatus === 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-positive)]"></span>}
                      {inv.paymentStatus !== 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-warning)] animate-pulse"></span>}
                      {inv.paymentStatus}
                    </span>
                  </td>
                  {hasAudited && (
                    <td className="px-4 py-3 text-center">
                      {hasFlags ? (
                        <button 
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedInvoice(inv);
                            setIsDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--c-danger-bg)] text-[var(--c-danger)] border border-[var(--c-danger-border)] hover:bg-[var(--c-danger-hover)] transition-colors"
                        >
                          <TriangleAlertIcon size={14} className="text-[var(--c-danger)]" />
                          <span>{inv.flags.length} Risks</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--c-positive-bg)] text-[var(--c-positive)] border border-[var(--c-positive-border)]">
                          <CircleCheckIcon size={14} />
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          const clientId = inv.clientId || resolveClientId(inv.clientName);
                          if (!clientId) return;
                          onRowClick?.(clientId);
                          navigate(`/clients/${clientId}`);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--c-element)] text-[var(--c-text)] px-4 py-2 text-xs font-semibold backdrop-blur-sm border border-[var(--c-border)] transition-all duration-200 hover:bg-[var(--c-element-hover-2)]"
                        title="View Client"
                      >
                        <EyeIcon size={14} />
                        View
                      </button>
                      {!isClientSummaryRow && (
                        <>
                          <button 
                            onClick={(event) => {
                              event.stopPropagation();
                              handleExportPDF(inv);
                            }}
                            className="p-2 text-[var(--c-placeholder)] hover:text-[var(--c-positive)] hover:bg-[var(--c-positive-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--c-positive-border)]"
                            title="Download PDF"
                          >
                            <DownloadIcon size={14} />
                          </button>
                          <button 
                            onClick={(event) => {
                              event.stopPropagation();
                              openModal(inv);
                            }} 
                            className="p-2 text-[var(--c-placeholder)] hover:text-[var(--c-accent)] hover:bg-[var(--c-accent-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--c-accent-border)]"
                            title="Edit Invoice"
                          >
                            <UserPenIcon size={14} />
                          </button>
                          <button 
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(inv.id);
                            }} 
                            className="p-2 text-[var(--c-placeholder)] hover:text-[var(--c-danger)] hover:bg-[var(--c-danger-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--c-danger-border)]"
                            title="Delete Invoice"
                          >
                            <Trash2Icon size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
