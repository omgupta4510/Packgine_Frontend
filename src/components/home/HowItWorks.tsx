import React from 'react';
import { Search, ShoppingBag, FileText, CreditCard } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-green-500" />,
      title: 'Search',
      description: 'Find sustainable packaging solutions that match your product needs and environmental goals.',
      color: 'bg-green-50',
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-green-500" />,
      title: 'Sample',
      description: 'Request physical samples to test fit, function, and quality with your products.',
      color: 'bg-green-100',
    },
    {
      icon: <FileText className="w-12 h-12 text-green-500" />,
      title: 'Quote',
      description: 'Get customized price quotes directly from verified suppliers.',
      color: 'bg-green-50',
    },
    {
      icon: <CreditCard className="w-12 h-12 text-green-500" />,
      title: 'Buy',
      description: 'Place your order and track it from production through delivery.',
      color: 'bg-green-100',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From discovery to delivery, we've simplified the packaging procurement process.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-green-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center transition-transform hover:translate-y-[-8px] duration-300"
              >
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-sm`}>
                  {step.icon}
                </div>
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};