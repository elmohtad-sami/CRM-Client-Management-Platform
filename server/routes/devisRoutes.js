const express = require('express');
const controller = require('../controllers/devisController');

const router = express.Router();

router.get('/', controller.getDevis);
router.post('/', controller.createDevis);
router.delete('/:id', controller.deleteDevis);

module.exports = router;
