import { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };


  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Name, Phone no."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      
    </div>
  );
};

export default SearchBar;
