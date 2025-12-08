# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System that provides comprehensive search, filtering, sorting, and pagination capabilities for sales transaction data. The system efficiently handles large datasets and provides an intuitive user interface for managing and analyzing retail sales information.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Vite
- **Data Processing**: csv-parser
- **HTTP Client**: Axios

## Search Implementation Summary
Full-text search is implemented on the backend using case-insensitive string matching across Customer Name and Phone Number fields. The search query is processed in the `applySearch` utility function, which filters data by checking if the search term appears in either field. Search works seamlessly with filters, sorting, and pagination, maintaining state across all operations.

## Filter Implementation Summary
Multi-select filtering is implemented for Customer Region, Gender, Product Category, Tags, and Payment Method. Range-based filtering is provided for Age Range and Date Range. All filters are applied sequentially in the `applyFilters` utility function, allowing multiple filters to work in combination. Filter state is maintained independently and persists alongside search and sorting operations.

## Sorting Implementation Summary
Sorting is implemented for three fields: Date (newest first by default), Quantity, and Customer Name (A-Z). The sorting logic is centralized in the `applySorting` utility function, which supports both ascending and descending order. Users can toggle sort order for the same field or switch between different sort fields. Sorting is applied after filtering and before pagination to ensure accurate results.

## Pagination Implementation Summary
Pagination is implemented with a fixed page size of 10 items per page. The `applyPagination` utility function calculates the appropriate slice of data based on the current page number and page size. Pagination includes Previous/Next navigation buttons and numbered page buttons (up to 6 visible). Pagination metadata includes total items, total pages, and navigation flags. All active search, filter, and sort states are preserved when navigating between pages.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Ensure the CSV dataset file (`truestate_assignment_dataset.csv`) is in the root directory (one level up from `backend/`)

4. Start the backend server:
```bash
npm start
```

The backend API will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:3000`

### Running Both Services

For development, you'll need to run both services simultaneously. Use separate terminal windows or a process manager like `concurrently`.

## API Endpoints

- `GET /api/sales` - Get sales data with search, filters, sorting, and pagination
- `GET /api/sales/filters` - Get available filter options
- `GET /api/health` - Health check endpoint

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
└── README.md
```

