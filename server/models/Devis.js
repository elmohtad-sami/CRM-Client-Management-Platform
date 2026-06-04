const mongoose = require('mongoose');

const devisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  id: { type: String, required: true },
  client: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  reference: { type: String, default: '' },
  description: { type: String, default: '' },
  amountHT: { type: Number, default: 0 },
  tva: { type: Number, default: 0 },
  totalTTC: { type: Number, default: 0 },
  status: { type: String, default: 'En attente' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

module.exports = mongoose.model('Devis', devisSchema);
