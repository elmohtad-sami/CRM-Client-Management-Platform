const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Client = require('./models/Client');
const Devis = require('./models/Devis');

const toClientId = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/["']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not defined');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // Clean existing data
  await User.deleteMany({});
  await Client.deleteMany({});
  await Devis.deleteMany({});

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await User.create({
    fullName: 'Demo User',
    companyName: 'Finance Corp',
    email: 'demo@example.com',
    passwordHash,
    role: 'Finance',
    isVerified: true
  });
  console.log('Created demo user: demo@example.com / password123');

  const userId = user._id;

  // Create clients
  const clientsData = [
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
      montant: '2500000',
      registrationDate: '2021-03-14',
      assignedManager: 'Nadia El Fassi',
      notes: [
        { id: generateId(), author: 'Sara Benali', date: '2026-04-11T10:00:00.000Z', content: 'Client requested a revised payment schedule for Q2.', text: 'Client requested a revised payment schedule for Q2.' },
        { id: generateId(), author: 'Youssef Karim', date: '2026-04-19T14:00:00.000Z', content: 'Follow-up completed after late payment reminder.', text: 'Follow-up completed after late payment reminder.' }
      ],
      documents: [
        { id: generateId(), name: 'Contract-Atlas-2026.pdf', uploadDate: '2026-01-15T08:00:00.000Z', size: '1.2 MB' },
        { id: generateId(), name: 'KYC-Atlas-2026.pdf', uploadDate: '2026-01-15T08:00:00.000Z', size: '840 KB' }
      ],
      invoices: [
        { id: 'INV-001', clientId: 'atlas-group', clientName: 'Atlas Group', amount: 150000, amountHT: 150000, tva: 30000, clientStatus: 'Solvable', totalTTC: 180000, paymentDelay: 0, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-03-15', reference: 'INV-001', method: 'Bank Transfer', date: '2026-02-15', flags: [] },
        { id: 'INV-002', clientId: 'atlas-group', clientName: 'Atlas Group', amount: 84000, amountHT: 84000, tva: 16800, clientStatus: 'Solvable', totalTTC: 100800, paymentDelay: 5, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-04-10', reference: 'INV-002', method: 'Bank Transfer', date: '2026-03-10', flags: [] },
        { id: 'INV-003', clientId: 'atlas-group', clientName: 'Atlas Group', amount: 70000, amountHT: 70000, tva: 14000, clientStatus: 'Solvable', totalTTC: 84000, paymentDelay: 12, status: 'En attente', paymentStatus: 'Pending', dueDate: '2026-05-01', reference: 'INV-003', method: 'Wire Transfer', date: '2026-04-01', flags: [] }
      ],
      activities: [
        { id: generateId(), date: '2026-04-20T10:00:00.000Z', title: 'Invoice paid', description: 'Invoice INV-002 was settled in full.' },
        { id: generateId(), date: '2026-04-19T09:00:00.000Z', title: 'Payment reminder sent', description: 'Reminder email delivered to finance contact.' },
        { id: generateId(), date: '2026-04-12T11:00:00.000Z', title: 'New note added', description: 'Account manager added a collection note.' }
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
      montant: '1400000',
      registrationDate: '2020-09-02',
      assignedManager: 'Imane Ait',
      notes: [
        { id: generateId(), author: 'Imane Ait', date: '2026-04-15T09:00:00.000Z', content: 'Recommended to keep monthly reconciliation cadence.', text: 'Recommended to keep monthly reconciliation cadence.' }
      ],
      documents: [
        { id: generateId(), name: 'Framework-Agreement.pdf', uploadDate: '2026-02-01T08:00:00.000Z', size: '2.1 MB' }
      ],
      invoices: [
        { id: 'INV-004', clientId: 'nova-retail', clientName: 'Nova Retail', amount: 43000, amountHT: 43000, tva: 8600, clientStatus: 'Fidèle', totalTTC: 51600, paymentDelay: 0, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-03-20', reference: 'INV-004', method: 'Wire Transfer', date: '2026-02-20', flags: [] },
        { id: 'INV-005', clientId: 'nova-retail', clientName: 'Nova Retail', amount: 54000, amountHT: 54000, tva: 10800, clientStatus: 'Fidèle', totalTTC: 64800, paymentDelay: 2, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-04-05', reference: 'INV-005', method: 'Cheque', date: '2026-03-05', flags: [] },
        { id: 'INV-006', clientId: 'nova-retail', clientName: 'Nova Retail', amount: 22000, amountHT: 22000, tva: 4400, clientStatus: 'Fidèle', totalTTC: 26400, paymentDelay: 21, status: 'En attente', paymentStatus: 'Pending', dueDate: '2026-04-25', reference: 'INV-006', method: 'Wire Transfer', date: '2026-03-25', flags: [] }
      ],
      activities: [
        { id: generateId(), date: '2026-04-18T10:00:00.000Z', title: 'Invoice created', description: 'Invoice INV-006 generated for April cycle.' },
        { id: generateId(), date: '2026-04-15T14:00:00.000Z', title: 'Agreement reviewed', description: 'Annual agreement was reviewed by legal.' }
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
      montant: '900000',
      registrationDate: '2019-01-20',
      assignedManager: 'Omar Bennis',
      notes: [
        { id: generateId(), author: 'Omar Bennis', date: '2026-04-08T10:00:00.000Z', content: 'Escalation recommended due to recurring overdue payments.', text: 'Escalation recommended due to recurring overdue payments.' },
        { id: generateId(), author: 'Finance Team', date: '2026-04-03T11:00:00.000Z', content: 'Client asked for restructuring proposal.', text: 'Client asked for restructuring proposal.' }
      ],
      documents: [
        { id: generateId(), name: 'Recovery-Plan.docx', uploadDate: '2026-03-10T08:00:00.000Z', size: '280 KB' },
        { id: generateId(), name: 'KYC-Orion-2025.pdf', uploadDate: '2025-06-01T08:00:00.000Z', size: '950 KB' }
      ],
      invoices: [
        { id: 'INV-007', clientId: 'orion-tech', clientName: 'Orion Tech', amount: 38000, amountHT: 38000, tva: 7600, clientStatus: 'Insolvable', totalTTC: 45600, paymentDelay: 48, status: 'En attente', paymentStatus: 'Pending', dueDate: '2026-03-01', reference: 'INV-007', method: 'Bank Transfer', date: '2026-02-01', flags: [] },
        { id: 'INV-008', clientId: 'orion-tech', clientName: 'Orion Tech', amount: 42000, amountHT: 42000, tva: 8400, clientStatus: 'Insolvable', totalTTC: 50400, paymentDelay: 15, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-03-15', reference: 'INV-008', method: 'Cash', date: '2026-02-15', flags: [] },
        { id: 'INV-009', clientId: 'orion-tech', clientName: 'Orion Tech', amount: 69000, amountHT: 69000, tva: 13800, clientStatus: 'Insolvable', totalTTC: 82800, paymentDelay: 60, status: 'En retard', paymentStatus: 'Overdue', dueDate: '2026-02-20', reference: 'INV-009', method: 'Bank Transfer', date: '2026-01-20', flags: ['overdue'] }
      ],
      activities: [
        { id: generateId(), date: '2026-04-21T10:00:00.000Z', title: 'Risk score updated', description: 'Risk profile worsened after 45-day delay.' },
        { id: generateId(), date: '2026-04-17T09:00:00.000Z', title: 'Collection call', description: 'Reminder call logged by account manager.' },
        { id: generateId(), date: '2026-04-10T11:00:00.000Z', title: 'Payment plan request', description: 'Client requested installment schedule.' }
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
      montant: '750000',
      registrationDate: '2022-06-10',
      assignedManager: 'Salma Idrissi',
      notes: [],
      documents: [],
      invoices: [
        { id: 'INV-010', clientId: 'cedar-logistics', clientName: 'Cedar Logistics', amount: 38000, amountHT: 38000, tva: 7600, clientStatus: 'Solvable', totalTTC: 45600, paymentDelay: 6, status: 'En attente', paymentStatus: 'Pending', dueDate: '2026-04-28', reference: 'INV-010', method: 'Bank Transfer', date: '2026-03-28', flags: [] },
        { id: 'INV-011', clientId: 'cedar-logistics', clientName: 'Cedar Logistics', amount: 25000, amountHT: 25000, tva: 5000, clientStatus: 'Solvable', totalTTC: 30000, paymentDelay: 0, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-03-10', reference: 'INV-011', method: 'Wire Transfer', date: '2026-02-10', flags: [] }
      ],
      activities: []
    },
    {
      id: toClientId('Medina Consulting'),
      name: 'Medina Consulting',
      company: 'Medina Consulting Group',
      status: 'Solvable',
      riskScore: 45,
      email: 'contact@medinaconsult.com',
      phone: '+212 6 55 44 33 22',
      address: '7 Rue Al Mouhit, Rabat',
      industry: 'Consulting',
      montant: '520000',
      registrationDate: '2023-02-18',
      assignedManager: 'Karim Benali',
      notes: [
        { id: generateId(), author: 'Karim Benali', date: '2026-04-05T10:00:00.000Z', content: 'New contract signed for Q3-Q4 advisory.', text: 'New contract signed for Q3-Q4 advisory.' }
      ],
      documents: [
        { id: generateId(), name: 'Advisory-Contract-2026.pdf', uploadDate: '2026-04-05T08:00:00.000Z', size: '1.5 MB' }
      ],
      invoices: [
        { id: 'INV-012', clientId: 'medina-consulting', clientName: 'Medina Consulting', amount: 32000, amountHT: 32000, tva: 6400, clientStatus: 'Solvable', totalTTC: 38400, paymentDelay: 0, status: 'Payée', paymentStatus: 'Paid', dueDate: '2026-03-30', reference: 'INV-012', method: 'Bank Transfer', date: '2026-02-28', flags: [] },
        { id: 'INV-013', clientId: 'medina-consulting', clientName: 'Medina Consulting', amount: 28000, amountHT: 28000, tva: 5600, clientStatus: 'Solvable', totalTTC: 33600, paymentDelay: 3, status: 'En attente', paymentStatus: 'Pending', dueDate: '2026-05-05', reference: 'INV-013', method: 'Wire Transfer', date: '2026-04-05', flags: [] }
      ],
      activities: [
        { id: generateId(), date: '2026-04-05T14:00:00.000Z', title: 'Contract signed', description: 'New advisory contract signed for 2026.' }
      ]
    }
  ];

  for (const clientData of clientsData) {
    // Calculate totals
    let totalRev = 0;
    let outstanding = 0;
    let paid = 0;

    for (const inv of clientData.invoices) {
      const val = inv.totalTTC;
      totalRev += val;
      if (inv.paymentStatus === 'Paid') {
        paid += val;
      } else {
        outstanding += val;
      }
    }

    await Client.create({
      userId,
      ...clientData,
      totalRevenue: totalRev,
      outstandingAmount: outstanding,
      paidAmount: paid,
      delayDays: Math.max(...clientData.invoices.map(i => i.paymentDelay))
    });
  }
  console.log(`Created ${clientsData.length} clients with invoices`);

  // Create devis
  const devisData = [
    {
      id: 'DEV-001',
      client: { name: 'Atlas Group', email: 'finance@atlasgroup.com', phone: '+212 6 12 34 56 78', company: 'Atlas Group Holdings', address: '12 Avenue Hassan II, Casablanca' },
      reference: 'DEV-001',
      description: 'Consulting services for Q3 2026 - Financial audit and compliance review',
      amountHT: 120000,
      tva: 24000,
      totalTTC: 144000,
      status: 'Accepté',
      createdAt: '2026-04-01T10:00:00.000Z'
    },
    {
      id: 'DEV-002',
      client: { name: 'Nova Retail', email: 'accounts@novaretail.com', phone: '+212 6 98 76 54 32', company: 'Nova Retail SARL', address: '45 Boulevard Mohammed V, Rabat' },
      reference: 'DEV-002',
      description: 'Annual tax preparation and filing services',
      amountHT: 45000,
      tva: 9000,
      totalTTC: 54000,
      status: 'En attente',
      createdAt: '2026-04-10T14:00:00.000Z'
    },
    {
      id: 'DEV-003',
      client: { name: 'Cedar Logistics', email: 'ops@cedarlogistics.com', phone: '+212 6 77 88 99 00', company: 'Cedar Logistics Group', address: '19 Port Street, Casablanca' },
      reference: 'DEV-003',
      description: 'Logistics optimization and financial auditing package',
      amountHT: 65000,
      tva: 13000,
      totalTTC: 78000,
      status: 'Refusé',
      createdAt: '2026-03-20T09:00:00.000Z'
    },
    {
      id: 'DEV-004',
      client: { name: 'Medina Consulting', email: 'contact@medinaconsult.com', phone: '+212 6 55 44 33 22', company: 'Medina Consulting Group', address: '7 Rue Al Mouhit, Rabat' },
      reference: 'DEV-004',
      description: 'Q3 advisory retainer - Strategic financial planning',
      amountHT: 35000,
      tva: 7000,
      totalTTC: 42000,
      status: 'Accepté',
      createdAt: '2026-04-05T11:00:00.000Z'
    },
    {
      id: 'DEV-005',
      client: { name: 'Orion Tech', email: 'billing@oriontech.com', phone: '+212 6 11 22 33 44', company: 'Orion Tech Services', address: '8 Rue Ibn Khaldoun, Tangier' },
      reference: 'DEV-005',
      description: 'Debt restructuring consultation and recovery plan',
      amountHT: 18000,
      tva: 3600,
      totalTTC: 21600,
      status: 'En attente',
      createdAt: '2026-04-18T08:00:00.000Z'
    }
  ];

  for (const devis of devisData) {
    await Devis.create({ ...devis, userId });
  }
  console.log(`Created ${devisData.length} devis`);

  console.log('\nSeed completed successfully!');
  console.log('Login: demo@example.com / password123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
