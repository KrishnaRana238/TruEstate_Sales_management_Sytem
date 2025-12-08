import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

let pool;

const getPool = async () => {
  if (pool) return pool;
  pool = await mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'truestate',
    connectionLimit: 10,
  });
  return pool;
};

export const ensureSchema = async () => {
  const p = await getPool();
  const sql = `
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      TransactionID VARCHAR(50),
      Date DATE,
      CustomerID VARCHAR(50),
      CustomerName VARCHAR(255),
      PhoneNumber VARCHAR(50),
      Gender VARCHAR(20),
      Age INT,
      CustomerRegion VARCHAR(50),
      CustomerType VARCHAR(50),
      ProductID VARCHAR(50),
      ProductName VARCHAR(255),
      Brand VARCHAR(100),
      ProductCategory VARCHAR(100),
      Tags TEXT,
      Quantity INT,
      PricePerUnit DECIMAL(12,2),
      DiscountPercentage DECIMAL(5,2),
      TotalAmount DECIMAL(14,2),
      FinalAmount DECIMAL(14,2),
      PaymentMethod VARCHAR(50),
      OrderStatus VARCHAR(50),
      DeliveryType VARCHAR(50),
      StoreID VARCHAR(50),
      StoreLocation VARCHAR(100),
      SalespersonID VARCHAR(50),
      EmployeeName VARCHAR(255)
    ) ENGINE=InnoDB;
  `;
  await p.query(sql);
};

export const importCSVToDB = async (csvPath) => {
  await ensureSchema();
  const p = await getPool();
  const rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (d) => {
        rows.push([
          d['Transaction ID'],
          d['Date'],
          d['Customer ID'],
          d['Customer Name'],
          d['Phone Number'],
          d['Gender'],
          parseInt(d['Age']) || 0,
          d['Customer Region'],
          d['Customer Type'],
          d['Product ID'],
          d['Product Name'],
          d['Brand'],
          d['Product Category'],
          d['Tags'],
          parseInt(d['Quantity']) || 0,
          parseFloat(d['Price per Unit']) || 0,
          parseFloat(d['Discount Percentage']) || 0,
          parseFloat(d['Total Amount']) || 0,
          parseFloat(d['Final Amount']) || 0,
          d['Payment Method'],
          d['Order Status'],
          d['Delivery Type'],
          d['Store ID'],
          d['Store Location'],
          d['Salesperson ID'],
          d['Employee Name'],
        ]);
        if (rows.length >= 1000) {
          const batch = rows.splice(0, rows.length);
          p.query(
            `INSERT INTO sales (TransactionID, Date, CustomerID, CustomerName, PhoneNumber, Gender, Age, CustomerRegion, CustomerType, ProductID, ProductName, Brand, ProductCategory, Tags, Quantity, PricePerUnit, DiscountPercentage, TotalAmount, FinalAmount, PaymentMethod, OrderStatus, DeliveryType, StoreID, StoreLocation, SalespersonID, EmployeeName)
             VALUES ?`,
            [batch]
          ).catch(() => {});
        }
      })
      .on('end', async () => {
        if (rows.length > 0) {
          await p.query(
            `INSERT INTO sales (TransactionID, Date, CustomerID, CustomerName, PhoneNumber, Gender, Age, CustomerRegion, CustomerType, ProductID, ProductName, Brand, ProductCategory, Tags, Quantity, PricePerUnit, DiscountPercentage, TotalAmount, FinalAmount, PaymentMethod, OrderStatus, DeliveryType, StoreID, StoreLocation, SalespersonID, EmployeeName)
             VALUES ?`,
            [rows]
          );
        }
        resolve(true);
      })
      .on('error', (e) => reject(e));
  });
};

