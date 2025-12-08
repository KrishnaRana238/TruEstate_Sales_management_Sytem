import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/salesRoutes.js';
import { loadSalesData } from './services/dataService.js';
import { ensureSchema, clearSales, listDatabases, countSalesInDb, listCollections } from './services/dbService.js';

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

app.get('/api/_debug/dbs', async (req, res) => {
  try {
    const dbs = await listDatabases();
    res.json({ dbs });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/_debug/sales-count', async (req, res) => {
  try {
    const current = await countSalesInDb();
    const names = ['truestate', 'test', 'sales', 'sample_mflix'];
    const other = await Promise.all(names.map(async (n) => ({ name: n, count: await countSalesInDb(n) })));
    res.json({ current, other });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get('/api/_debug/collections', async (req, res) => {
  try {
    const dbName = req.query.db || undefined;
    const names = await listCollections(dbName);
    res.json({ db: dbName || 'current', collections: names });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
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

const useDb = process.env.USE_DB === 'true';

if (useDb) {
  startServer(PORT);
  (async () => {
    try {
      if (process.env.MONGODB_CLEAR_ON_START === 'true') {
        console.warn('Clearing sales collection before start...');
        await clearSales();
        console.warn('Sales collection cleared');
      }
      await ensureSchema();
      console.log('DB schema ensured');
    } catch (error) {
      console.error('Failed to ensure DB schema:', error);
    }
  })();
} else {
  loadSalesData()
    .then(() => {
      startServer(PORT);
    })
    .catch((error) => {
      console.error('Failed to load data:', error);
      process.exit(1);
    });
}
