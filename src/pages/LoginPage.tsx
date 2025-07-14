import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser } from '../utils/userAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await loginUser(email, password);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-berlin-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-8">
          <img 
            src="/Berlin_Logo.png" 
            alt="Berlin Packaging Logo" 
            className="w-12 h-12 mr-3 rounded-full border border-berlin-gray-300" 
          />
          <span className="text-2xl font-bold text-berlin-gray-900">Berlin Packaging</span>
        </Link>
        <h2 className="text-center text-3xl font-bold text-berlin-gray-900">
          Welcome back
        </h2>
        <p className="mt-4 text-center text-sm text-berlin-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-berlin-red-600 hover:text-berlin-red-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl border border-berlin-gray-200 sm:rounded-xl sm:px-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-berlin-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-berlin-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="berlin-input pl-12"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-berlin-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-berlin-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="berlin-input pl-12"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-berlin-red-600 focus:ring-berlin-red-500 border-berlin-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-berlin-gray-700 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-berlin-red-600 hover:text-berlin-red-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-berlin-red-600 hover:bg-berlin-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berlin-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-berlin-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-berlin-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-berlin-gray-300 rounded-lg shadow-sm bg-white text-sm font-semibold text-berlin-gray-700 hover:bg-berlin-gray-50 transition-colors">
                Google
              </button>
              <button className="w-full inline-flex justify-center py-3 px-4 border border-berlin-gray-300 rounded-lg shadow-sm bg-white text-sm font-semibold text-berlin-gray-700 hover:bg-berlin-gray-50 transition-colors">
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};