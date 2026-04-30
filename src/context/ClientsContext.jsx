import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toClientId } from '../utils/clientId';
import { useUser } from './UserContext';
import { clientsApi } from '../api/clients';

const ClientsContext = createContext(null);

const createActivity = (title, description) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  title,
  description
});

const getClientIdValue = (client) => String(client?._id || client?.id || '').trim();

const normalizeInvoice = (invoice, clientRef) => {
  const fallbackClientName = typeof clientRef === 'string'
    ? clientRef
    : (clientRef?.name || clientRef?.company || '');
  const fallbackClientId = typeof clientRef === 'string' ? '' : getClientIdValue(clientRef);

  return {
    clientStatus: invoice.clientStatus || clientRef?.status || invoice.status || 'Solvable',
    id: invoice.id || `${Date.now()}`,
    clientId: invoice.clientId || fallbackClientId,
    clientName: invoice.clientName || fallbackClientName,
    amount: Number(invoice.amount ?? invoice.amountHT ?? 0),
    amountHT: Number(invoice.amountHT ?? invoice.amount ?? 0),
    status: invoice.status || invoice.paymentStatus || 'Pending',
    dueDate: invoice.dueDate || invoice.date || new Date().toISOString().slice(0, 10),
    reference: invoice.reference || invoice.id || `INV-${Date.now()}`,
    method: invoice.method || invoice.paymentMethod || 'Bank Transfer',
    date: invoice.date || new Date().toISOString().slice(0, 10)
  };
};

