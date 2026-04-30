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
  const { role } = useUser();
  const { clients, updateClient, deleteClient, addDocument, updateClientInvoice } = useClients();
  const client = useMemo(() => {
    const normalizedRouteId = String(resolvedClientId).trim().toLowerCase();
    const match = clients.find((entry) => String(entry._id || '').trim().toLowerCase() === normalizedRouteId) || null;

    console.log('ClientDetailsPage debug', {
      id: resolvedClientId,
      clientsLength: clients.length,
      matchedClientId: match?._id || null
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
    updateClient(client._id, {
      riskScore: Math.max(0, Math.min(100, Number(client.riskScore || 0) - 1)),
      delayDays: Number(client.delayDays || 0) + 1
    });
  };

  const handleUploadDocument = (document) => {
    addDocument(client._id, document);
  };

  const handleInvoiceStatusChange = (invoiceId, updates) => {
    updateClientInvoice(client._id, invoiceId, updates);
  };

  const handleDeleteClient = () => {
    deleteClient(client._id);
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

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-medium text-slate-600">
            Use the edit and delete actions below to manage this client record. Activity Timeline is read-only.
          </p>
          <div className="flex flex-wrap gap-2">
            {canEditClient && (
              <button
                type="button"
                onClick={handleEditClient}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Edit Client
              </button>
            )}
            {canDeleteClient && (
              <button
                type="button"
                onClick={handleDeleteClient}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                Delete Client
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <GeneralInfoCard client={client} />
        <FinancialOverview client={client} />
      </div>

      <PaymentHistoryTable payments={client.invoices || client.payments || []} onStatusChange={handleInvoiceStatusChange} />

      <div className="grid gap-6 xl:grid-cols-2">
        <NotesSection clientId={client._id} notes={client.notes || []} canAdd={canAddNotes} />
        <DocumentsSection documents={client.documents || []} canUpload={canUploadDocuments} onUpload={handleUploadDocument} />
      </div>

      <ActivityTimeline clientId={client._id} activities={client.activities || []} />
    </div>
  );
}
