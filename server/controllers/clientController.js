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

const buildActivity = (title, description) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  title,
  description
});

const isObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || '').trim());

const findClientById = async (id) => {
  const normalizedId = normalizeText(id);
  if (!normalizedId) return null;

  if (isObjectId(normalizedId)) {
    const clientByObjectId = await Client.findById(normalizedId);
    if (clientByObjectId) return clientByObjectId;
  }

  const key = normalizeKey(normalizedId);
  return Client.findOne({
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

exports.getClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  res.json(clients);
});

exports.getClientById = asyncHandler(async (req, res, next) => {
  const client = await findClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  res.json(client);
});

exports.createClient = asyncHandler(async (req, res, next) => {
  const payload = {
    ...req.body,
    activities: [buildActivity('Client created', `Client ${req.body.name || req.body.company || 'New Client'} was created`), ...(req.body.activities || [])]
  };
  const client = await Client.create(payload);
  res.status(201).json(client);
});

exports.updateClient = asyncHandler(async (req, res, next) => {
  const client = await findClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  Object.assign(client, req.body);
  client.activities = [buildActivity('Client edited', `Client ${client.name} was updated`), ...(client.activities || [])];
  await client.save();
  res.json(client);
});

exports.deleteClient = asyncHandler(async (req, res, next) => {
  const deleted = await findClientById(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Client not found' });
  }
  await Client.deleteOne({ _id: deleted._id });
  res.json({ message: 'Client deleted successfully' });
});

exports.addNote = asyncHandler(async (req, res, next) => {
  const client = await findClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
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

exports.addDocument = asyncHandler(async (req, res, next) => {
  const client = await findClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
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

exports.createInvoice = asyncHandler(async (req, res, next) => {
  let client = await findClientById(req.params.id) || await findClientById(req.body.clientId) || await findClientById(req.body.clientName);

  if (!client) {
    const clientName = normalizeText(req.body.clientName || req.params.id);
    if (!clientName) {
      return res.status(400).json({ message: 'Client name is required to create the invoice' });
    }

    client = await Client.create(buildClientFromInvoice({ ...req.body, clientName, clientId: req.body.clientId || req.params.id }));
  }

  const invoice = buildInvoice(client, req.body || {});

  client.invoices = [invoice, ...(client.invoices || [])];
  client.activities = [buildActivity('Invoice created', `Invoice ${invoice.reference} was created`), ...(client.activities || [])];
  await client.save();
  res.status(201).json(client);
});

exports.updateInvoice = asyncHandler(async (req, res, next) => {
  const client = await findClientById(req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
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
  await client.save();
  res.json(client);
});
