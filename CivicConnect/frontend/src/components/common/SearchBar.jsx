import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search by keyword, reference ID, category, or address...',
  className = '',
  onClear
}) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-9 py-2 rounded-lg border border-slate-300 bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
