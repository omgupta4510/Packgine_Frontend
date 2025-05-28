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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};