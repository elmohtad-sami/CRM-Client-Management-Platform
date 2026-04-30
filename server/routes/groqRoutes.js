const express = require('express');
const controller = require('../controllers/groqController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected endpoint: forward a request body to the configured GROQ API
router.post('/ask', authenticateToken, controller.ask);

module.exports = router;
