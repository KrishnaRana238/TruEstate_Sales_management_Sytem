import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import FilterDropdowns from './components/FilterDropdowns';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import { fetchSales, fetchFilterOptions } from './services/apiService';
import './styles/App.css';

function App() {
  const [sales, setSales] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    minAge: null,
    maxAge: null,
    categories: [],
    tags: [],
    paymentMethods: [],
    orderStatus: [],
    startDate: '',
    endDate: '',
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('customerName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const pageSize = 10;

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch sales data when filters/search/sort/page changes
  const loadSalesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchQuery,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
      };

      if (filters.regions.length > 0) {
        params.regions = filters.regions;
      }
      if (filters.genders.length > 0) {
        params.genders = filters.genders;
      }
      if (filters.minAge !== null) {
        params.minAge = filters.minAge;
      }
      if (filters.maxAge !== null) {
        params.maxAge = filters.maxAge;
      }
      if (filters.categories.length > 0) {
        params.categories = filters.categories;
      }
      if (filters.tags.length > 0) {
        params.tags = filters.tags;
      }
      if (filters.paymentMethods.length > 0) {
        params.paymentMethods = filters.paymentMethods;
      }
      if (filters.orderStatus.length > 0) {
        params.orderStatus = filters.orderStatus;
      }
      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await fetchSales(params);
      setSales(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load sales data');
      console.error('Error loading sales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, [searchQuery, filters, sortBy, sortOrder, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setFilters({
      regions: [],
      genders: [],
      minAge: null,
      maxAge: null,
      categories: [],
      tags: [],
      paymentMethods: [],
      orderStatus: [],
      startDate: '',
      endDate: '',
    });
    setSortBy('customerName');
    setSortOrder('asc');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    switch (activePage) {
      case 'dashboard':
        setFilters({
          regions: [],
          genders: [],
          minAge: null,
          maxAge: null,
          categories: [],
          tags: [],
          paymentMethods: [],
          orderStatus: [],
          startDate: '',
          endDate: '',
        });
        setSortBy('customerName');
        setSortOrder('asc');
        setCurrentPage(1);
        break;
      case 'nexus':
        setFilters({
          regions: [],
          genders: [],
          minAge: null,
          maxAge: null,
          categories: [],
          tags: [],
          paymentMethods: [],
          orderStatus: [],
          startDate: '',
          endDate: '',
        });
        setCurrentPage(1);
        break;
      case 'intake':
        setFilters(prev => ({ ...prev, orderStatus: ['Pending'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'services:pre-active':
        setFilters(prev => ({ ...prev, orderStatus: ['Pending'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'services:active':
        setFilters(prev => ({ ...prev, orderStatus: ['Completed'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'services:blocked':
        setFilters(prev => ({ ...prev, orderStatus: ['Cancelled'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'services:closed':
        setFilters(prev => ({ ...prev, orderStatus: ['Returned'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'invoices:proforma':
        setFilters(prev => ({ ...prev, orderStatus: ['Pending'], tags: [] }));
        setCurrentPage(1);
        break;
      case 'invoices:final':
        setFilters(prev => ({ ...prev, orderStatus: ['Completed'], tags: [] }));
        setCurrentPage(1);
        break;
      default:
        // Do not mutate filters on unrelated pages
        break;
    }
  }, [activePage]);

  return (
    <div className="app">
      <Sidebar onNavigate={setActivePage} />
      
      <div className="main-content">
        <header className="main-header">
          <h1>Sales Management System</h1>
          <div className="header-search">
            <SearchBar onSearch={handleSearch} />
          </div>
        </header>

        <div className="content-body">
          <div className="filters-section">
            <FilterDropdowns
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onRefresh={handleRefresh}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          <SummaryCards sales={sales} pagination={pagination} />

          <div className="table-section">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && (
              <>
                <TransactionTable sales={sales} />
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
