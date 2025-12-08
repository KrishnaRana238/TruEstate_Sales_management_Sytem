import mysql from 'mysql2/promise';
import { importCSVToDB } from '../services/dbService.js';
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

  const host = process.env.MYSQL_HOST || 'localhost';
  const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306;
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'truestate';
  const allowCreate = (process.env.MYSQL_ALLOW_CREATE || 'true') === 'true';

  if (allowCreate) {
    try {
      const conn = await mysql.createConnection({ host, port, user, password });
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      await conn.end();
      console.log(`Database ensured: ${database}`);
    } catch (e) {
      console.error('Failed to ensure database:', e.message);
      // Proceed anyway in case the database already exists but CREATE is restricted
    }
  } else {
    console.log('Skipping database creation as MYSQL_ALLOW_CREATE is false');
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
