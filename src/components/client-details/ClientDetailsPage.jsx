import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ClientHeader from './ClientHeader';
import GeneralInfoCard from './GeneralInfoCard';
import FinancialOverview from './FinancialOverview';
import PaymentHistoryTable from './PaymentHistoryTable';
import NotesSection from './NotesSection';
import DocumentsSection from './DocumentsSection';
import ActivityTimeline from './ActivityTimeline';
import { useUser } from '../../context/UserContext';
import { hasPermission } from '../../utils/permissions';
import { useClients } from '../../context/ClientsContext';

export default function ClientDetailsPage({ clientId, onBack }) {
  const { id } = useParams();
  const resolvedClientId = String(id || clientId || '');
  const { role, currentUser } = useUser();
  const { clients, updateClient, deleteClient, addNote, addDocument, updateClientInvoice } = useClients();
  const client = useMemo(() => {
    const normalizedRouteId = String(resolvedClientId).trim().toLowerCase();
    const match = clients.find((entry) => String(entry.id || '').trim().toLowerCase() === normalizedRouteId || String(entry.name || '').trim().toLowerCase() === normalizedRouteId) || null;

    console.log('ClientDetailsPage debug', {
      id: resolvedClientId,
      clientsLength: clients.length,
      matchedClientId: match?.id || null
    });

    return match;
  }, [resolvedClientId, clients]);
  const canEditClient = hasPermission(role, 'edit_client');
  const canDeleteClient = hasPermission(role, 'delete_client');
  const canAddNotes = hasPermission(role, 'add_notes');
  const canUploadDocuments = hasPermission(role, 'upload_documents');

  if (!client) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
        <p className="text-base font-semibold text-slate-900">Client unavailable</p>
        <p className="mt-1 text-sm text-slate-600">We could not load this client profile. Please return to the dashboard and try again.</p>
        <button
          type="button"
          onClick={() => onBack?.()}
          className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleEditClient = () => {
    updateClient(client.id, {
      riskScore: Math.max(0, Math.min(100, Number(client.riskScore || 0) - 1)),
      delayDays: Number(client.delayDays || 0) + 1
    });
  };

  const handleAddNote = (content) => {
    addNote(client.id, {
      id: `${Date.now()}`,
      content,
      date: new Date().toISOString(),
      author: currentUser?.name || currentUser?.fullName || 'Current User'
    });
  };

  const handleUploadDocument = (document) => {
    addDocument(client.id, document);
  };

  const handleInvoiceStatusChange = (invoiceId, updates) => {
    updateClientInvoice(client.id, invoiceId, updates);
  };

  const handleDeleteClient = () => {
    deleteClient(client.id);
    onBack?.();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ClientHeader
        client={client}
        onBack={onBack}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
        canEdit={canEditClient}
        canDelete={canDeleteClient}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <GeneralInfoCard client={client} />
        <FinancialOverview client={client} />
      </div>

      <PaymentHistoryTable payments={client.invoices || client.payments || []} onStatusChange={handleInvoiceStatusChange} />

      <div className="grid gap-6 xl:grid-cols-2">
        <NotesSection notes={client.notes || []} onAdd={handleAddNote} canAdd={canAddNotes} />
        <DocumentsSection documents={client.documents || []} canUpload={canUploadDocuments} onUpload={handleUploadDocument} />
      </div>

      <ActivityTimeline activities={client.activities || []} />
    </div>
  );
}
