# Retail Sales Backend API

## Overview
RESTful API for Retail Sales Management System providing search, filtering, sorting, and pagination capabilities for sales transaction data.

## Tech Stack
- Node.js
- Express.js
- csv-parser

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Ensure the CSV dataset file (`truestate_assignment_dataset.csv`) is in the root directory (one level up from backend/)

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### GET /api/sales
Get sales data with search, filters, sorting, and pagination.

**Query Parameters:**
- `search` (string): Search query for Customer Name or Phone Number
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)
- `sortBy` (string): Sort field - 'date', 'quantity', 'customerName' (default: 'date')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')
- `regions` (array): Filter by Customer Region
- `genders` (array): Filter by Gender
- `minAge` (number): Minimum age filter
- `maxAge` (number): Maximum age filter
- `categories` (array): Filter by Product Category
- `tags` (array): Filter by Tags
- `paymentMethods` (array): Filter by Payment Method
- `startDate` (string): Start date for date range filter
- `endDate` (string): End date for date range filter

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### GET /api/sales/filters
Get available filter options.

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": [...],
    "genders": [...],
    "categories": [...],
    "tags": [...],
    "paymentMethods": [...],
    "minAge": 18,
    "maxAge": 65,
    "minDate": "2021-01-01",
    "maxDate": "2023-12-31"
  }
}
```