const initialClients = [
  {
    id: toClientId('Atlas Group'),
    name: 'Atlas Group',
    company: 'Atlas Group Holdings',
    status: 'Solvable',
    riskScore: 78,
    email: 'finance@atlasgroup.com',
    phone: '+212 6 12 34 56 78',
    address: '12 Avenue Hassan II, Casablanca',
    industry: 'Manufacturing',
    registrationDate: '2021-03-14',
    assignedManager: 'Nadia El Fassi',
    totalRevenue: 2450000,
    outstandingAmount: 184000,
    paidAmount: 2266000,
    delayDays: 12,
    notes: [
      { id: 'n1', author: 'Sara Benali', date: '2026-04-11', text: 'Client requested a revised payment schedule for Q2.' },
      { id: 'n2', author: 'Youssef Karim', date: '2026-04-19', text: 'Follow-up completed after late payment reminder.' }
    ],
    documents: [
      { id: 'd1', name: 'Contract-Atlas-2026.pdf', size: '1.2 MB' },
      { id: 'd2', name: 'KYC-Atlas-2026.pdf', size: '840 KB' }
    ],
    activities: [
      { id: 'a1', date: '2026-04-20', title: 'Invoice paid', description: 'Invoice #A-204 was settled in full.' },
      { id: 'a2', date: '2026-04-19', title: 'Payment reminder sent', description: 'Reminder email delivered to finance contact.' },
      { id: 'a3', date: '2026-04-12', title: 'New note added', description: 'Account manager added a collection note.' }
    ],
    payments: [
      { id: 'p1', date: '2026-04-20', reference: 'INV-204', method: 'Bank Transfer', amount: 84000, status: 'Paid' },
      { id: 'p2', date: '2026-04-10', reference: 'INV-198', method: 'Card', amount: 126000, status: 'Paid' },
      { id: 'p3', date: '2026-03-28', reference: 'INV-191', method: 'Bank Transfer', amount: 54000, status: 'Pending' }
    ]
  },
  {
    id: toClientId('Nova Retail'),
    name: 'Nova Retail',
    company: 'Nova Retail SARL',
    status: 'Fidèle',
    riskScore: 52,
    email: 'accounts@novaretail.com',
    phone: '+212 6 98 76 54 32',
    address: '45 Boulevard Mohammed V, Rabat',
    industry: 'Retail',
    registrationDate: '2020-09-02',
    assignedManager: 'Imane Ait',
    totalRevenue: 1310000,
    outstandingAmount: 97000,
    paidAmount: 1213000,
    delayDays: 21,
    notes: [
      { id: 'n1', author: 'Imane Ait', date: '2026-04-15', text: 'Recommended to keep monthly reconciliation cadence.' }
    ],
    documents: [
      { id: 'd1', name: 'Framework-Agreement.pdf', size: '2.1 MB' }
    ],
    activities: [
      { id: 'a1', date: '2026-04-18', title: 'Invoice created', description: 'Invoice #N-502 generated for April cycle.' },
      { id: 'a2', date: '2026-04-15', title: 'Agreement reviewed', description: 'Annual agreement was reviewed by legal.' }
    ],
    payments: [
      { id: 'p1', date: '2026-04-18', reference: 'INV-502', method: 'Wire Transfer', amount: 43000, status: 'Paid' },
      { id: 'p2', date: '2026-04-09', reference: 'INV-495', method: 'Cheque', amount: 54000, status: 'Paid' },
      { id: 'p3', date: '2026-03-29', reference: 'INV-488', method: 'Wire Transfer', amount: 22000, status: 'Pending' }
    ]
  },
  {
    id: toClientId('Orion Tech'),
    name: 'Orion Tech',
    company: 'Orion Tech Services',
    status: 'Insolvable',
    riskScore: 91,
    email: 'billing@oriontech.com',
    phone: '+212 6 11 22 33 44',
    address: '8 Rue Ibn Khaldoun, Tangier',
    industry: 'Technology',
    registrationDate: '2019-01-20',
    assignedManager: 'Omar Bennis',
    totalRevenue: 860000,
    outstandingAmount: 214000,
    paidAmount: 646000,
    delayDays: 48,
    notes: [
      { id: 'n1', author: 'Omar Bennis', date: '2026-04-08', text: 'Escalation recommended due to recurring overdue payments.' },
      { id: 'n2', author: 'Finance Team', date: '2026-04-03', text: 'Client asked for restructuring proposal.' }
    ],
    documents: [
      { id: 'd1', name: 'Recovery-Plan.docx', size: '280 KB' },
      { id: 'd2', name: 'KYC-Orion-2025.pdf', size: '950 KB' }
    ],
    activities: [
      { id: 'a1', date: '2026-04-21', title: 'Risk score updated', description: 'Risk profile worsened after 45-day delay.' },
      { id: 'a2', date: '2026-04-17', title: 'Collection call', description: 'Reminder call logged by account manager.' },
      { id: 'a3', date: '2026-04-10', title: 'Payment plan request', description: 'Client requested installment schedule.' }
    ],
    payments: [
      { id: 'p1', date: '2026-04-21', reference: 'INV-711', method: 'Bank Transfer', amount: 38000, status: 'Pending' },
      { id: 'p2', date: '2026-04-02', reference: 'INV-703', method: 'Cash', amount: 42000, status: 'Paid' },
      { id: 'p3', date: '2026-03-25', reference: 'INV-699', method: 'Bank Transfer', amount: 69000, status: 'Overdue' }
    ]
  },
  {
    id: toClientId('Cedar Logistics'),
    name: 'Cedar Logistics',
    company: 'Cedar Logistics Group',
    status: 'Solvable',
    riskScore: 34,
    email: 'ops@cedarlogistics.com',
    phone: '+212 6 77 88 99 00',
    address: '19 Port Street, Casablanca',
    industry: 'Transport',
    registrationDate: '2022-06-10',
    assignedManager: 'Salma Idrissi',
    totalRevenue: 725000,
    outstandingAmount: 38000,
    paidAmount: 687000,
    delayDays: 6,
    notes: [],
    documents: [],
    activities: [],
    payments: []
  }
];

const cloneClients = () => initialClients.map((client) => ({
  ...client,
  _id: client._id || client.id,
  notes: [...(client.notes || [])],
  documents: [...(client.documents || [])],
  activities: [...(client.activities || [])],
  payments: [...(client.payments || [])],
  invoices: [...(client.payments || []).map((invoice) => normalizeInvoice(invoice, client))]
}));

