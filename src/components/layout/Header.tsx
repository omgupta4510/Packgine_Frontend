import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/Button';
import { SearchBar } from '../ui/SearchBar';
import { Menu, X, Leaf } from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Suppliers', path: '/suppliers' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Leaf className="w-8 h-8 text-green-500 mr-2" />
            <span className="text-xl font-semibold text-gray-900">Packgine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-green-700 border-b-2 border-green-500' 
                      : 'text-gray-600 hover:text-green-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" href="/login">Login</Button>
            <Button variant="primary" size="sm" href="/signup">Sign Up</Button>
            <Button variant="secondary" size="sm" href="/become-supplier">Become a Supplier</Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3 mb-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `py-2 px-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" href="/login">Login</Button>
              <Button variant="primary" size="sm" href="/signup">Sign Up</Button>
              <Button variant="secondary" size="sm" href="/become-supplier">Become a Supplier</Button>
            </div>
          </div>
        </div>
      )}

      {/* Search bar - on scrolled state */}
      {isScrolled && (
        <div className="bg-green-50 py-3 border-t border-green-100">
          <div className="container mx-auto px-4">
            <SearchBar />
          </div>
        </div>
      )}
    </header>
  );
};