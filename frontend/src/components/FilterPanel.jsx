import '../styles/FilterPanel.css';

const FilterPanel = ({ filterOptions, filters, onFilterChange }) => {
  if (!filterOptions) {
    return <div className="filter-panel">Loading filter options...</div>;
  }

  const handleMultiSelect = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    const newValues = checked ? [...currentValues, value] : currentValues.filter((item) => item !== value);
    onFilterChange(filterType, newValues);
  };

  const handleAgeRange = (type, value) => {
    const numValue = value === '' ? null : parseInt(value);
    onFilterChange(type, numValue);
  };

  const handleDateRange = (type, value) => {
    onFilterChange(type, value);
  };

  const clearFilter = (filterType) => {
    if (filterType === 'minAge' || filterType === 'maxAge') {
      onFilterChange(filterType, null);
    } else if (filterType === 'startDate' || filterType === 'endDate') {
      onFilterChange(filterType, '');
    } else {
      onFilterChange(filterType, []);
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-content">
        <div className="filter-group">
          <label className="filter-group-label">Customer Region</label>
          <div className="filter-checkboxes">
            {filterOptions.regions.map((region) => (
              <label key={region} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.regions.includes(region)}
                  onChange={(e) => handleMultiSelect('regions', region, e.target.checked)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
          {filters.regions.length > 0 && (
            <button onClick={() => clearFilter('regions')} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Gender</label>
          <div className="filter-checkboxes">
            {filterOptions.genders.map((gender) => (
              <label key={gender} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.genders.includes(gender)}
                  onChange={(e) => handleMultiSelect('genders', gender, e.target.checked)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
          {filters.genders.length > 0 && (
            <button onClick={() => clearFilter('genders')} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Age Range</label>
          <div className="filter-range">
            <input
              type="number"
              placeholder="Min"
              min={filterOptions.minAge}
              max={filterOptions.maxAge}
              value={filters.minAge || ''}
              onChange={(e) => handleAgeRange('minAge', e.target.value)}
              className="filter-range-input"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              min={filterOptions.minAge}
              max={filterOptions.maxAge}
              value={filters.maxAge || ''}
              onChange={(e) => handleAgeRange('maxAge', e.target.value)}
              className="filter-range-input"
            />
          </div>
          {(filters.minAge !== null || filters.maxAge !== null) && (
            <button onClick={() => { clearFilter('minAge'); clearFilter('maxAge'); }} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Product Category</label>
          <div className="filter-checkboxes">
            {filterOptions.categories.map((category) => (
              <label key={category} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => handleMultiSelect('categories', category, e.target.checked)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
          {filters.categories.length > 0 && (
            <button onClick={() => clearFilter('categories')} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Tags</label>
          <div className="filter-checkboxes">
            {filterOptions.tags.map((tag) => (
              <label key={tag} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => handleMultiSelect('tags', tag, e.target.checked)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
          {filters.tags.length > 0 && (
            <button onClick={() => clearFilter('tags')} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Payment Method</label>
          <div className="filter-checkboxes">
            {filterOptions.paymentMethods.map((method) => (
              <label key={method} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.paymentMethods.includes(method)}
                  onChange={(e) => handleMultiSelect('paymentMethods', method, e.target.checked)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          {filters.paymentMethods.length > 0 && (
            <button onClick={() => clearFilter('paymentMethods')} className="clear-filter">Clear</button>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-group-label">Date Range</label>
          <div className="filter-range">
            <input
              type="date"
              min={filterOptions.minDate}
              max={filterOptions.maxDate}
              value={filters.startDate}
              onChange={(e) => handleDateRange('startDate', e.target.value)}
              className="filter-range-input"
            />
            <span>to</span>
            <input
              type="date"
              min={filterOptions.minDate}
              max={filterOptions.maxDate}
              value={filters.endDate}
              onChange={(e) => handleDateRange('endDate', e.target.value)}
              className="filter-range-input"
            />
          </div>
          {(filters.startDate || filters.endDate) && (
            <button onClick={() => { clearFilter('startDate'); clearFilter('endDate'); }} className="clear-filter">Clear</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
