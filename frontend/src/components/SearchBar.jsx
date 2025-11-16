import React, { useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useProductStore } from '../store/useProduct';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useProductStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <SearchIcon className="size-4 sm:size-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="input input-bordered w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base focus:input-primary transition-all duration-200 bg-base-100/80 backdrop-blur-sm"
          value={localQuery}
          onChange={handleSearch}
        />
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:bg-base-200 rounded-r-lg transition-colors"
          >
            <XIcon className="size-4 sm:size-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

