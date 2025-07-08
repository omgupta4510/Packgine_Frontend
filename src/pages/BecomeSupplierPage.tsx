import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { Building2, Star, ArrowRight, CheckCircle, DollarSign, BarChart3, Shield } from 'lucide-react';

export const BecomeSupplierPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate('/supplier/dashboard');
    }
  }, [navigate]);

  const handleGetStarted = () => {
    navigate('/supplier/auth');
  };

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: 'Increase Sales',
      description: 'Reach a wider audience of eco-conscious buyers looking for sustainable packaging solutions.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Analytics & Insights',
      description: 'Get detailed analytics on your product performance and customer engagement.'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: 'Verified Platform',
      description: 'Join a trusted marketplace with verified suppliers and secure transactions.'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: 'Build Reputation',
      description: 'Showcase your eco-friendly products and build a strong reputation with customer reviews.'
    }
  ];

  const features = [
    'Easy product listing and management',
    'Integrated payment processing',
    'Order management system',
    'Customer communication tools',
    'Marketing and promotional tools',
    'Detailed sales analytics',
    'Mobile-responsive dashboard',
    'Multi-language support'
  ];

  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up with your business details and get verified'
    },
    {
      number: 2,
      title: 'Add Products',
      description: 'List your eco-friendly packaging products with detailed specifications'
    },
    {
      number: 3,
      title: 'Start Selling',
      description: 'Connect with buyers and start processing orders through our platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 my-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Join Packgine as a Supplier
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Connect with eco-conscious buyers worldwide and grow your sustainable packaging business on our trusted marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <Building2 className="w-24 h-24 text-white mx-auto mb-4" />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">Join 500+ Suppliers</h3>
                  <p className="text-green-100">Already selling on Packgine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Packgine?</h2>
          <p className="text-xl text-gray-600">Everything you need to succeed in the eco-packaging market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful Tools for Your Business
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive supplier dashboard gives you everything you need to manage your business efficiently and grow your sales.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Supplier Dashboard</h4>
                    <p className="text-sm text-gray-600">Manage everything in one place</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products Listed</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-semibold">1,429</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-green-600">$54,780</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Get started in just 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-400 mx-auto mt-6 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of suppliers already growing their business on Packgine
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg flex items-center gap-2 mx-auto"
          >
            Create Your Supplier Account
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-green-100 mt-4">
            Free to join • No monthly fees • Only pay when you sell
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Active Suppliers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
