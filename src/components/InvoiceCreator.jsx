import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ClipboardIcon, XIcon } from '@animateicons/react/lucide';
import autoTable from 'jspdf-autotable';
import { useClients } from '../context/ClientsContext';

export default function InvoiceCreator() {
  const { createInvoice } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    clientName: '',
    phone: '',
    address: '',
    email: '',
    invoiceNumber: '2026-001',
    dueDate: '',
    amountHT: '',
  });

  const parsedAmountHT = Number.parseFloat(invoiceData.amountHT) || 0;
  const vatAmount = (parsedAmountHT * 0.2).toFixed(2);
  const totalTTC = (parsedAmountHT * 1.2).toFixed(2);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setInvoiceData({
      clientName: '',
      phone: '',
      address: '',
      email: '',
      invoiceNumber: '2026-001',
      dueDate: '',
      amountHT: '',
    });
  };

  const downloadPDF = async () => {
    if (isDownloading || isSaving) return;

    setIsDownloading(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const amountHT = parseFloat(invoiceData.amountHT || 0).toFixed(2);
      const tva = parseFloat(vatAmount).toFixed(2);
      const ttc = parseFloat(totalTTC).toFixed(2);
      const issueDate = new Date().toLocaleDateString('fr-FR');

      doc.setFillColor(132, 204, 22);


      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('LOGO', 20, 20);

      doc.setFontSize(26);
      doc.setTextColor(77, 124, 15);
      doc.text('Facture N°', pageWidth - 80, 20);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Ville, le ${issueDate}`, pageWidth - 80, 28);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text("Nom de l'entreprise", 20, 45);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Adresse', 20, 52);
      doc.text('Ville et Code Postal', 20, 58);
      doc.text('Numero de telephone', 20, 64);
      doc.text('Email', 20, 70);

      doc.rect(pageWidth - 85, 38, 70, 38);
      doc.text(invoiceData.clientName || 'Nom du client', pageWidth - 82, 46);
      doc.text(invoiceData.address || 'Adresse', pageWidth - 82, 53);
      doc.text(invoiceData.phone || 'Numero de telephone', pageWidth - 82, 60);
      doc.text(invoiceData.email || 'Email', pageWidth - 82, 67);

      autoTable(doc, {
        startY: 80,
        margin: { left: 15, right: 15 },
        head: [['Description', 'Prix unitaire HT', 'Unite', 'Quantite', 'Montant HT']],
        body: [
          ['Detailler prestation ici', `${amountHT} DH`, 'heures', '1', `${amountHT} DH`],
          ['', '... DH', 'heures', '', '... DH'],
          ['', '... DH', 'heures', '...', '... DH'],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [132, 204, 22],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 10,
        },
        bodyStyles: {
          fillColor: [236, 253, 245],
          textColor: [0, 0, 0],
          fontSize: 9,
          halign: 'center',
        },
      });

      const tableEndY = doc.lastAutoTable.finalY;

      doc.rect(15, tableEndY + 10, 65, 38);
      doc.setFontSize(10);
      doc.text('Modalites et conditions de', 18, tableEndY + 18);
      doc.text('reglement :', 18, tableEndY + 24);
      doc.text(`Date d'echeance : ${invoiceData.dueDate || '---'}`, 18, tableEndY + 38);

      const totalsX = pageWidth - 85;
      let totalsY = tableEndY + 10;
      doc.line(totalsX, totalsY + 2, pageWidth - 15, totalsY + 2);
      doc.text('Total HT', totalsX + 2, totalsY + 8);
      doc.text(`${amountHT} DH`, pageWidth - 17, totalsY + 8, { align: 'right' });

      doc.line(totalsX, totalsY + 10, pageWidth - 15, totalsY + 10);
      doc.text('TVA 20%', totalsX + 2, totalsY + 16);
      doc.text(`${tva} DH`, pageWidth - 17, totalsY + 16, { align: 'right' });

      doc.line(totalsX, totalsY + 18, pageWidth - 15, totalsY + 18);
      doc.setFont('helvetica', 'bold');
      doc.text('Total TTC', totalsX + 2, totalsY + 24);
      doc.text(`${ttc} DH`, pageWidth - 17, totalsY + 24, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      const signatureTop = pageHeight - 55;
      doc.text('Signature :', pageWidth - 58, signatureTop - 4);
      doc.rect(pageWidth - 85, signatureTop, 70, 22);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Mon entreprise - Societe ... au capital de ... DH', pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.text('N° Siret :', pageWidth / 2, pageHeight - 7, { align: 'center' });

      const invoiceFileName = `Invoice_${invoiceData.invoiceNumber || '2026-001'}.pdf`;
      doc.save(invoiceFileName);

      // Persist the invoice to the backend
      setIsSaving(true);
      await createInvoice({
        clientName: invoiceData.clientName,
        amountHT: parsedAmountHT,
        tva: parseFloat(vatAmount),
        totalTTC: parseFloat(totalTTC),
        dueDate: invoiceData.dueDate,
        invoiceNumber: invoiceData.invoiceNumber,
        paymentStatus: 'Pending',
      });

      closeModal();
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsSaving(false);
    }
  };

  const isCreating = isDownloading || isSaving;

  return (
    <>
      {/* Generate Invoice Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 font-bold text-white text-xs uppercase tracking-wider shadow-md transition hover:bg-white/25 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
      >
        <ClipboardIcon size={14} />
        <span>Generate New Invoice</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4 py-6">
          <div className="relative h-screen w-full max-w-6xl overflow-y-auto rounded-2xl bg-black/70 backdrop-blur-2xl shadow-2xl border border-white/[0.12]">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.08] bg-black/40 backdrop-blur-xl px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Invoice</h2>
                <p className="text-xs text-white/50">Fill in the form and see your invoice preview in real-time</p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
              >
                <XIcon size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              <div className="mx-auto max-w-2xl">
                {/* Form Section */}
                <div className="rounded-xl bg-white/[0.04] p-6">
                  <h3 className="mb-5 text-lg font-semibold text-white/80">Invoice Details</h3>
                  <form className="space-y-2.5">
                    <div>
                      <label htmlFor="clientName" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Client Name
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        value={invoiceData.clientName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Client Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={invoiceData.phone}
                        onChange={handleChange}
                        placeholder="+212 6 00 00 00 00"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Client Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={invoiceData.address}
                        onChange={handleChange}
                        placeholder="Casablanca, Morocco"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Client Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={invoiceData.email}
                        onChange={handleChange}
                        placeholder="client@example.com"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="invoiceNumber" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Invoice Number
                      </label>
                      <input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={invoiceData.invoiceNumber}
                        onChange={handleChange}
                        placeholder="2026-001"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div>
                      <label htmlFor="amountHT" className="mb-2 block text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Amount HT (DH)
                      </label>
                      <input
                        id="amountHT"
                        name="amountHT"
                        type="number"
                        min="0"
                        step="0.01"
                        value={invoiceData.amountHT}
                        onChange={handleChange}
                        placeholder="1200.00"
                        className="w-full rounded-xl border border-white/[0.15] bg-white/[0.08] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/30"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between rounded-xl bg-white/[0.06] px-4 py-2.5">
                        <span className="font-medium text-white/70">TVA (20%)</span>
                        <span className="text-white">{parseFloat(vatAmount).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between rounded-xl bg-white/10 px-4 py-2.5">
                        <span className="font-semibold text-white">Total TTC</span>
                        <span className="text-lg font-semibold text-white/80">{parseFloat(totalTTC).toFixed(2)} €</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 font-medium text-white/70 text-xs uppercase tracking-wider transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={isCreating}
                        className="flex-1 rounded-xl bg-white/15 px-4 py-2.5 font-bold text-white text-xs uppercase tracking-wider transition hover:bg-white/25 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
                      >
                        {isCreating ? 'Saving...' : 'Create & Download PDF'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}