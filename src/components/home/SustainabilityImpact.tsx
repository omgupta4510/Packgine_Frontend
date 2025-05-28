import React, { useEffect, useRef } from 'react';
import { Leaf, Droplets, Recycle, Award } from 'lucide-react';

export const SustainabilityImpact = () => {
  const countersRef = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted.current) {
          countUp();
          counted.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => {
      if (countersRef.current) observer.unobserve(countersRef.current);
    };
  }, []);

  const countUp = () => {
    const counters = document.querySelectorAll('.counter-value');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const count = { value: 0 };
      
      const animate = () => {
        const element = counter as HTMLElement;
        element.innerText = Math.ceil(count.value).toLocaleString();
      };
      
      const duration = 2000;
      const start = performance.now();
      
      const step = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        count.value = progress * target;
        animate();
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    });
  };

  const impactStats = [
    {
      icon: <Leaf className="w-12 h-12 text-green-500" />,
      value: 32500000,
      label: 'Pounds of CO2 Saved',
      suffix: '+',
    },
    {
      icon: <Droplets className="w-12 h-12 text-blue-500" />,
      value: 420000000,
      label: 'Gallons of Water Conserved',
      suffix: '+',
    },
    {
      icon: <Recycle className="w-12 h-12 text-teal-500" />,
      value: 18000000,
      label: 'Pounds of Plastic Diverted',
      suffix: '+',
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-500" />,
      value: 5000,
      label: 'Brands Making an Impact',
      suffix: '+',
    }
  ];

  return (
    <section className="py-20 bg-green-900 text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"
        aria-hidden="true"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Collective Impact
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Together with our community of eco-conscious brands, we're making a measurable difference for our planet.
          </p>
        </div>

        <div ref={countersRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center transform transition-transform hover:scale-105 duration-300">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 flex justify-center">
                <span className="counter-value" data-target={stat.value}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <p className="text-green-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};