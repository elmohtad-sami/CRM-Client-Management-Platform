const express = require('express');
const controller = require('../controllers/groqController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected endpoint: forward a request body to the configured GROQ API
router.post('/ask', authenticateToken, controller.ask);

// Protected endpoint: analyze financial data with context
router.post('/analyze', authenticateToken, controller.analyze);

module.exports = router;
