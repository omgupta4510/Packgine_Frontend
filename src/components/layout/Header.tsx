import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X, Leaf, Settings, LogOut, BarChart3, User } from 'lucide-react';
import { isAuthenticated, logoutSupplier } from '../../utils/auth';
import { isUserAuthenticated, logoutUser, getUserData } from '../../utils/userAuth';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supplierAuthenticated, setSupplierAuthenticated] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setSupplierAuthenticated(isAuthenticated());
      setUserAuthenticated(isUserAuthenticated());
      
      // Get user data if user is authenticated
      if (isUserAuthenticated()) {
        const data = getUserData();
        setUserData(data);
      } else {
        setUserData(null);
      }
    };
    
    // Check initial auth state
    checkAuth();
    
    // Listen for storage changes (when token is added/removed)
    window.addEventListener('storage', checkAuth);
    
    // Also listen for a custom event we'll dispatch when auth changes
    window.addEventListener('authStateChanged', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  // Handle supplier logout
  const handleSupplierLogout = async () => {
    try {
      await logoutSupplier();
      setSupplierAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Supplier logout error:', error);
    }
  };

  // Handle user logout
  const handleUserLogout = async () => {
    try {
      await logoutUser();
      setUserAuthenticated(false);
      setUserData(null);
      navigate('/');
    } catch (error) {
      console.error('User logout error:', error);
    }
  };

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
    { name: 'Suppliers', path: '/become-supplier' },
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
            {supplierAuthenticated ? (
              // Supplier is logged in
              <>
                <Button variant="outline" size="sm" href="/supplier/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" href="/supplier/profile" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleSupplierLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : userAuthenticated ? (
              // User is logged in
              <>
                <Button variant="outline" size="sm" href="/dashboard" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
                <span className="text-sm text-gray-600">
                  Welcome, {userData?.firstName || 'User'}!
                </span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleUserLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              // No one is logged in
              <>
                <Button variant="outline" size="sm" href="/login">Login</Button>
                <Button variant="primary" size="sm" href="/signup">Sign Up</Button>
                <Button variant="secondary" size="sm" href="/supplier/auth">Supplier Login</Button>
              </>
            )}
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
              {supplierAuthenticated ? (
                // Supplier is logged in
                <>
                  <Button variant="outline" size="sm" href="/supplier/dashboard" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" href="/supplier/profile" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleSupplierLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : userAuthenticated ? (
                // User is logged in
                <>
                  <span className="text-sm text-gray-600 px-3 py-2">
                    Welcome, {userData?.firstName || 'User'}!
                  </span>
                  <Button variant="outline" size="sm" href="/dashboard" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleUserLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                // No one is logged in
                <>
                  <Button variant="outline" size="sm" href="/login">Login</Button>
                  <Button variant="primary" size="sm" href="/signup">Sign Up</Button>
                  <Button variant="secondary" size="sm" href="/supplier/auth">Supplier Login</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search bar - on scrolled state */}
      {/* {isScrolled && (
        <div className="bg-green-50 py-3 border-t border-green-100">
          <div className="container mx-auto px-4">
            <SearchBar />
          </div>
        </div>
      )} */}
    </header>
  );
};