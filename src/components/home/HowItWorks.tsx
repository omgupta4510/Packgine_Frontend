import { Search, ShoppingBag, FileText, CreditCard } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-berlin-red-600" />,
      title: 'Search',
      description: 'Find sustainable packaging solutions that match your product needs and environmental goals.',
      color: 'bg-berlin-red-50',
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-berlin-red-600" />,
      title: 'Sample',
      description: 'Request physical samples to test fit, function, and quality with your products.',
      color: 'bg-berlin-red-100',
    },
    {
      icon: <FileText className="w-12 h-12 text-berlin-red-600" />,
      title: 'Quote',
      description: 'Get customized price quotes directly from verified suppliers.',
      color: 'bg-berlin-red-50',
    },
    {
      icon: <CreditCard className="w-12 h-12 text-berlin-red-600" />,
      title: 'Buy',
      description: 'Place your order and track it from production through delivery.',
      color: 'bg-berlin-red-100',
    },
  ];

  return (
    <section className="py-24 bg-berlin-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-berlin-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-berlin-gray-600 max-w-3xl mx-auto font-medium">
            From discovery to delivery, we've simplified the packaging procurement process.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-berlin-red-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center transition-all hover:translate-y-[-8px] duration-300 group"
              >
                <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-berlin-red-200`}>
                  {step.icon}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md group-hover:shadow-lg transition-shadow duration-300 border border-berlin-gray-200">
                  <h3 className="text-2xl font-bold text-berlin-gray-800 mb-4">{step.title}</h3>
                  <p className="text-berlin-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <svg className="w-8 h-8 text-berlin-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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