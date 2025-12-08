import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

let client;
let db;

const getDb = async () => {
  if (db) return db;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const pickDbFromUri = (u) => {
    const m = u.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  };
  const database = process.env.MONGODB_DATABASE || pickDbFromUri(uri) || 'truestate';
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(database);
  return db;
};

export const ensureSchema = async () => {
  if ((process.env.MONGODB_SKIP_INDEXES || 'false') === 'true') return;
  const d = await getDb();
  const col = d.collection('sales');
  const create = async (spec) => {
    try {
      await col.createIndex(spec);
    } catch (e) {
      // skip index errors (e.g., storage quota) to allow app to function
    }
  };
  await create({ CustomerName: 1 });
  await create({ PhoneNumber: 1 });
  await create({ CustomerRegion: 1 });
  await create({ Gender: 1 });
  await create({ Age: 1 });
  await create({ ProductCategory: 1 });
  await create({ PaymentMethod: 1 });
  await create({ OrderStatus: 1 });
  await create({ Date: 1 });
};

export const importCSVToDB = async (csvPath) => {
  await ensureSchema();
  const d = await getDb();
  const col = d.collection('sales');
  const stream = fs.createReadStream(csvPath).pipe(csv());
  let batch = [];
  let pending = Promise.resolve();
  return new Promise((resolve, reject) => {
    stream.on('data', (r) => {
      batch.push({
        TransactionID: r['Transaction ID'],
        Date: r['Date'],
        CustomerID: r['Customer ID'],
        CustomerName: r['Customer Name'],
        PhoneNumber: r['Phone Number'],
        Gender: r['Gender'],
        Age: parseInt(r['Age']) || 0,
        CustomerRegion: r['Customer Region'],
        CustomerType: r['Customer Type'],
        ProductID: r['Product ID'],
        ProductName: r['Product Name'],
        Brand: r['Brand'],
        ProductCategory: r['Product Category'],
        Tags: r['Tags'],
        Quantity: parseInt(r['Quantity']) || 0,
        PricePerUnit: parseFloat(r['Price per Unit']) || 0,
        DiscountPercentage: parseFloat(r['Discount Percentage']) || 0,
        TotalAmount: parseFloat(r['Total Amount']) || 0,
        FinalAmount: parseFloat(r['Final Amount']) || 0,
        PaymentMethod: r['Payment Method'],
        OrderStatus: r['Order Status'],
        DeliveryType: r['Delivery Type'],
        StoreID: r['Store ID'],
        StoreLocation: r['Store Location'],
        SalespersonID: r['Salesperson ID'],
        EmployeeName: r['Employee Name'],
      });
      if (batch.length >= 1000) {
        const docs = batch;
        batch = [];
        stream.pause();
        pending = pending
          .then(() => col.insertMany(docs))
          .then(() => stream.resume())
          .catch((e) => reject(e));
      }
    });
    stream.on('end', async () => {
      try {
        await pending;
        if (batch.length > 0) {
          await col.insertMany(batch);
        }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
    stream.on('error', (e) => reject(e));
  });
};

const buildQuery = (q) => {
  const filter = {};
  if (q.search) {
    const s = q.search.toLowerCase();
    filter.$or = [
      { CustomerName: { $regex: s, $options: 'i' } },
      { PhoneNumber: { $regex: s, $options: 'i' } },
    ];
  }
  if (q.regions) filter.CustomerRegion = { $in: q.regions };
  if (q.genders) filter.Gender = { $in: q.genders };
  if (q.minAge !== undefined) filter.Age = { ...(filter.Age || {}), $gte: q.minAge };
  if (q.maxAge !== undefined) filter.Age = { ...(filter.Age || {}), $lte: q.maxAge };
  if (q.categories) filter.ProductCategory = { $in: q.categories };
  if (q.tags) {
    const ors = q.tags.map(t => ({ Tags: { $regex: `(^|,)\\s*${t}\\s*(,|$)`, $options: 'i' } }));
    filter.$and = [...(filter.$and || []), { $or: ors }];
  }
  if (q.paymentMethods) filter.PaymentMethod = { $in: q.paymentMethods };
  if (q.orderStatus) filter.OrderStatus = { $in: q.orderStatus };
  if (q.startDate) filter.Date = { ...(filter.Date || {}), $gte: q.startDate };
  if (q.endDate) filter.Date = { ...(filter.Date || {}), $lte: q.endDate };
  return filter;
};

export const querySales = async (q) => {
  const d = await getDb();
  const col = d.collection('sales');
  const filter = buildQuery(q);
  let sort = { CustomerName: 1 };
  if (q.sortBy === 'date') sort = { Date: q.sortOrder === 'desc' ? -1 : 1 };
  if (q.sortBy === 'quantity') sort = { Quantity: q.sortOrder === 'desc' ? -1 : 1 };
  if (q.sortBy === 'customerName') sort = { CustomerName: q.sortOrder === 'desc' ? -1 : 1 };
  const page = parseInt(q.page) || 1;
  const pageSize = parseInt(q.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const cursor = col.find(filter).sort(sort).skip(skip).limit(pageSize);
  const rows = await cursor.toArray();
  const total = await col.countDocuments(filter);
  return {
    data: rows,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: skip + rows.length < total,
      hasPreviousPage: page > 1,
    },
  };
};

export const getFilterOptionsDB = async () => {
  const d = await getDb();
  const col = d.collection('sales');
  const regions = await col.distinct('CustomerRegion', { CustomerRegion: { $ne: null } });
  const genders = await col.distinct('Gender', { Gender: { $ne: null } });
  const categories = await col.distinct('ProductCategory', { ProductCategory: { $ne: null } });
  const paymentMethods = await col.distinct('PaymentMethod', { PaymentMethod: { $ne: null } });
  const agg = await col.aggregate([
    { $group: {
      _id: null,
      minAge: { $min: '$Age' },
      maxAge: { $max: '$Age' },
      minDate: { $min: '$Date' },
      maxDate: { $max: '$Date' },
    } },
  ]).toArray();
  const stats = agg[0] || {};
  const tagsDocs = await col.find({ Tags: { $ne: null } }).project({ Tags: 1 }).limit(10000).toArray();
  const tagsSet = new Set();
  for (const r of tagsDocs) {
    String(r.Tags).split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagsSet.add(t));
  }
  return {
    regions: regions.filter(Boolean).sort(),
    genders: genders.filter(Boolean).sort(),
    categories: categories.filter(Boolean).sort(),
    tags: Array.from(tagsSet).sort(),
    paymentMethods: paymentMethods.filter(Boolean).sort(),
    minAge: stats.minAge || 0,
    maxAge: stats.maxAge || 0,
    minDate: stats.minDate || '',
    maxDate: stats.maxDate || '',
  };
};

export const clearSales = async () => {
  const d = await getDb();
  const col = d.collection('sales');
  await col.deleteMany({});
};

export const listDatabases = async () => {
  if (!client) await getDb();
  const admin = client.db().admin();
  const res = await admin.listDatabases();
  return res.databases || [];
};

export const countSalesInDb = async (databaseName) => {
  if (!client) await getDb();
  const d = databaseName ? client.db(databaseName) : await getDb();
  const col = d.collection('sales');
  try {
    const n = await col.countDocuments({});
    return n;
  } catch (e) {
    return 0;
  }
};

export const listCollections = async (databaseName) => {
  if (!client) await getDb();
  const d = databaseName ? client.db(databaseName) : await getDb();
  const cols = await d.listCollections().toArray();
  return cols.map(c => c.name);
};
