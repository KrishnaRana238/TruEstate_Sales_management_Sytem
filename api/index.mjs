import express from 'express';
import cors from 'cors';
import salesRoutes from '../backend/src/routes/salesRoutes.js';
import { ensureSchema } from '../backend/src/services/dbService.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/sales', salesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Retail Sales API (Vercel) is running' });
});

let initialized = false;
const init = async () => {
  if (initialized) return;
  if (process.env.USE_DB === 'true') {
    try {
      await ensureSchema();
    } catch (e) {
      console.error('ensureSchema failed, continuing:', e?.message || e);
    }
  }
  initialized = true;
};

export default async (req, res) => {
  await init();
  app(req, res);
};
