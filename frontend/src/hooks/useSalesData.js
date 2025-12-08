import { useState, useEffect } from 'react';
import { fetchSales, fetchFilterOptions } from '../services/apiService';

/**
 * Custom hook for managing sales data
 */
export const useSalesData = (params) => {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSales = async () => {
      setLoading(true);
      setError(null);

      try {
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

    loadSales();
  }, [params]);

  return { sales, pagination, loading, error };
};

/**
 * Custom hook for filter options
 */
export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        setError(err.message || 'Failed to load filter options');
        console.error('Error loading filter options:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  return { filterOptions, loading, error };
};

