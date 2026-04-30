const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const groqRoutes = require('./routes/groqRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
// Default backend port (override with server/.env or environment variable)
const PORT = process.env.PORT || 5000;
let server;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/groq', groqRoutes);

app.use(errorHandler);

if (process.env.VERCEL) {
  connectDB();
  module.exports = app;
} else {
  const start = async () => {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in server/.env.`);
        process.exit(1);
      }

      console.error(error);
      process.exit(1);
    });
  };

  const shutdown = (signal) => {
    if (!server) {
      process.exit(0);
      return;
    }

    server.close(() => {
      console.log(`Server closed after ${signal}`);
      process.exit(0);
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGUSR2', () => shutdown('SIGUSR2'));

  start();
}
