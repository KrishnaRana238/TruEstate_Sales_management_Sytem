# Architecture Document

## Backend Architecture

### Overview
The backend is built using Node.js with Express.js, following a layered architecture pattern that separates concerns into controllers, services, routes, and utilities.

### Folder Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers and response formatting
│   │   └── salesController.js
│   ├── services/        # Business logic and data access
│   │   └── dataService.js
│   ├── utils/          # Reusable utility functions
│   │   └── filterUtils.js
│   ├── routes/          # API route definitions
│   │   └── salesRoutes.js
│   └── index.js        # Application entry point
├── package.json
└── README.md
```

### Module Responsibilities

#### Controllers (`controllers/salesController.js`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Parse query parameters from requests
  - Coordinate between services and utilities
  - Format and send JSON responses
  - Handle errors and return appropriate status codes
- **Key Functions**:
  - `getSales()`: Main endpoint handler for fetching sales data
  - `getFilters()`: Endpoint handler for filter options

#### Services (`services/dataService.js`)
- **Purpose**: Manage data loading and provide data access layer
- **Responsibilities**:
  - Load and parse CSV data on server startup
  - Cache parsed data in memory for performance
  - Provide access to all sales data
  - Extract unique values for filter options
- **Key Functions**:
  - `loadSalesData()`: Loads CSV file and parses into memory
  - `getAllSalesData()`: Returns all loaded sales records
  - `getFilterOptions()`: Extracts unique values for all filter types

#### Utilities (`utils/filterUtils.js`)
- **Purpose**: Pure functions for data transformation
- **Responsibilities**:
  - Apply search filtering (case-insensitive)
  - Apply multi-select and range filters
  - Sort data by various fields
  - Paginate results
- **Key Functions**:
  - `applySearch()`: Filters data by search query
  - `applyFilters()`: Applies all active filters
  - `applySorting()`: Sorts data by specified field and order
  - `applyPagination()`: Returns paginated subset of data

#### Routes (`routes/salesRoutes.js`)
- **Purpose**: Define API endpoints and map to controllers
- **Responsibilities**:
  - Define route paths
  - Connect routes to controller functions
  - Handle route-level middleware if needed

#### Entry Point (`index.js`)
- **Purpose**: Initialize and start the Express server
- **Responsibilities**:
  - Configure Express middleware (CORS, JSON parsing)
  - Register routes
  - Load data on startup
  - Start HTTP server

### Data Flow

1. **Server Startup**:
   - Express app initializes
   - `loadSalesData()` reads and parses CSV file
   - Data is stored in memory for fast access
   - Server starts listening on port 3001

2. **Request Flow**:
   - Client sends HTTP request to `/api/sales` with query parameters
   - Route handler forwards to `salesController.getSales()`
   - Controller extracts query parameters (search, filters, sort, pagination)
   - Controller calls `getAllSalesData()` to get base dataset
   - Controller applies utilities in sequence:
     - `applySearch()` → `applyFilters()` → `applySorting()` → `applyPagination()`
   - Controller returns formatted JSON response

3. **Filter Options Flow**:
   - Client requests `/api/sales/filters`
   - Route handler forwards to `salesController.getFilters()`
   - Controller calls `getFilterOptions()`
   - Service extracts unique values from dataset
   - Controller returns filter options as JSON

## Frontend Architecture

### Overview
The frontend is built using React 18 with Vite as the build tool. It follows a component-based architecture with clear separation between UI components, API services, and state management.

### Folder Structure
```
frontend/
├── src/
│   ├── components/      # React UI components
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── Sorting.jsx
│   │   └── Pagination.jsx
│   ├── services/        # API communication
│   │   └── apiService.js
│   ├── styles/          # CSS stylesheets
│   │   ├── index.css
│   │   ├── App.css
│   │   └── [component].css
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

### Module Responsibilities

#### Components

**App.jsx** (Main Application Component)
- **Purpose**: Root component managing global state
- **Responsibilities**:
  - Manage all application state (search, filters, sort, pagination)
  - Coordinate data fetching from API
  - Handle user interactions and state updates
  - Render child components with appropriate props
- **State Management**:
  - Uses React hooks (`useState`, `useEffect`)
  - Centralized state for all filters and controls
  - Automatic data refetching when state changes

**SearchBar.jsx**
- **Purpose**: Search input component
- **Responsibilities**:
  - Capture user search input
  - Trigger search on input change
  - Provide clear button functionality
  - Communicate search query to parent

