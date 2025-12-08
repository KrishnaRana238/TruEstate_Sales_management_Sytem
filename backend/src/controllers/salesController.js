import { getAllSalesData, getFilterOptions } from '../services/dataService.js';
import { applySearch, applyFilters, applySorting, applyPagination } from '../utils/filterUtils.js';
import { querySales, getFilterOptionsDB } from '../services/dbService.js';

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

    if (process.env.USE_DB === 'true') {
      const result = await querySales({
        search,
        page,
        pageSize,
        sortBy,
        sortOrder,
        regions: regions ? (Array.isArray(regions) ? regions : [regions]) : undefined,
        genders: genders ? (Array.isArray(genders) ? genders : [genders]) : undefined,
        minAge: minAge !== undefined && minAge !== null && minAge !== '' ? parseInt(minAge) : undefined,
        maxAge: maxAge !== undefined && maxAge !== null && maxAge !== '' ? parseInt(maxAge) : undefined,
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
        paymentMethods: paymentMethods ? (Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods]) : undefined,
        orderStatus: orderStatus ? (Array.isArray(orderStatus) ? orderStatus : [orderStatus]) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const mapped = result.data.map((r) => ({
        'Transaction ID': r.TransactionID,
        Date: r.Date,
        'Customer ID': r.CustomerID,
        'Customer Name': r.CustomerName,
        'Phone Number': r.PhoneNumber,
        Gender: r.Gender,
        Age: r.Age,
        'Customer Region': r.CustomerRegion,
        'Customer Type': r.CustomerType,
        'Product ID': r.ProductID,
        'Product Name': r.ProductName,
        Brand: r.Brand,
        'Product Category': r.ProductCategory,
        Tags: r.Tags,
        Quantity: r.Quantity,
        'Price per Unit': Number(r.PricePerUnit),
        'Discount Percentage': Number(r.DiscountPercentage),
        'Total Amount': Number(r.TotalAmount),
        'Final Amount': Number(r.FinalAmount),
        'Payment Method': r.PaymentMethod,
        'Order Status': r.OrderStatus,
        'Delivery Type': r.DeliveryType,
        'Store ID': r.StoreID,
        'Store Location': r.StoreLocation,
        'Salesperson ID': r.SalespersonID,
        'Employee Name': r.EmployeeName,
      }));
      return res.json({ success: true, data: mapped, pagination: result.pagination });
    }

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
    const options = process.env.USE_DB === 'true' ? await getFilterOptionsDB() : getFilterOptions();
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
