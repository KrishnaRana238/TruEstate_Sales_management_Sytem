import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import salesRoutes from '../../src/routes/salesRoutes.js';
import { ensureSchema } from '../../src/services/dbService.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/sales', salesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Retail Sales API (Netlify) is running' });
});

let initialized = false;
const init = async () => {
  if (initialized) return;
  if (process.env.USE_DB === 'true') {
    await ensureSchema();
  }
  initialized = true;
};

const appHandler = serverless(app);

export const handler = async (event, context) => {
  await init();
  return appHandler(event, context);
};

