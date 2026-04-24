const Client = require('../models/Client');

const buildActivity = (title, description) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  title,
  description
});

exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      activities: [buildActivity('Client created', `Client ${req.body.name || req.body.company || 'New Client'} was created`), ...(req.body.activities || [])]
    };
    const client = await Client.create(payload);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    Object.assign(client, req.body);
    client.activities = [buildActivity('Client edited', `Client ${client.name} was updated`), ...(client.activities || [])];
    await client.save();
    res.json(client);
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const deleted = await Client.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.addNote = async (req, res, next) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
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
  } catch (error) {
    next(error);
  }
};

exports.addDocument = async (req, res, next) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
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
  } catch (error) {
    next(error);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
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
        method: req.body.method || req.body.paymentMethod || invoice.method,
        paymentStatus: req.body.paymentStatus || req.body.status || invoice.paymentStatus
      };
    });

    client.activities = [buildActivity('Invoice updated', `Invoice ${invoiceId} was updated`), ...(client.activities || [])];
    await client.save();
    res.json(client);
  } catch (error) {
    next(error);
  }
};
