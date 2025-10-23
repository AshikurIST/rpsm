import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  value = '', 
  onChange, 
  onClear,
  placeholder = 'Search...', 
  className = '',
  autoFocus = false
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder-gray-400 text-sm
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          type="button"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
