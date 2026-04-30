const Client = require('../models/Client');
const asyncHandler = require('../utils/asyncHandler');

const normalizeText = (value) => String(value || '').trim();
const normalizeKey = (value) => normalizeText(value).toLowerCase();
const escapeRegExp = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toClientId = (value) => normalizeText(value)
  .toLowerCase()
  .replace(/["']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// ✅ NEW: Helper to extract userId from JWT (set by authMiddleware)
const getUserId = (req) => req.user?.sub;

// ✅ NEW: Helper to ensure user owns the client (authorization check)
const verifyClientOwnership = async (clientId, userId) => {
  return await Client.findOne({ _id: clientId, userId });
};

const buildActivity = (title, description) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  title,
  description
});

const isObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || '').trim());

const findClientById = async (id, userId) => {
  const normalizedId = normalizeText(id);
  if (!normalizedId) return null;

  // ✅ CRITICAL: Filter by userId to ensure ownership
  const filter = { userId }; // Security: Only search within user's clients

  if (isObjectId(normalizedId)) {
    const clientByObjectId = await Client.findOne({
      ...filter,
      _id: normalizedId
    });
    if (clientByObjectId) return clientByObjectId;
  }

  const key = normalizeKey(normalizedId);
  return Client.findOne({
    ...filter,
    $or: [
      { id: normalizedId },
      { id: key },
      { id: toClientId(normalizedId) },
      { name: normalizedId },
      { name: new RegExp(`^${escapeRegExp(normalizedId)}$`, 'i') }
    ]
  });
};

const buildClientFromInvoice = (payload) => {
  const clientName = normalizeText(payload.clientName || payload.clientId || 'New Client');
  const clientId = normalizeText(payload.clientId || toClientId(clientName));

  return {
    id: clientId || toClientId(clientName),
    name: clientName,
    company: payload.company || clientName,
    status: payload.clientStatus || payload.status || 'Solvable',
    riskScore: Number(payload.riskScore || 0),
    email: payload.email || '',
    phone: payload.phone || '',
    address: payload.address || '',
    industry: payload.industry || '',
    registrationDate: payload.registrationDate || new Date().toISOString().slice(0, 10),
    assignedManager: payload.assignedManager || '',
    totalRevenue: 0,
    outstandingAmount: 0,
    paidAmount: 0,
    delayDays: 0,
    notes: [],
    documents: [],
    invoices: [],
    activities: [buildActivity('Client created', `Client ${clientName} was created from an invoice`)]
  };
};

const buildInvoice = (client, payload) => {
  const invoiceId = payload.id || `${Date.now()}`;
  return {
    id: invoiceId,
    clientId: String(client._id),
    clientName: client.name,
    clientStatus: payload.clientStatus || client.status || 'Solvable',
    amount: Number(payload.amount ?? payload.amountHT ?? 0),
    amountHT: Number(payload.amountHT ?? payload.amount ?? 0),
    tva: Number(payload.tva ?? 0),
    totalTTC: Number(payload.totalTTC ?? ((Number(payload.amountHT ?? payload.amount ?? 0)) + Number(payload.tva ?? 0))),
    paymentDelay: Number(payload.paymentDelay ?? 0),
    status: payload.status || payload.paymentStatus || 'Pending',
    paymentStatus: payload.paymentStatus || payload.status || 'Pending',
    dueDate: payload.dueDate || '',
    reference: payload.reference || payload.invoiceNumber || `INV-${invoiceId}`,
    method: payload.method || payload.paymentMethod || 'Bank Transfer',
    date: payload.date || new Date().toISOString().slice(0, 10),
    flags: Array.isArray(payload.flags) ? payload.flags : []
  };
};

const recalculateClientTotals = (client) => {
  let totalRev = 0;
  let outstanding = 0;
  let paid = 0;

  (client.invoices || []).forEach(inv => {
    const val = Number(inv.totalTTC ?? inv.amount ?? inv.amountHT ?? 0);
    totalRev += val;
    if (String(inv.paymentStatus || inv.status).toLowerCase() === 'paid') {
      paid += val;
    } else {
      outstanding += val;
    }
  });

  client.totalRevenue = totalRev;
  client.outstandingAmount = outstanding;
  client.paidAmount = paid;
};

// ✅ FIXED: Filter by userId - only return user's clients
exports.getClients = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  // ✅ CRITICAL: Filter by userId
  const clients = await Client.find({ userId }).sort({ createdAt: -1 });
  res.json(clients);
});

// ✅ FIXED: Filter by userId - verify ownership before returning client
exports.getClientById = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await findClientById(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  res.json(client);
});

// ✅ FIXED: Auto-assign userId when creating client
exports.createClient = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const payload = {
    ...req.body,
    userId, // ✅ Auto-assign userId from authenticated request
    activities: [buildActivity('Client created', `Client ${req.body.name || req.body.company || 'New Client'} was created`), ...(req.body.activities || [])]
  };
  const client = await Client.create(payload);
  res.status(201).json(client);
});

// ✅ FIXED: Verify ownership before updating
exports.updateClient = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  // ✅ CRITICAL: Verify client belongs to this user
  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found or access denied' });
  }

  Object.assign(client, req.body);
  client.activities = [buildActivity('Client edited', `Client ${client.name} was updated`), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

// ✅ FIXED: Verify ownership before deleting
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  // ✅ CRITICAL: Verify ownership before deletion
  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found or access denied' });
  }

  await Client.deleteOne({ _id: client._id, userId });
  res.json({ message: 'Client deleted successfully' });
});

