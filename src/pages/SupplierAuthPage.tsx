import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSupplier, registerSupplier, isAuthenticated, RegisterData } from '../utils/auth';
import { Eye, EyeOff, Building2, Mail, Lock, User, MapPin, Tag } from 'lucide-react';

const SupplierAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    username: '',
    companyName: '',
    companyDescription: '',
    contactInfo: {
      primaryContact: {
        name: '',
        email: '',
        phone: '',
      },
    },
    address: {
      country: '',
      city: '',
      state: '',
    },
    categories: [],
  });

  // Available categories (you can fetch this from API later)
  const availableCategories = [
    'Bottle',
    'Cap',
    'Jar',
    'Tube',
    'Pouch',
    'Container',
    'Label',
    'Box',
    'Bag',
    'Wrapper',
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/supplier/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginSupplier(loginData.email, loginData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/supplier/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await registerSupplier(registerData);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/supplier/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategorySelection = (category: string) => {
    setRegisterData(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your supplier account' : 'Create your supplier account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                    Email address *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="pl-10 pr-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      required
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                    Company Description
                  </label>
                  <textarea
                    id="companyDescription"
                    rows={3}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your company and products..."
                    value={registerData.companyDescription}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, companyDescription: e.target.value }))}
                  />
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Contact Information</h3>
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Person Name
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={registerData.contactInfo?.primaryContact?.name || ''}
                    onChange={(e) => setRegisterData(prev => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        primaryContact: {
                          ...prev.contactInfo?.primaryContact,
                          name: e.target.value
                        }
                      }
                    }))}
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={registerData.contactInfo?.primaryContact?.phone || ''}
                    onChange={(e) => setRegisterData(prev => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        primaryContact: {
                          ...prev.contactInfo?.primaryContact,
                          phone: e.target.value
                        }
                      }
                    }))}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Address</h3>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="country"
                      type="text"
                      className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={registerData.address?.country || ''}
                      onChange={(e) => setRegisterData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          country: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={registerData.address?.city || ''}
                    onChange={(e) => setRegisterData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: e.target.value
                      }
                    }))}
                  />
                </div>

                {/* Categories */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Product Categories</h3>
                  <p className="text-sm text-gray-600 mb-4">Select the categories you specialize in:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {availableCategories.map((category) => (
                      <label key={category} className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={registerData.categories?.includes(category) || false}
                          onChange={() => toggleCategorySelection(category)}
                        />
                        <div className={`
                          flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
                          ${registerData.categories?.includes(category)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }
                          border
                        `}>
                          <Tag className="h-4 w-4 mr-1" />
                          {category}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierAuthPage;
