import { getAllSalesData, getFilterOptions } from '../services/dataService.js';
import { applySearch, applyFilters, applySorting, applyPagination } from '../utils/filterUtils.js';

/**
 * Get sales data with search, filters, sorting, and pagination
 */
export const getSales = async (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      pageSize = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      regions,
      genders,
      minAge,
      maxAge,
      categories,
      tags,
      paymentMethods,
      orderStatus,
      startDate,
      endDate,
    } = req.query;

    // Get all data
    let data = getAllSalesData();

    // Apply search
    if (search) {
      data = applySearch(data, search);
    }

    // Build filters object
    const filters = {};
    if (regions) {
      filters.regions = Array.isArray(regions) ? regions : [regions];
    }
    if (genders) {
      filters.genders = Array.isArray(genders) ? genders : [genders];
    }
    if (minAge !== undefined && minAge !== null && minAge !== '') {
      const parsedMinAge = parseInt(minAge);
      if (!isNaN(parsedMinAge) && parsedMinAge >= 0) {
        filters.minAge = parsedMinAge;
      }
    }
    if (maxAge !== undefined && maxAge !== null && maxAge !== '') {
      const parsedMaxAge = parseInt(maxAge);
      if (!isNaN(parsedMaxAge) && parsedMaxAge >= 0) {
        filters.maxAge = parsedMaxAge;
      }
    }
    if (categories) {
      filters.categories = Array.isArray(categories) ? categories : [categories];
    }
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }
    if (paymentMethods) {
      filters.paymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods];
    }
    if (orderStatus) {
      filters.orderStatus = Array.isArray(orderStatus) ? orderStatus : [orderStatus];
    }
    if (startDate) {
      filters.startDate = startDate;
    }
    if (endDate) {
      filters.endDate = endDate;
    }

    // Apply filters
    data = applyFilters(data, filters);

    // Apply sorting
    data = applySorting(data, sortBy, sortOrder);

    // Apply pagination
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const result = applyPagination(data, pageNum, pageSizeNum);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data',
      error: error.message,
    });
  }
};

/**
 * Get filter options
 */
export const getFilters = async (req, res) => {
  try {
    const options = getFilterOptions();
    res.json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message,
    });
  }
};