// ✅ FIXED: Verify ownership before adding note
exports.addNote = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found or access denied' });
  }

  const note = {
    id: req.body.id || `${Date.now()}`,
    author: req.body.author || 'Current User',
    date: req.body.date || new Date().toISOString(),
    content: req.body.content || req.body.text || '',
    text: req.body.text || req.body.content || ''
  };

  client.notes = [note, ...client.notes];
  client.activities = [buildActivity('Note added', note.content || note.text), ...(client.activities || [])];
  await client.save();
  res.status(201).json(client);
});

// ✅ FIXED: Verify ownership before adding document
exports.addDocument = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found or access denied' });
  }

  const document = {
    id: req.body.id || `${Date.now()}`,
    name: req.body.name || 'Uploaded document',
    uploadDate: req.body.uploadDate || new Date().toISOString(),
    size: req.body.size || ''
  };

  client.documents = [document, ...client.documents];
  client.activities = [buildActivity('Document uploaded', document.name), ...(client.activities || [])];
  await client.save();
  res.status(201).json(client);
});

// ✅ FIXED: Verify ownership before updating note
exports.updateNote = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) return res.status(404).json({ message: 'Client not found or access denied' });

  const noteId = req.params.noteId;
  const idx = (client.notes || []).findIndex((n) => String(n.id) === String(noteId));
  if (idx === -1) return res.status(404).json({ message: 'Note not found' });

  const note = client.notes[idx];
  note.content = req.body.content ?? req.body.text ?? note.content;
  note.text = req.body.text ?? req.body.content ?? note.text;
  note.author = req.body.author ?? note.author;
  note.date = req.body.date ?? note.date;

  client.activities = [buildActivity('Note updated', note.content || note.text), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

// ✅ FIXED: Verify ownership before deleting note
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) return res.status(404).json({ message: 'Client not found or access denied' });

  const noteId = req.params.noteId;
  const initialLength = (client.notes || []).length;
  client.notes = (client.notes || []).filter((n) => String(n.id) !== String(noteId));
  if (client.notes.length === initialLength) return res.status(404).json({ message: 'Note not found' });

  client.activities = [buildActivity('Note deleted', `A note was removed`), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

// ✅ FIXED: Verify ownership before updating activity
exports.updateActivity = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) return res.status(404).json({ message: 'Client not found or access denied' });

  const activityId = req.params.activityId;
  const idx = (client.activities || []).findIndex((a) => String(a.id) === String(activityId));
  if (idx === -1) return res.status(404).json({ message: 'Activity not found' });

  const activity = client.activities[idx];
  activity.title = req.body.title ?? activity.title;
  activity.description = req.body.description ?? activity.description;
  activity.date = req.body.date ?? activity.date;

  client.activities = [buildActivity('Activity updated', activity.title), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

// ✅ FIXED: Verify ownership before deleting activity
exports.deleteActivity = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) return res.status(404).json({ message: 'Client not found or access denied' });

  const activityId = req.params.activityId;
  const initialLength = (client.activities || []).length;
  client.activities = (client.activities || []).filter((a) => String(a.id) !== String(activityId));
  if (client.activities.length === initialLength) return res.status(404).json({ message: 'Activity not found' });

  client.activities = [buildActivity('Activity deleted', `An activity was removed`), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

// ✅ FIXED: Verify ownership before creating invoice
exports.createInvoice = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  // ✅ CRITICAL: Find client ONLY within user's clients
  let client = await findClientById(req.params.id, userId) || await findClientById(req.body.clientId, userId) || await findClientById(req.body.clientName, userId);

  if (!client) {
    const clientName = normalizeText(req.body.clientName || req.params.id);
    if (!clientName) {
      return res.status(400).json({ message: 'Client name is required to create the invoice' });
    }

    // ✅ NEW: Auto-assign userId when creating new client
    client = await Client.create({
      ...buildClientFromInvoice({ ...req.body, clientName, clientId: req.body.clientId || req.params.id }),
      userId // ✅ Set userId for new client
    });
  }

  const invoice = buildInvoice(client, req.body || {});

  client.invoices = [invoice, ...(client.invoices || [])];
  client.activities = [buildActivity('Invoice created', `Invoice ${invoice.reference} was created`), ...(client.activities || [])];
  recalculateClientTotals(client);
  await client.save();
  res.status(201).json(client);
});

// ✅ FIXED: Verify ownership before updating invoice
exports.updateInvoice = asyncHandler(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  // ✅ CRITICAL: Verify client belongs to user
  const client = await verifyClientOwnership(req.params.id, userId);
  if (!client) {
    return res.status(404).json({ message: 'Client not found or access denied' });
  }

  const invoiceId = req.params.invoiceId;
  client.invoices = (client.invoices || []).map((invoice) => {
    if (String(invoice.id) !== String(invoiceId)) return invoice;
    return {
      ...invoice.toObject?.() || invoice,
      ...req.body,
      status: req.body.status || req.body.paymentStatus || invoice.status,
      amount: req.body.amount ?? req.body.amountHT ?? invoice.amount,
      amountHT: req.body.amountHT ?? req.body.amount ?? invoice.amountHT,
      tva: req.body.tva ?? invoice.tva,
      totalTTC: req.body.totalTTC ?? invoice.totalTTC,
      paymentDelay: req.body.paymentDelay ?? invoice.paymentDelay,
      method: req.body.method || req.body.paymentMethod || invoice.method,
      paymentStatus: req.body.paymentStatus || req.body.status || invoice.paymentStatus,
      flags: Array.isArray(req.body.flags) ? req.body.flags : invoice.flags
    };
  });

  client.activities = [buildActivity('Invoice updated', `Invoice ${invoiceId} was updated`), ...(client.activities || [])];
  recalculateClientTotals(client);
  await client.save();
  res.json(client);
});
