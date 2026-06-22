const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const Client = require('../models/Client');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'CSV file is required' });
    }

    const rows = [];
    const csvText = req.file.buffer.toString('utf-8');

    await new Promise((resolve, reject) => {
      const { Readable } = require('stream');
      const lineStream = Readable.from(csvText.split('\n').map(line => line.trim()).filter(Boolean));
      lineStream
        .pipe(csv({ headers: ['Date', 'Description', 'Amount'], skipLines: 1 }))
        .on('data', (row) => {
          const amount = parseFloat(row.Amount);
          if (!isNaN(amount)) {
            rows.push({ date: row.Date, description: row.Description, amount });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows found in CSV' });
    }

    const matched = [];
    const unmatched = [];

    for (const row of rows) {
      const client = await Client.findOne({
        'invoices.totalTTC': row.amount,
        'invoices.paymentStatus': 'Pending'
      });

      if (client) {
        const invoice = client.invoices.find(
          (inv) => inv.totalTTC === row.amount && inv.paymentStatus === 'Pending'
        );

        if (invoice) {
          await Client.updateOne(
            { _id: client._id, 'invoices.id': invoice.id },
            { $set: { 'invoices.$.paymentStatus': 'Paid', 'invoices.$.status': 'Payée' } }
          );

          matched.push({
            date: row.date,
            description: row.description,
            amount: row.amount,
            clientName: invoice.clientName,
            invoiceReference: invoice.reference || invoice.id
          });
          continue;
        }
      }

      unmatched.push({
        date: row.date,
        description: row.description,
        amount: row.amount
      });
    }

    res.json({
      success: true,
      matchedCount: matched.length,
      totalRows: rows.length,
      matched,
      unmatched
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
