import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let salesData = [];
let isDataLoaded = false;

/**
 * Load and parse CSV data into memory
 * This runs once when the server starts
 */
export const loadSalesData = () => {
  return new Promise((resolve, reject) => {
    if (isDataLoaded) {
      resolve(salesData);
      return;
    }

    const csvPath = path.join(__dirname, '../../../truestate_assignment_dataset.csv');
    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Parse numeric fields
        const parsedData = {
          ...data,
          Age: parseInt(data.Age) || 0,
          Quantity: parseInt(data.Quantity) || 0,
          'Price per Unit': parseFloat(data['Price per Unit']) || 0,
          'Discount Percentage': parseFloat(data['Discount Percentage']) || 0,
          'Total Amount': parseFloat(data['Total Amount']) || 0,
          'Final Amount': parseFloat(data['Final Amount']) || 0,
          Date: data.Date || '',
        };
        results.push(parsedData);
      })
      .on('end', () => {
        salesData = results;
        isDataLoaded = true;
        console.log(`Loaded ${salesData.length} sales records`);
        resolve(salesData);
      })
      .on('error', (error) => {
        console.error('Error loading CSV:', error);
        reject(error);
      });
  });
};

/**
 * Get all sales data
 */
export const getAllSalesData = () => {
  return salesData;
};

/**
 * Get unique values for filter options
 */
export const getFilterOptions = () => {
  if (!salesData || salesData.length === 0) {
    return {
      regions: [],
      genders: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      minAge: 0,
      maxAge: 0,
      minDate: '',
      maxDate: '',
    };
  }

  // Use a sample of 10000 records to avoid processing all 1M records
  const sampleSize = Math.min(10000, salesData.length);
  const sampleData = salesData.slice(0, sampleSize);

  const regions = [...new Set(sampleData.map(item => item['Customer Region']).filter(Boolean))].sort();
  const genders = [...new Set(sampleData.map(item => item.Gender).filter(Boolean))].sort();
  const categories = [...new Set(sampleData.map(item => item['Product Category']).filter(Boolean))].sort();
  const paymentMethods = [...new Set(sampleData.map(item => item['Payment Method']).filter(Boolean))].sort();
  const orderStatuses = [...new Set(sampleData.map(item => item['Order Status']).filter(Boolean))].sort();
  
  // Extract all unique tags
  const allTags = new Set();
  sampleData.forEach(item => {
    if (item.Tags) {
      const tags = item.Tags.split(',').map(tag => tag.trim());
      tags.forEach(tag => allTags.add(tag));
    }
  });
  const tags = [...allTags].sort();

  // Age range
  const ages = sampleData.map(item => item.Age).filter(age => age > 0);
  const minAge = ages.length > 0 ? Math.min(...ages) : 0;
  const maxAge = ages.length > 0 ? Math.max(...ages) : 0;

  // Date range
  const dates = salesData.map(item => item.Date).filter(Boolean).sort();
  const minDate = dates.length > 0 ? dates[0] : '';
  const maxDate = dates.length > 0 ? dates[dates.length - 1] : '';

  return {
    regions,
    genders,
    categories,
    tags,
    paymentMethods,
    orderStatuses,
    minAge,
    maxAge,
    minDate,
    maxDate,
  };
};
