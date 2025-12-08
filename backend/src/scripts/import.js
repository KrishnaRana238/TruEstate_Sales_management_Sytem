import { importCSVToDB, clearSales } from '../services/dbService.js';
import fs from 'fs';

const required = (name) => {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env: ${name}`);
    process.exit(1);
  }
  return v;
};

const main = async () => {
  const csvPath = required('DATASET_PATH');
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at ${csvPath}`);
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('Missing env: MONGODB_URI');
    process.exit(1);
  }
  if ((process.env.MONGODB_DROP_BEFORE_IMPORT || 'false') === 'true') {
    try {
      console.log('Clearing existing sales collection...');
      await clearSales();
      console.log('Sales collection cleared');
    } catch (e) {
      console.error('Failed to clear sales collection:', e);
      process.exit(1);
    }
  }

  try {
    console.log('Starting CSV import...');
    await importCSVToDB(csvPath);
    console.log('CSV import completed successfully');
    process.exit(0);
  } catch (e) {
    console.error('CSV import failed:', e);
    process.exit(1);
  }
};

main();