const buildWhere = (q) => {
  const where = [];
  const params = [];
  if (q.search) {
    where.push('(LOWER(CustomerName) LIKE ? OR LOWER(PhoneNumber) LIKE ?)');
    const s = `%${q.search.toLowerCase()}%`;
    params.push(s, s);
  }
  if (q.regions) {
    where.push(`CustomerRegion IN (${q.regions.map(() => '?').join(',')})`);
    params.push(...q.regions);
  }
  if (q.genders) {
    where.push(`Gender IN (${q.genders.map(() => '?').join(',')})`);
    params.push(...q.genders);
  }
  if (q.minAge !== undefined) {
    where.push('Age >= ?');
    params.push(q.minAge);
  }
  if (q.maxAge !== undefined) {
    where.push('Age <= ?');
    params.push(q.maxAge);
  }
  if (q.categories) {
    where.push(`ProductCategory IN (${q.categories.map(() => '?').join(',')})`);
    params.push(...q.categories);
  }
  if (q.tags) {
    const parts = q.tags.map(() => 'FIND_IN_SET(?, REPLACE(Tags, \' \', \'\')) > 0');
    where.push(`(${parts.join(' OR ')})`);
    params.push(...q.tags);
  }
  if (q.paymentMethods) {
    where.push(`PaymentMethod IN (${q.paymentMethods.map(() => '?').join(',')})`);
    params.push(...q.paymentMethods);
  }
  if (q.orderStatus) {
    where.push(`OrderStatus IN (${q.orderStatus.map(() => '?').join(',')})`);
    params.push(...q.orderStatus);
  }
  if (q.startDate) {
    where.push('Date >= ?');
    params.push(q.startDate);
  }
  if (q.endDate) {
    where.push('Date <= ?');
    params.push(q.endDate);
  }
  return { where, params };
};

export const querySales = async (q) => {
  const p = await getPool();
  const { where, params } = buildWhere(q);
  let orderBy = 'CustomerName ASC';
  if (q.sortBy === 'date') orderBy = `Date ${q.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  if (q.sortBy === 'quantity') orderBy = `Quantity ${q.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  if (q.sortBy === 'customerName') orderBy = `CustomerName ${q.sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  const page = parseInt(q.page) || 1;
  const pageSize = parseInt(q.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [rows] = await p.query(
    `SELECT * FROM sales ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  const [[countRow]] = await p.query(
    `SELECT COUNT(*) as cnt FROM sales ${whereSql}`,
    params
  );
  return {
    data: rows,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: countRow.cnt,
      totalPages: Math.ceil(countRow.cnt / pageSize),
      hasNextPage: offset + rows.length < countRow.cnt,
      hasPreviousPage: page > 1,
    },
  };
};

export const getFilterOptionsDB = async () => {
  const p = await getPool();
  const [regions] = await p.query('SELECT DISTINCT CustomerRegion AS v FROM sales WHERE CustomerRegion IS NOT NULL');
  const [genders] = await p.query('SELECT DISTINCT Gender AS v FROM sales WHERE Gender IS NOT NULL');
  const [categories] = await p.query('SELECT DISTINCT ProductCategory AS v FROM sales WHERE ProductCategory IS NOT NULL');
  const [paymentMethods] = await p.query('SELECT DISTINCT PaymentMethod AS v FROM sales WHERE PaymentMethod IS NOT NULL');
  const [[minAgeRow]] = await p.query('SELECT MIN(Age) AS minAge FROM sales');
  const [[maxAgeRow]] = await p.query('SELECT MAX(Age) AS maxAge FROM sales');
  const [[minDateRow]] = await p.query('SELECT MIN(Date) AS minDate FROM sales');
  const [[maxDateRow]] = await p.query('SELECT MAX(Date) AS maxDate FROM sales');
  const [tagsRows] = await p.query('SELECT Tags FROM sales WHERE Tags IS NOT NULL LIMIT 10000');
  const tagsSet = new Set();
  for (const r of tagsRows) {
    const parts = String(r.Tags).split(',').map(t => t.trim()).filter(Boolean);
    for (const t of parts) tagsSet.add(t);
  }
  return {
    regions: regions.map(r => r.v).filter(Boolean).sort(),
    genders: genders.map(r => r.v).filter(Boolean).sort(),
    categories: categories.map(r => r.v).filter(Boolean).sort(),
    tags: Array.from(tagsSet).sort(),
    paymentMethods: paymentMethods.map(r => r.v).filter(Boolean).sort(),
    minAge: minAgeRow.minAge || 0,
    maxAge: maxAgeRow.maxAge || 0,
    minDate: minDateRow.minDate || '',
    maxDate: maxDateRow.maxDate || '',
  };
};

