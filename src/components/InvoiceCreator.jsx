import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, X } from 'lucide-react';
import autoTable from 'jspdf-autotable';

export default function InvoiceCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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
    if (isDownloading) return;

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
      doc.rect(15, 60, pageWidth - 30, 8, 'F');

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
      doc.text(`Date d'echeance : ${invoiceData.dueDate || '../../...'}`, 18, tableEndY + 38);

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
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Generate Invoice Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        <FileText size={18} />
        <span>Generate New Invoice</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
          <div className="relative h-screen w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
                <p className="text-sm text-gray-500">Fill in the form and see your invoice preview in real-time</p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6">
              <div className="mx-auto max-w-2xl">
                {/* Form Section */}
                <div className="rounded-xl bg-gray-50 p-6">
                  <h3 className="mb-5 text-lg font-semibold text-gray-800">Invoice Details</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="clientName" className="mb-2 block text-sm font-medium text-gray-700">
                        Client Name
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        value={invoiceData.clientName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                        Client Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={invoiceData.phone}
                        onChange={handleChange}
                        placeholder="+212 6 00 00 00 00"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                        Client Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={invoiceData.address}
                        onChange={handleChange}
                        placeholder="Casablanca, Morocco"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Client Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={invoiceData.email}
                        onChange={handleChange}
                        placeholder="client@example.com"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="invoiceNumber" className="mb-2 block text-sm font-medium text-gray-700">
                        Invoice Number
                      </label>
                      <input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={invoiceData.invoiceNumber}
                        onChange={handleChange}
                        placeholder="2026-001"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-gray-700">
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="amountHT" className="mb-2 block text-sm font-medium text-gray-700">
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between rounded-lg bg-white p-3">
                        <span className="font-medium text-gray-700">TVA (20%)</span>
                        <span className="text-gray-900">{parseFloat(vatAmount).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-purple-50 p-3">
                        <span className="font-semibold text-gray-900">Total TTC</span>
                        <span className="text-lg font-semibold text-purple-600">{parseFloat(totalTTC).toFixed(2)} €</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                      >
                        {isDownloading ? 'Generating PDF...' : 'Create & Download PDF'}
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