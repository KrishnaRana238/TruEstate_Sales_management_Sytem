import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';
import { loadSalesData } from './services/dataService.js';

const app = express();
const DEFAULT_PORT = 3001;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Retail Sales API is running' });
});

// Load data on startup
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallback = port === DEFAULT_PORT ? DEFAULT_PORT + 1 : port + 1;
      console.warn(`Port ${port} in use. Retrying on port ${fallback}...`);
      startServer(fallback);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

loadSalesData()
  .then(() => {
    startServer(PORT);
  })
  .catch((error) => {
    console.error('Failed to load data:', error);
    process.exit(1);
  });