const normalizeClient = (client = {}) => {
  const name = client.name || client.company || 'New Client';
  const clientId = String(client._id || client.id || toClientId(name));
  const normalizedInvoices = (client.invoices && client.invoices.length > 0 ? client.invoices : client.payments || [])
    .map((invoice) => normalizeInvoice(invoice, { ...client, _id: clientId, name }));

  return {
    _id: clientId,
    id: client.id || clientId,
    name,
    company: client.company || name,
    status: client.status || 'Solvable',
    riskScore: Number(client.riskScore || 0),
    email: client.email || '',
    phone: client.phone || '',
    address: client.address || '',
    industry: client.industry || '',
    registrationDate: client.registrationDate || new Date().toISOString().slice(0, 10),
    assignedManager: client.assignedManager || '',
    totalRevenue: Number(client.totalRevenue || 0),
    outstandingAmount: Number(client.outstandingAmount || 0),
    paidAmount: Number(client.paidAmount || 0),
    delayDays: Number(client.delayDays || 0),
    notes: [...(client.notes || [])],
    documents: [...(client.documents || [])],
    activities: [...(client.activities || [])],
    invoices: normalizedInvoices,
    payments: normalizedInvoices
  };
};

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const resolveClientRecord = (clients, clientInput) => {
  const normalizedInput = normalizeKey(clientInput?._id || clientInput?.id || clientInput?.clientId || clientInput?.clientName || clientInput?.name || clientInput);

  return clients.find((client) => {
    const clientId = normalizeKey(getClientIdValue(client));
    const clientName = normalizeKey(client.name);
    return clientId === normalizedInput || clientName === normalizedInput || toClientId(client.name) === normalizedInput;
  }) || null;
};

