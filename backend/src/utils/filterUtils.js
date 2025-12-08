/**
 * Apply search filter (case-insensitive)
 * Searches in Customer Name and Phone Number
 */
export const applySearch = (data, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return data;
  }

  const query = searchQuery.toLowerCase().trim();

  return data.filter(item => {
    const customerName = (item['Customer Name'] || '').toLowerCase();
    const phoneNumber = (item['Phone Number'] || '').toLowerCase();
    
    return customerName.includes(query) || phoneNumber.includes(query);
  });
};

/**
 * Apply filters
 */
export const applyFilters = (data, filters) => {
  let filtered = [...data];

  // Customer Region filter
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter(item => 
      filters.regions.includes(item['Customer Region'])
    );
  }

  // Gender filter
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter(item => 
      filters.genders.includes(item.Gender)
    );
  }

  // Age Range filter with validation
  if (filters.minAge !== undefined && filters.minAge !== null) {
    const minAge = parseInt(filters.minAge);
    if (!isNaN(minAge) && minAge >= 0) {
      filtered = filtered.filter(item => {
        const age = parseInt(item.Age) || 0;
        return age >= minAge;
      });
    }
  }
  if (filters.maxAge !== undefined && filters.maxAge !== null) {
    const maxAge = parseInt(filters.maxAge);
    if (!isNaN(maxAge) && maxAge >= 0) {
      filtered = filtered.filter(item => {
        const age = parseInt(item.Age) || 0;
        return age <= maxAge;
      });
    }
  }

  // Product Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(item => 
      filters.categories.includes(item['Product Category'])
    );
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(item => {
      if (!item.Tags) return false;
      const itemTags = item.Tags.split(',').map(tag => tag.trim());
      return filters.tags.some(filterTag => itemTags.includes(filterTag));
    });
  }

  // Payment Method filter
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    filtered = filtered.filter(item => 
      filters.paymentMethods.includes(item['Payment Method'])
    );
  }

  // Order Status filter
  if (filters.orderStatus && filters.orderStatus.length > 0) {
    filtered = filtered.filter(item => 
      filters.orderStatus.includes(item['Order Status'])
    );
  }

  // Date Range filter
  if (filters.startDate) {
    filtered = filtered.filter(item => item.Date >= filters.startDate);
  }
  if (filters.endDate) {
    filtered = filtered.filter(item => item.Date <= filters.endDate);
  }

  return filtered;
};

/**
 * Apply sorting
 */
export const applySorting = (data, sortBy, sortOrder = 'desc') => {
  const sorted = [...data];

  sorted.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = a.Date || '';
        bValue = b.Date || '';
        if (sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);

      case 'quantity':
        aValue = a.Quantity || 0;
        bValue = b.Quantity || 0;
        if (sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;

      case 'customerName':
        aValue = (a['Customer Name'] || '').toLowerCase();
        bValue = (b['Customer Name'] || '').toLowerCase();
        if (sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);

      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Apply pagination
 */
export const applyPagination = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      pageSize,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      hasNextPage: endIndex < data.length,
      hasPreviousPage: page > 1,
    },
  };
};
