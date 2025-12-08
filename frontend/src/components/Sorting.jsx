import '../styles/Sorting.css';

const Sorting = ({ sortBy, sortOrder, onSortChange }) => {
  const sortOptions = [
    { value: 'date', label: 'Date (Newest First)', order: 'desc' },
    { value: 'quantity', label: 'Quantity', order: 'desc' },
    { value: 'customerName', label: 'Customer Name (A-Z)', order: 'asc' },
  ];

  const getDisplayValue = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    if (option) {
      return option.value === 'customerName' ? 'Customer Name (A-Z)' : option.label;
    }
    return 'Customer Name (A-Z)';
  };

  return (
    <div className="sorting-container">
      <label className="sorting-label">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => {
          const selectedOption = sortOptions.find(opt => opt.value === e.target.value);
          onSortChange(e.target.value);
        }}
        className="sorting-dropdown"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sorting;

