import React, { useState } from 'react';
import { Search } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  className?: string;
};

export const SearchBar = ({
  placeholder = 'Search sustainable packaging',
  onSearch,
  className = '',
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`relative w-full max-w-3xl ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-berlin-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-3 py-4 border-2 border-berlin-gray-200 rounded-lg bg-white text-berlin-gray-700 focus:outline-none focus:ring-2 focus:ring-berlin-red-500 focus:border-berlin-red-500 transition duration-300 text-lg shadow-sm"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-berlin-red-500 hover:bg-berlin-red-600 text-white rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};