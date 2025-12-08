import '../styles/FilterDropdowns.css';

const FilterDropdowns = ({ filterOptions, filters, onFilterChange, onRefresh, sortBy, sortOrder, onSortChange }) => {
  // Show dropdowns even while loading, with empty options
  const safeFilterOptions = filterOptions || {
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    minAge: 0,
    maxAge: 100,
    minDate: '',
    maxDate: '',
  };

  const handleDropdownChange = (filterType, value) => {
    if (value === '') {
      onFilterChange(filterType, []);
    } else {
      onFilterChange(filterType, [value]);
    }
  };

  const getSelectedValue = (filterType) => {
    const values = filters[filterType] || [];
    return values.length > 0 ? values[0] : '';
  };

  return (
    <div className="filter-dropdowns-container">
      <button 
        className="refresh-btn" 
        onClick={onRefresh} 
        title="Refresh"
      >
        🔄
      </button>
      <div className="filter-dropdowns">
      <select
        className="filter-dropdown"
        value={getSelectedValue('regions')}
        onChange={(e) => handleDropdownChange('regions', e.target.value)}
      >
        <option value="">Customer Region</option>
        {safeFilterOptions.regions.map(region => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>

      <select
        className="filter-dropdown"
        value={getSelectedValue('genders')}
        onChange={(e) => handleDropdownChange('genders', e.target.value)}
      >
        <option value="">Gender</option>
        {safeFilterOptions.genders.map(gender => (
          <option key={gender} value={gender}>{gender}</option>
        ))}
      </select>

      <select
        className="filter-dropdown"
        value={filters.minAge && filters.maxAge ? `${filters.minAge}-${filters.maxAge}` : ''}
        onChange={(e) => {
          if (e.target.value) {
            const [min, max] = e.target.value.split('-');
            onFilterChange('minAge', parseInt(min));
            onFilterChange('maxAge', parseInt(max));
          } else {
            onFilterChange('minAge', null);
            onFilterChange('maxAge', null);
          }
        }}
      >
        <option value="">Age Range</option>
        {filterOptions && (
          <option value={`${safeFilterOptions.minAge}-${safeFilterOptions.maxAge}`}>
            {safeFilterOptions.minAge} - {safeFilterOptions.maxAge}
          </option>
        )}
      </select>

      <select
        className="filter-dropdown"
        value={getSelectedValue('categories')}
        onChange={(e) => handleDropdownChange('categories', e.target.value)}
      >
        <option value="">Product Category</option>
        {safeFilterOptions.categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <select
        className="filter-dropdown"
        value={getSelectedValue('tags')}
        onChange={(e) => handleDropdownChange('tags', e.target.value)}
      >
        <option value="">Tags</option>
        {safeFilterOptions.tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      <select
        className="filter-dropdown"
        value={getSelectedValue('paymentMethods')}
        onChange={(e) => handleDropdownChange('paymentMethods', e.target.value)}
      >
        <option value="">Payment Method</option>
        {safeFilterOptions.paymentMethods.map(method => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>

      <select
        className="filter-dropdown"
        value={filters.startDate && filters.endDate ? `${filters.startDate}-${filters.endDate}` : ''}
        onChange={(e) => {
          if (e.target.value) {
            const [start, end] = e.target.value.split('-');
            onFilterChange('startDate', start);
            onFilterChange('endDate', end);
          } else {
            onFilterChange('startDate', '');
            onFilterChange('endDate', '');
          }
        }}
      >
        <option value="">Date</option>
        {filterOptions && (
          <option value={`${safeFilterOptions.minDate}-${safeFilterOptions.maxDate}`}>
            {safeFilterOptions.minDate} - {safeFilterOptions.maxDate}
          </option>
        )}
      </select>

      <select
        className="filter-dropdown"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="customerName">Sort by: Customer Name (A-Z)</option>
        <option value="date">Date (Newest First)</option>
        <option value="quantity">Quantity</option>
      </select>
      </div>
    </div>
  );
};

export default FilterDropdowns;