export function ClientsProvider({ children }) {
  const { currentUser, token } = useUser();
  const [clients, setClients] = useState(() => cloneClients());
  const [invoices, setInvoices] = useState([]);

  const loadClientsFromApi = useCallback(async (authToken) => {
    if (!authToken) {
      return null;
    }

    try {
      const payload = await clientsApi.list(authToken);
      if (Array.isArray(payload)) {
        setClients(payload.map((client) => normalizeClient(client)));
        return payload;
      }
    } catch (error) {
      console.error('Failed to load clients from API, using local seed data.', error);
    }

    return null;
  }, []);

  useEffect(() => {
    if (!currentUser?.email || typeof window === 'undefined') {
      window.setTimeout(() => setInvoices([]), 0);
      return;
    }

    const saved = localStorage.getItem(`finance_crm_data_${currentUser.email}`);
    window.setTimeout(() => setInvoices(saved ? JSON.parse(saved) : []), 0);
  }, [currentUser?.email]);

  useEffect(() => {
    if (!token) {
      window.setTimeout(() => setClients(cloneClients()), 0);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadClientsFromApi(token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadClientsFromApi, token]);

  const clientsWithInvoices = useMemo(() => {
    return clients.map((client) => {
      const linkedInvoices = invoices.filter((invoice) => {
        const invoiceClientId = String(invoice.clientId || '').trim().toLowerCase();
        const invoiceClientName = String(invoice.clientName || '').trim().toLowerCase();
        const clientId = getClientIdValue(client).toLowerCase();
        const clientName = String(client.name || '').trim().toLowerCase();
        return invoiceClientId === clientId || invoiceClientName === clientName || toClientId(invoice.clientName) === clientId;
      });

      const fallbackInvoices = (client.invoices && client.invoices.length > 0 ? client.invoices : client.payments || []).map((invoice) => normalizeInvoice(invoice, client));
      const resolvedInvoices = linkedInvoices.length > 0 ? linkedInvoices.map((invoice) => normalizeInvoice(invoice, client)) : fallbackInvoices;

      return {
        ...client,
        invoices: resolvedInvoices,
        payments: resolvedInvoices
      };
    });
  }, [clients, invoices]);

  const replaceClient = (updatedClient) => {
    const normalized = normalizeClient(updatedClient);
    setClients((current) => {
      const normalizedClientId = getClientIdValue(normalized);
      const existingIndex = current.findIndex((client) => getClientIdValue(client) === normalizedClientId);

      if (existingIndex === -1) {
        return [...current, normalized];
      }

      return current.map((client) => (getClientIdValue(client) === normalizedClientId ? normalized : client));
    });
  };

  const addClient = (client) => {
    const optimisticClient = normalizeClient({
      ...client,
      _id: client._id || client.id || toClientId(client.name || client.company || `client-${Date.now()}`)
    });

    setClients((current) => [...current, optimisticClient]);

    void (async () => {
      try {
        const createdClient = await clientsApi.create(optimisticClient, token);
        replaceClient(createdClient);
        void loadClientsFromApi(token);
      } catch (error) {
        console.error('Failed to persist client creation.', error);
      }
    })();

    return optimisticClient._id;
  };

  const updateClient = (clientId, updates) => {
    setClients((current) => current.map((client) => {
      if (getClientIdValue(client) !== String(clientId)) return client;
      const hasMeaningfulUpdates = Object.keys(updates || {}).length > 0;
      return {
        ...client,
        ...updates,
        invoices: updates.invoices ? updates.invoices.map((invoice) => normalizeInvoice(invoice, client)) : client.invoices,
        payments: updates.invoices ? updates.invoices.map((invoice) => normalizeInvoice(invoice, client)) : client.payments,
        activities: hasMeaningfulUpdates
          ? [createActivity('Client edited', `Profile updated for ${updates.name || client.name}`), ...(client.activities || [])]
          : client.activities
      };
    }));

    void (async () => {
      try {
        const updatedClient = await clientsApi.update(clientId, updates, token);
        replaceClient(updatedClient);
        void loadClientsFromApi(token);
      } catch (error) {
        console.error('Failed to persist client update.', error);
      }
    })();
  };

  const deleteClient = (clientId) => {
    setClients((current) => current.filter((client) => getClientIdValue(client) !== String(clientId)));

    void (async () => {
      try {
        await clientsApi.remove(clientId, token);
        void loadClientsFromApi(token);
      } catch (error) {
        console.error('Failed to persist client deletion.', error);
      }
    })();
  };

  const addNote = (clientId, note) => {
    const noteEntry = typeof note === 'string'
      ? {
          id: Date.now().toString(),
          author: 'Current User',
          date: new Date().toISOString(),
          content: note,
          text: note
        }
      : {
          id: note.id || Date.now().toString(),
          author: note.author || 'Current User',
          date: note.date || new Date().toISOString(),
          content: note.content || note.text || '',
          text: note.text || note.content || ''
        };

    setClients((current) => current.map((client) => {
      if (getClientIdValue(client) !== String(clientId)) return client;
      const activity = createActivity('Note added', noteEntry.content || noteEntry.text || 'New note added');
      return {
        ...client,
        notes: [noteEntry, ...(client.notes || [])],
        activities: [activity, ...(client.activities || [])]
      };
    }));

    void (async () => {
      try {
        const updatedClient = await clientsApi.addNote(clientId, noteEntry, token);
        replaceClient(updatedClient);
        void loadClientsFromApi(token);
      } catch (error) {
        console.error('Failed to persist note.', error);
      }
    })();
  };

  const addDocument = (clientId, document) => {
    const documentEntry = {
      id: document.id || `${Date.now()}`,
      name: document.name || 'Uploaded document',
      uploadDate: document.uploadDate || new Date().toISOString(),
      size: document.size || ''
    };

    setClients((current) => current.map((client) => {
      if (getClientIdValue(client) !== String(clientId)) return client;
      const activity = createActivity('Document uploaded', documentEntry.name);
      return {
        ...client,
        documents: [documentEntry, ...(client.documents || [])],
        activities: [activity, ...(client.activities || [])]
      };
    }));

    void (async () => {
      try {
        const updatedClient = await clientsApi.addDocument(clientId, documentEntry, token);
        replaceClient(updatedClient);
        void loadClientsFromApi(token);
      } catch (error) {
        console.error('Failed to persist document.', error);
      }
    })();
  };

    const updateNote = (clientId, noteId, updates) => {
      setClients((current) => current.map((client) => {
        if (getClientIdValue(client) !== String(clientId)) return client;
        return {
          ...client,
          notes: (client.notes || []).map((note) => (String(note.id) === String(noteId) ? { ...note, ...updates } : note)),
          activities: [createActivity('Note updated', updates.content || updates.text || 'Note edited'), ...(client.activities || [])]
        };
      }));

      void (async () => {
        try {
          const updatedClient = await clientsApi.updateNote(clientId, noteId, updates, token);
          replaceClient(updatedClient);
          void loadClientsFromApi(token);
        } catch (error) {
          console.error('Failed to persist note update.', error);
        }
      })();
    };

    const deleteNote = (clientId, noteId) => {
      setClients((current) => current.map((client) => {
        if (getClientIdValue(client) !== String(clientId)) return client;
        return {
          ...client,
          notes: (client.notes || []).filter((note) => String(note.id) !== String(noteId)),
          activities: [createActivity('Note deleted', 'A note was removed'), ...(client.activities || [])]
        };
      }));

      void (async () => {
        try {
          const updatedClient = await clientsApi.deleteNote(clientId, noteId, token);
          replaceClient(updatedClient);
          void loadClientsFromApi(token);
        } catch (error) {
          console.error('Failed to persist note deletion.', error);
        }
      })();
    };

    const updateActivity = (clientId, activityId, updates) => {
      setClients((current) => current.map((client) => {
        if (getClientIdValue(client) !== String(clientId)) return client;
        return {
          ...client,
          activities: (client.activities || []).map((activity) => (String(activity.id) === String(activityId) ? { ...activity, ...updates } : activity))
        };
      }));

      void (async () => {
        try {
          const updatedClient = await clientsApi.updateActivity(clientId, activityId, updates, token);
          replaceClient(updatedClient);
          void loadClientsFromApi(token);
        } catch (error) {
          console.error('Failed to persist activity update.', error);
        }
      })();
    };

    const deleteActivity = (clientId, activityId) => {
      setClients((current) => current.map((client) => {
        if (getClientIdValue(client) !== String(clientId)) return client;
        return {
          ...client,
          activities: (client.activities || []).filter((activity) => String(activity.id) !== String(activityId))
        };
      }));

      void (async () => {
        try {
          const updatedClient = await clientsApi.deleteActivity(clientId, activityId, token);
          replaceClient(updatedClient);
          void loadClientsFromApi(token);
        } catch (error) {
          console.error('Failed to persist activity deletion.', error);
        }
      })();
    };

  const createInvoice = (invoice) => {
    const clientRecord = resolveClientRecord(clients, invoice);
    const clientName = String(invoice.clientName || invoice.clientId || clientRecord?.name || '').trim();
    const clientId = String(invoice.clientId || getClientIdValue(clientRecord) || toClientId(clientName)).trim();

    if (!clientName) {
      return Promise.reject(new Error('Client name is required to create an invoice.'));
    }

    const invoicePayload = {
      ...invoice,
      id: invoice.id || `${Date.now()}`,
      clientId: clientId || toClientId(clientName),
      clientName,
      amount: Number(invoice.amount ?? invoice.amountHT ?? 0),
      amountHT: Number(invoice.amountHT ?? invoice.amount ?? 0),
      tva: Number(invoice.tva ?? 0),
      totalTTC: Number(invoice.totalTTC ?? ((Number(invoice.amountHT ?? invoice.amount ?? 0)) + Number(invoice.tva ?? 0))),
      paymentDelay: Number(invoice.paymentDelay ?? 0),
      status: invoice.status || invoice.paymentStatus || 'Pending',
      paymentStatus: invoice.paymentStatus || invoice.status || 'Pending',
      dueDate: invoice.dueDate || '',
      reference: invoice.reference || invoice.invoiceNumber || `INV-${Date.now()}`,
      method: invoice.method || invoice.paymentMethod || 'Bank Transfer',
      date: invoice.date || new Date().toISOString().slice(0, 10),
      flags: Array.isArray(invoice.flags) ? invoice.flags : []
    };

    return clientsApi.createInvoice(clientId || toClientId(clientName), invoicePayload, token)
      .then((createdClient) => {
        replaceClient(createdClient);
        void loadClientsFromApi(token);

        const normalizedCreatedInvoices = (createdClient.invoices || []).map((entry) => normalizeInvoice(entry, createdClient.name));
        setInvoices((current) => {
          const otherInvoices = current.filter((entry) => String(entry.clientId || '').trim().toLowerCase() !== String(clientId).trim().toLowerCase());
          return [...normalizedCreatedInvoices, ...otherInvoices];
        });

        return createdClient;
      })
      .catch((error) => {
        console.error('Failed to persist invoice creation.', error);
        throw error;
      });
  };

  const updateClientInvoice = (clientId, invoiceId, updates) => {
    const normalizedUpdates = {
      ...updates,
      status: updates.status || updates.paymentStatus,
      dueDate: updates.dueDate,
      amount: updates.amount ?? updates.amountHT,
      method: updates.method || updates.paymentMethod
    };

    setClients((current) => current.map((client) => {
      if (getClientIdValue(client) !== String(clientId)) return client;
      const nextInvoices = (client.invoices || []).map((invoice) => {
        if (String(invoice.id) !== String(invoiceId)) return invoice;
        return normalizeInvoice({ ...invoice, ...normalizedUpdates }, client);
      });
      const activity = createActivity('Invoice updated', `Invoice ${invoiceId} status changed to ${normalizedUpdates.status || 'Updated'}`);
      return {
        ...client,
        invoices: nextInvoices,
        payments: nextInvoices,
        activities: [activity, ...(client.activities || [])]
      };
    }));

    setInvoices((current) => current.map((invoice) => {
      if (String(invoice.id) !== String(invoiceId)) return invoice;
      return {
        ...invoice,
        ...updates,
        status: updates.status || updates.paymentStatus || invoice.status,
        paymentStatus: updates.paymentStatus || updates.status || invoice.paymentStatus,
        dueDate: updates.dueDate || invoice.dueDate,
        amount: updates.amount ?? updates.amountHT ?? invoice.amount,
        amountHT: updates.amountHT ?? updates.amount ?? invoice.amountHT,
        method: updates.method || updates.paymentMethod || invoice.method,
        paymentMethod: updates.paymentMethod || updates.method || invoice.paymentMethod
      };
    }));

    void (async () => {
      try {
        const updatedClient = await clientsApi.updateInvoice(clientId, invoiceId, updates, token);
        replaceClient(updatedClient);
      } catch (error) {
        console.error('Failed to persist invoice update.', error);
      }
    })();
  };

  const value = {
    clients: clientsWithInvoices,
    clientMap: clientsWithInvoices.reduce((acc, client) => {
      acc[getClientIdValue(client)] = client;
      return acc;
    }, {}),
    invoices,
    setInvoices,
    addClient,
    createInvoice,
    updateClient,
    deleteClient,
    addNote,
    addDocument,
    updateNote,
    deleteNote,
    updateActivity,
    deleteActivity,
    updateClientInvoice,
    refreshClients: loadClientsFromApi,
    getClientById: (clientId) => clientsWithInvoices.find((client) => getClientIdValue(client) === String(clientId)) || null
  };

  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
}
