const axios = require('axios');
const asyncHandler = require('../utils/asyncHandler');

exports.ask = asyncHandler(async (req, res, next) => {
  const payload = req.body || {};
  const { input } = payload;

  if (!input && !payload.prompt) {
    return res.status(400).json({ message: 'Request body must include `input` or `prompt`' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = process.env.GROQ_API_URL;

  if (!apiKey || !apiUrl) {
    return res.status(500).json({ message: 'GROQ_API_KEY or GROQ_API_URL not configured on server' });
  }

  try {
    const body = { ...payload };

    const response = await axios.post(apiUrl, body, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    return res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    return res.status(status).json({ error: data });
  }
});
