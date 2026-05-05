const axios = require('axios');
const asyncHandler = require('../utils/asyncHandler');

exports.ask = asyncHandler(async (req, res, next) => {
  const payload = req.body || {};

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = process.env.GROQ_API_URL || 'https://api.groq.ai/openai/v1/chat/completions';

  if (!apiKey) {
    return res.status(500).json({ message: 'GROQ_API_KEY is not configured on server' });
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

exports.analyze = asyncHandler(async (req, res, next) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = process.env.GROQ_API_URL || 'https://api.groq.ai/openai/v1/chat/completions';
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  if (!apiKey) {
    return res.status(500).json({ message: 'GROQ_API_KEY is not configured on server' });
  }

  try {
    const systemPrompt = `You are an AI financial analyst assistant for a CRM Finance application. You help users understand their financial data, analyze risks, and provide insights about clients and invoices.

Current Context:
- Total Risks: ${context?.riskCount || 0}
- Total Invoices: ${context?.invoiceCount || 0}
- Total Clients: ${context?.clientCount || 0}
- Recent Anomalies: ${context?.anomalies ? JSON.stringify(context.anomalies.slice(0, 3)) : 'None'}

Provide concise, actionable insights. Keep responses professional and data-focused.`;

    const response = await axios.post(apiUrl, {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });

    const responseText = response.data?.choices?.[0]?.message?.content || 'Unable to process request';
    return res.json({ response: responseText });
  } catch (err) {
    console.error('Groq analyze error:', err.message);
    const status = err.response?.status || 500;
    const errorMsg = err.response?.data?.message || err.message || 'Failed to get analysis from AI';
    return res.status(status).json({ message: errorMsg });
  }
});
