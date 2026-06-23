import React, { useState } from 'react';
import { DollarSignIcon, Trash2Icon, ClipboardIcon } from '@animateicons/react/lucide';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.addVirtualFileSystem(pdfFonts);

function buildPdfDefinition(devis, company) {
  const now = new Date();
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    pageSize: 'A4',
    pageMargins: [36, 36, 36, 72],
    background() {
      return {
        canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 8, color: '#059669' },
          { type: 'rect', x: 0, y: 841.89 - 20, w: 595.28, h: 20, color: '#f0fdf4' }
        ]
      };
    },
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: company.name, style: 'companyName' },
              { text: company.address, style: 'companyDetail' },
              { text: company.city, style: 'companyDetail' },
              { text: `Tél: ${company.phone}  |  Email: ${company.email}`, style: 'companyDetail', margin: [0, 2, 0, 0] },
              { text: `RC: ${company.rc}  |  IF: ${company.if_}  |  ICE: ${company.ice}`, style: 'companyDetail', margin: [0, 2, 0, 0] }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: 'DEVIS', style: 'devisTitle' },
              { text: devis.reference, style: 'refText' },
              { text: `Date: ${now.toLocaleDateString('fr-FR')}`, style: 'dateText' },
              { text: `Valable jusqu'au: ${dueDate.toLocaleDateString('fr-FR')}`, style: 'dateText' }
            ]
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 1.5, lineColor: '#10B981' }], margin: [0, 10, 0, 0] },

      { text: 'CLIENT', style: 'sectionTitle' },
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: devis.client.name, style: 'clientName' },
              devis.client.company ? { text: devis.client.company, style: 'clientDetail' } : null,
              { text: devis.client.address, style: 'clientDetail' },
              { text: `Email: ${devis.client.email}  |  Tél: ${devis.client.phone}`, style: 'clientDetail' }
            ].filter(Boolean)
          },
          {
            width: 'auto',
            stack: [
              { text: 'N° Devis:', style: 'metaLabel' },
              { text: devis.reference, style: 'metaValue' }
            ],
            alignment: 'right'
          }
        ]
      },

      { text: 'DÉTAIL DU DEVIS', style: 'sectionTitle' },
      {
        style: 'itemsTable',
        table: {
          headerRows: 1,
          widths: ['*', 60, 80, 80],
          body: [
            [
              { text: 'Désignation', style: 'tableHeader' },
              { text: 'Qté', style: 'tableHeader', alignment: 'center' },
              { text: 'P.U. HT', style: 'tableHeader', alignment: 'right' },
              { text: 'Total HT', style: 'tableHeader', alignment: 'right' }
            ],
            [
              { text: devis.description || 'Prestations de services', style: 'tableCell' },
              { text: '1', style: 'tableCell', alignment: 'center' },
              { text: `${devis.amountHT.toFixed(2)} MAD`, style: 'tableCell', alignment: 'right' },
              { text: `${devis.amountHT.toFixed(2)} MAD`, style: 'tableCell', alignment: 'right' }
            ]
          ]
        },
        layout: {
          hLineWidth(i) { return i === 0 ? 0 : i === 1 ? 0.5 : 0; },
          vLineWidth() { return 0; },
          hLineColor(i) { return i === 1 ? '#D1D5DB' : '#ffffff'; },
          paddingLeft() { return 8; },
          paddingRight() { return 8; },
          paddingTop() { return 6; },
          paddingBottom() { return 6; }
        }
      },

      {
        alignment: 'right',
        margin: [0, 12, 0, 0],
        table: {
          widths: [120, 100],
          body: [
            [
              { text: 'Montant HT', style: 'totalLabel' },
              { text: `${devis.amountHT.toFixed(2)} MAD`, style: 'totalValue', alignment: 'right' }
            ],
            [
              { text: 'TVA', style: 'totalLabel' },
              { text: `${devis.tva.toFixed(2)} MAD`, style: 'totalValue', alignment: 'right' }
            ],
            [
              { text: 'Total TTC', style: 'totalLabelBold' },
              { text: `${devis.totalTTC.toFixed(2)} MAD`, style: 'totalValueBold', alignment: 'right' }
            ]
          ]
        },
        layout: {
          hLineWidth() { return 0; },
          vLineWidth() { return 0; },
          paddingLeft() { return 8; },
          paddingRight() { return 8; },
          paddingTop() { return 3; },
          paddingBottom() { return 3; }
        }
      },

      { text: 'CONDITIONS', style: 'sectionTitle' },
      {
        ul: [
          'Validité de l\'offre : 30 jours à compter de la date d\'émission.',
          'Mode de règlement : Virement bancaire.',
          'Pénalités de retard : 1.5% du montant TTC par mois de retard.',
          'Réserve de propriété : Les biens livrés restent la propriété du vendeur jusqu\'au paiement intégral.'
        ],
        style: 'termsList'
      },

      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Coordonnées bancaires', style: 'bankTitle' },
              { text: `RIB : ${company.rib}`, style: 'bankText' },
              { text: `Banque : ${company.bank}`, style: 'bankText' }
            ]
          }
        ],
        margin: [0, 12, 0, 0]
      }
    ],

    footer(page, pages) {
      return {
        margin: [36, 0, 36, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'Cachet et signature du client précédée de la mention « Bon pour accord »', style: 'footerText', alignment: 'center' },
              { text: `Page ${page} / ${pages}`, style: 'footerPage', alignment: 'center' }
            ]
          }
        ]
      };
    },

    styles: {
      companyName: { fontSize: 16, bold: true, color: '#059669', margin: [0, 0, 0, 4] },
      companyDetail: { fontSize: 8, color: '#4B5563', lineHeight: 1.4 },
      devisTitle: { fontSize: 26, bold: true, color: '#059669', alignment: 'right' },
      refText: { fontSize: 11, bold: true, color: '#1F2937', alignment: 'right', margin: [0, 2, 0, 0] },
      dateText: { fontSize: 8, color: '#6B7280', alignment: 'right', lineHeight: 1.5 },
      sectionTitle: { fontSize: 10, bold: true, color: '#059669', margin: [0, 14, 0, 4] },
      clientName: { fontSize: 11, bold: true, color: '#1F2937', margin: [0, 0, 0, 2] },
      clientDetail: { fontSize: 9, color: '#4B5563', lineHeight: 1.5 },
      metaLabel: { fontSize: 8, color: '#9CA3AF' },
      metaValue: { fontSize: 9, bold: true, color: '#1F2937' },
      tableHeader: { fontSize: 8, bold: true, color: '#ffffff', fillColor: '#059669', margin: [0, 0, 0, 0] },
      tableCell: { fontSize: 9, color: '#374151' },
      totalLabel: { fontSize: 9, color: '#4B5563' },
      totalLabelBold: { fontSize: 9, bold: true, color: '#1F2937' },
      totalValue: { fontSize: 9, color: '#374151' },
      totalValueBold: { fontSize: 11, bold: true, color: '#059669' },
      termsList: { fontSize: 8, color: '#4B5563', lineHeight: 1.6, margin: [0, 2, 0, 0] },
      bankTitle: { fontSize: 9, bold: true, color: '#1F2937', margin: [0, 0, 0, 2] },
      bankText: { fontSize: 8, color: '#4B5563', lineHeight: 1.5 },
      footerText: { fontSize: 8, color: '#9CA3AF', italics: true },
      footerPage: { fontSize: 7, color: '#D1D5DB', margin: [0, 4, 0, 0] }
    },

    defaultStyle: { font: 'Roboto' }
  };
}

