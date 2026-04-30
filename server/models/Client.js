const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    author: { type: String, default: 'Current User' },
    date: { type: String, default: () => new Date().toISOString() },
    content: { type: String, default: '' },
    text: { type: String, default: '' }
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    uploadDate: { type: String, default: () => new Date().toISOString() },
    size: { type: String, default: '' }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    amount: { type: Number, default: 0 },
    amountHT: { type: Number, default: 0 },
    tva: { type: Number, default: 0 },
    clientStatus: { type: String, default: 'Solvable' },
    totalTTC: { type: Number, default: 0 },
    paymentDelay: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' },
    paymentStatus: { type: String, default: 'Pending' },
    dueDate: { type: String, default: '' },
    reference: { type: String, default: '' },
    method: { type: String, default: 'Bank Transfer' },
    date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    flags: { type: [String], default: [] }
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
    title: { type: String, required: true },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    // ✅ NEW: Add userId field to link client to owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Important: Index for fast filtering by userId
    },

    id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    company: { type: String, default: '' },
    status: { type: String, default: 'Solvable' },
    riskScore: { type: Number, default: 0 },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    industry: { type: String, default: '' },
    registrationDate: { type: String, default: '' },
    assignedManager: { type: String, default: '' },
    totalRevenue: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    delayDays: { type: Number, default: 0 },
    notes: { type: [noteSchema], default: [] },
    documents: { type: [documentSchema], default: [] },
    invoices: { type: [invoiceSchema], default: [] },
    activities: { type: [activitySchema], default: [] }
  },
  { timestamps: true }
);

// ✅ IMPORTANT: Compound unique index to prevent duplicate client IDs per user
clientSchema.index({ userId: 1, id: 1 }, { unique: true });
clientSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Client', clientSchema);
