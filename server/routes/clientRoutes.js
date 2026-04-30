const express = require('express');
const controller = require('../controllers/clientController');

const router = express.Router();

router.get('/', controller.getClients);
router.get('/:id', controller.getClientById);
router.post('/', controller.createClient);
router.put('/:id', controller.updateClient);
router.delete('/:id', controller.deleteClient);
router.post('/:id/invoices', controller.createInvoice);
router.post('/:id/notes', controller.addNote);
router.post('/:id/documents', controller.addDocument);
router.patch('/:id/invoices/:invoiceId', controller.updateInvoice);
router.put('/:id/notes/:noteId', controller.updateNote);
router.delete('/:id/notes/:noteId', controller.deleteNote);
router.put('/:id/activities/:activityId', controller.updateActivity);
router.delete('/:id/activities/:activityId', controller.deleteActivity);

module.exports = router;