function generatePdf(devis, company) {
  try {
    const def = buildPdfDefinition(devis, company);
    const now = new Date();
    const safeRef = devis.reference.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Devis_${safeRef}_${now.toISOString().slice(0, 10)}.pdf`;
    pdfMake.createPdf(def).download(filename);
  } catch (err) {
    console.error('PDF generation failed', err);
  }
}

export default function DevisManager({ devisList, onAddDevis, onDeleteDevis, companyInfo, onUpdateCompanyInfo }) {
  const [step, setStep] = useState('client');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '', company: '', address: '' });
  const [devisInfo, setDevisInfo] = useState({ reference: '', description: '', amountHT: '', tva: '', status: 'En attente' });
  const [companyForm, setCompanyForm] = useState({ ...companyInfo });

  const amountHT = parseFloat(devisInfo.amountHT) || 0;
  const tva = parseFloat(devisInfo.tva) || 0;
  const totalTTC = amountHT + tva;

  const handleClientChange = (field) => (e) => setClientInfo((prev) => ({ ...prev, [field]: e.target.value }));

  const handleDevisChange = (field) => (e) => setDevisInfo((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCompanyFieldChange = (field) => (e) => setCompanyForm((prev) => ({ ...prev, [field]: e.target.value }));

  const goToStep = (nextStep) => {
    if (step === 'company' && nextStep === 'client') {
      onUpdateCompanyInfo({ ...companyForm });
    }
    setStep(nextStep);
  };

  const resetForm = () => {
    setClientInfo({ name: '', email: '', phone: '', company: '', address: '' });
    setDevisInfo({ reference: '', description: '', amountHT: '', tva: '', status: 'En attente' });
    setStep('company');
  };

  const handleInstallDevis = (e) => {
    e.preventDefault();
    if (!clientInfo.name.trim() || !devisInfo.reference.trim()) return;
    const devis = {
      id: Date.now().toString(),
      client: { ...clientInfo, name: clientInfo.name.trim() },
      reference: devisInfo.reference.trim(),
      description: devisInfo.description.trim(),
      amountHT,
      tva,
      totalTTC,
      status: devisInfo.status,
      createdAt: new Date().toISOString()
    };
    onAddDevis(devis);
    generatePdf(devis, companyInfo);
    resetForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepté': return 'bg-[var(--c-positive-bg)] text-[var(--c-positive)] border-[var(--c-positive-border)]';
      case 'Refusé': return 'bg-[var(--c-danger-bg)] text-[var(--c-danger)] border-[var(--c-danger-border)]';
      default: return 'bg-[var(--c-warning-bg)] text-[var(--c-warning)] border-[var(--c-warning-border)]';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl p-6 shadow-[var(--c-glow)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--c-positive-bg)] text-[var(--c-positive)] flex items-center justify-center">
            <DollarSignIcon size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--c-text)]">Installer Devis</h3>
            <p className="text-xs text-[var(--c-text-3)]">Enregistrez les informations du client et créez un nouveau devis.</p>
          </div>
        </div>

        <form onSubmit={handleInstallDevis} className="space-y-8">
          {step === 'company' ? (
            <div className="bg-[var(--c-elevated)] border border-[var(--c-positive-border)] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-wider">Informations de la Société</h4>
                <span className="text-[10px] text-[var(--c-positive)]/70 font-medium bg-[var(--c-positive-bg)] px-2.5 py-1 rounded-full border border-[var(--c-positive-border)]">Étape 1/3</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Nom de la société</label>
                <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.name} onChange={handleCompanyFieldChange('name')} placeholder="FINANCE CRM" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Adresse</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.address} onChange={handleCompanyFieldChange('address')} placeholder="123, Avenue Mohammed V" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Ville</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.city} onChange={handleCompanyFieldChange('city')} placeholder="Casablanca, Maroc" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Téléphone</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.phone} onChange={handleCompanyFieldChange('phone')} placeholder="+212 5 22 00 00 00" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.email} onChange={handleCompanyFieldChange('email')} placeholder="contact@financecrm.ma" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">RC</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.rc} onChange={handleCompanyFieldChange('rc')} placeholder="123456" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">IF</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.if_} onChange={handleCompanyFieldChange('if_')} placeholder="A123456" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">ICE</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.ice} onChange={handleCompanyFieldChange('ice')} placeholder="123456789000012" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">RIB</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.rib} onChange={handleCompanyFieldChange('rib')} placeholder="123 456 7890 1234567890 12" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Banque</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={companyForm.bank} onChange={handleCompanyFieldChange('bank')} placeholder="Attijariwafa Bank — Agence Casa Centre" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => goToStep('client')} className="inline-flex items-center gap-2 bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl px-6 py-2.5 text-xs uppercase tracking-wider font-bold transition-all border border-[var(--c-border)]">
                  Suivant
                  <DollarSignIcon size={14} />
                </button>
              </div>
            </div>
          ) : step === 'client' ? (
            <div className="bg-[var(--c-elevated)] border border-[var(--c-border)] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-wider">Informations Client</h4>
                <span className="text-[10px] text-[var(--c-positive)]/70 font-medium bg-[var(--c-positive-bg)] px-2.5 py-1 rounded-full border border-[var(--c-positive-border)]">Étape 2/3</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Nom complet</label>
                <input required type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={clientInfo.name} onChange={handleClientChange('name')} placeholder="Nom du client" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={clientInfo.email} onChange={handleClientChange('email')} placeholder="client@email.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Téléphone</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={clientInfo.phone} onChange={handleClientChange('phone')} placeholder="+212 6 00 00 00 00" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Société</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={clientInfo.company} onChange={handleClientChange('company')} placeholder="Nom de la société" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Adresse</label>
                  <input type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={clientInfo.address} onChange={handleClientChange('address')} placeholder="Adresse" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('company')} className="flex-1 rounded-xl border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-4 py-2.5 text-xs font-semibold text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors">
                  Retour
                </button>
                <button type="button" onClick={() => setStep('devis')} className="flex-[2] inline-flex items-center justify-center gap-2 bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl px-6 py-2.5 text-xs uppercase tracking-wider font-bold transition-all border border-[var(--c-border)]">
                  Suivant
                  <DollarSignIcon size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--c-elevated)] border border-[var(--c-border)] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--c-text)] uppercase tracking-wider">Détails du Devis</h4>
                <span className="text-[10px] text-[var(--c-positive)]/70 font-medium bg-[var(--c-positive-bg)] px-2.5 py-1 rounded-full border border-[var(--c-positive-border)]">Étape 3/3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Référence</label>
                  <input required type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={devisInfo.reference} onChange={handleDevisChange('reference')} placeholder="DEV-2026-001" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Statut</label>
                  <select className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium appearance-none" value={devisInfo.status} onChange={handleDevisChange('status')}>
                    <option value="En attente" className="bg-gray-900 text-[var(--c-warning)]">En attente</option>
                    <option value="Accepté" className="bg-gray-900 text-[var(--c-positive)]">Accepté</option>
                    <option value="Refusé" className="bg-gray-900 text-[var(--c-danger)]">Refusé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Description</label>
                <textarea className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium resize-none" rows={3} value={devisInfo.description} onChange={handleDevisChange('description')} placeholder="Description des prestations..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">Montant HT</label>
                  <input type="number" step="0.01" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={devisInfo.amountHT} onChange={handleDevisChange('amountHT')} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-1.5">TVA</label>
                  <input type="number" step="0.01" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" value={devisInfo.tva} onChange={handleDevisChange('tva')} placeholder="0.00" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-[var(--c-surface)] rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--c-text-2)]">Total TTC</span>
                <span className="text-lg font-bold text-[var(--c-text)]">{totalTTC.toFixed(2)} MAD</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep('client')} className="flex-1 rounded-xl border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-4 py-2.5 text-xs font-semibold text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] transition-colors">
                  Retour
                </button>
                <button type="submit" className="flex-[2] bg-[var(--c-positive-bg)] hover:bg-[var(--c-positive-hover)] text-[var(--c-positive)] border border-[var(--c-positive-border)] text-xs uppercase tracking-wider font-bold py-2.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2">
                  <ClipboardIcon size={14} />
                  Installer Devis
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
        <div className="border-b border-[var(--c-border)] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[var(--c-text)]">Devis List</h3>
            <p className="text-xs text-[var(--c-text-3)] mt-1">{devisList.length} devis enregistrés.</p>
          </div>
        </div>

        {devisList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--c-elevated)] flex items-center justify-center mb-4">
              <ClipboardIcon size={28} className="text-[var(--c-placeholder)]" />
            </div>
            <p className="text-base font-semibold text-[var(--c-text-2)]">Aucun devis</p>
            <p className="mt-1 text-xs text-[var(--c-text-3)]">Créez un devis avec le formulaire ci-dessus.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--c-elevated)] text-[var(--c-text-3)] border-b border-[var(--c-border)]">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">Réf.</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--c-border)]">
                {devisList.map((devis) => (
                  <tr key={devis.id} className="hover:bg-[var(--c-elevated)] transition-colors group">
                    <td className="px-6 py-3 font-semibold text-[var(--c-text)]">{devis.reference}</td>
                    <td className="px-6 py-3 text-[var(--c-text-2)]">{devis.client?.name || '-'}</td>
                    <td className="px-6 py-3 text-[var(--c-text)] font-medium">{devis.totalTTC?.toFixed(2)} MAD</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(devis.status)}`}>
                        {devis.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[var(--c-text-2)]">{new Date(devis.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => onDeleteDevis(devis.id)} className="sm:opacity-0 sm:group-hover:opacity-100 rounded-lg border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] p-1.5 text-[var(--c-danger)] hover:bg-[var(--c-danger-hover)] transition-all">
                        <Trash2Icon size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
