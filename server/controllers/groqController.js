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
  const apiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
  const model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

  if (!apiKey) {
    console.error('GROQ_API_KEY is not configured');
    return res.status(500).json({ message: 'GROQ_API_KEY is not configured on server' });
  }

  try {
    const systemPrompt = `You are an expert AI Financial Advisor and CRM Assistant for a Finance application. Your role is to provide strategic insights and actionable solutions on:

## CORE EXPERTISE:
1. **FINANCE OBJECTS**: Invoices, payments, revenue analysis, financial forecasting, cash flow management
2. **CLIENT MANAGEMENT**: Client segmentation, relationship analysis, satisfaction metrics, account health scoring
3. **FISCAL & ECONOMIC**: Tax optimization, compliance, fiscal risks, economic indicators, regulatory requirements

## CURRENT SYSTEM STATUS:
- Total Risks Detected: ${context?.riskCount || 0}
- Total Invoices: ${context?.invoiceCount || 0}
- Total Clients: ${context?.clientCount || 0}
- Recent Anomalies: ${context?.anomalies ? JSON.stringify(context.anomalies.slice(0, 3)) : 'None detected'}

## RESPONSE FRAMEWORK:
When answering questions, use this structure:

1. **SITUATION ANALYSIS** - Assess the current status using available data
2. **RISK IDENTIFICATION** - Identify potential financial or fiscal risks
3. **ROOT CAUSES** - Explain underlying reasons for issues
4. **RECOMMENDED SOLUTIONS** - Provide 2-3 actionable steps with implementation details
5. **FISCAL IMPACT** - Explain tax/regulatory implications if applicable
6. **PREVENTION TIPS** - Suggest preventive measures for future

## DOMAINS YOU HANDLE:
- **Finance**: Revenue recognition, payment terms, discount strategies, financial ratios, cash flow analysis
- **Client Management**: Client profiling, retention strategies, credit risk assessment, client lifecycle management
- **Fiscal**: Tax deductions, VAT compliance, fiscal deadlines, accounting standards, regulatory requirements
- **Economic**: Market trends, economic indicators, cost optimization, pricing strategies

Keep responses professional, data-driven, and concise. Always reference current context when relevant.
Provide French translations for fiscal terms when necessary.`;

    console.log(`[Groq] Sending request to ${apiUrl}`);
    console.log(`[Groq] Model: ${model}`);
    console.log(`[Groq] Message length: ${message.length} chars`);

    const requestPayload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    const response = await axios.post(apiUrl, requestPayload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('[Groq] Response received successfully');
    const responseText = response.data?.choices?.[0]?.message?.content || 'Unable to process request';
    return res.json({ response: responseText });
  } catch (err) {
    console.error('[Groq] Error details:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      code: err.code
    });

    if (err.response?.status === 401) {
      return res.status(401).json({ message: 'Authentication failed. Please check your GROQ_API_KEY.' });
    }
    if (err.response?.status === 400) {
      return res.status(400).json({ message: `Invalid request to Groq API: ${err.response.data?.error?.message || 'Unknown error'}` });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ message: 'Request timeout. Groq API is taking too long to respond.' });
    }
    
    const status = err.response?.status || 500;
    const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to get analysis from AI';
    return res.status(status).json({ message: `Error: ${errorMsg}` });
  }
});