**FilterPanel.jsx**
- **Purpose**: Multi-select and range filter controls
- **Responsibilities**:
  - Display all available filter options
  - Handle multi-select checkbox interactions
  - Handle range inputs (age, date)
  - Provide clear filter functionality
  - Collapsible panel for better UX

**TransactionTable.jsx**
- **Purpose**: Display sales data in tabular format
- **Responsibilities**:
  - Render sales transactions
  - Format currency and dates
  - Display status badges with styling
  - Handle empty state
  - Responsive table design

**Sorting.jsx**
- **Purpose**: Sort control component
- **Responsibilities**:
  - Display sort field dropdown
  - Toggle sort order (asc/desc)
  - Communicate sort changes to parent

**Pagination.jsx**
- **Purpose**: Page navigation controls
- **Responsibilities**:
  - Display current page information
  - Render page number buttons
  - Handle previous/next navigation
  - Show pagination metadata

#### Services

**apiService.js**
- **Purpose**: API communication layer
- **Responsibilities**:
  - Configure Axios instance with base URL
  - Make HTTP requests to backend
  - Handle API errors
  - Transform responses
- **Key Functions**:
  - `fetchSales()`: Fetch sales data with query parameters
  - `fetchFilterOptions()`: Fetch available filter options

#### Styles
- Component-specific CSS files for modular styling
- Global styles in `index.css`
- Responsive design with media queries
- Modern UI with gradients and shadows

### Data Flow

1. **Initial Load**:
   - App component mounts
   - `useEffect` triggers `fetchFilterOptions()`
   - Filter options are stored in state
   - Another `useEffect` triggers `fetchSales()` with default parameters
   - Sales data and pagination info are stored in state
   - Components render with data

2. **User Interaction Flow**:
   - User interacts with SearchBar, FilterPanel, Sorting, or Pagination
   - Component calls parent handler function (e.g., `handleSearch`, `handleFilterChange`)
   - Parent updates state (e.g., `setSearchQuery`, `setFilters`)
   - `useEffect` detects state change
   - New API request is made with updated parameters
   - Response updates sales data and pagination
   - UI re-renders with new data

3. **State Synchronization**:
   - All user interactions update centralized state in App.jsx
   - State changes trigger API requests
   - API responses update display state
   - Components receive updated props and re-render

## Data Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP Request (GET /api/sales?search=...&filters=...)
       │
       ▼
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌───────────────────────────────┐  │
│  │      App.jsx (State Mgmt)     │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │    apiService.js (Axios)      │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               │ HTTP Request
               ▼
┌─────────────────────────────────────┐
│      Backend (Express.js)            │
│  ┌───────────────────────────────┐  │
│  │   routes/salesRoutes.js       │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │  controllers/salesController  │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   services/dataService.js      │  │
│  │   (getAllSalesData)            │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   utils/filterUtils.js         │  │
│  │   applySearch → applyFilters   │  │
│  │   → applySorting → pagination  │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
               │ JSON Response
               ▼
┌─────────────┐
│   Client    │
│  (Browser)  │
└─────────────┘
```

## Key Design Decisions

### Backend
1. **In-Memory Data Storage**: CSV data is loaded once at startup and kept in memory for fast access. Suitable for datasets that fit in memory.
2. **Layered Architecture**: Clear separation allows for easy testing and maintenance.
3. **Pure Utility Functions**: Filter, sort, and pagination utilities are pure functions, making them testable and reusable.
4. **Sequential Processing**: Search → Filters → Sort → Pagination ensures correct results.

### Frontend
1. **Centralized State**: All state managed in App.jsx simplifies data flow and debugging.
2. **Component Composition**: Small, focused components improve reusability and maintainability.
3. **Automatic Refetching**: `useEffect` hooks automatically refetch data when dependencies change.
4. **Responsive Design**: CSS Grid and Flexbox ensure the UI works on various screen sizes.

## Performance Considerations

1. **Backend**:
   - Data loaded once at startup (no repeated file I/O)
   - Efficient array filtering and sorting
   - Pagination reduces response payload size

2. **Frontend**:
   - React's virtual DOM for efficient rendering
   - Debouncing could be added for search input
   - Pagination limits rendered items

## Future Enhancements

1. **Backend**:
   - Database integration for larger datasets
   - Caching layer (Redis)
   - API rate limiting
   - Data indexing for faster searches

2. **Frontend**:
   - Search input debouncing
   - Loading skeletons
   - Error boundaries
   - Optimistic UI updates
   - Virtual scrolling for large tables

