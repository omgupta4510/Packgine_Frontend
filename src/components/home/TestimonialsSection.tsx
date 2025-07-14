import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "EcoPack has revolutionized how we source packaging. We've reduced our packaging carbon footprint by 65% while actually saving money.",
    author: "Sarah Johnson",
    title: "Sustainability Director, Clean Beauty Co.",
    image: "https://images.pexels.com/photos/1821095/pexels-photo-1821095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    quote: "The platform made it incredibly easy to find compostable alternatives to our plastic packaging. The sample process was seamless, and we found our perfect supplier in weeks instead of months.",
    author: "Michael Chen",
    title: "Founder, GreenEats Food Delivery",
    image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    quote: "As a small business, we never thought we'd be able to afford eco-friendly packaging. EcoPack connected us with suppliers who worked within our budget and helped us eliminate single-use plastics completely.",
    author: "Emily Rodriguez",
    title: "CEO, Sprout Home Goods",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(autoplayInterval);
  }, [currentIndex]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-berlin-gray-900 mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-berlin-gray-600 max-w-3xl mx-auto font-medium">
            Hear from the brands that have transformed their packaging through our marketplace.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-berlin-red-50 p-8 md:p-12 border border-berlin-red-200">
            <Quote className="absolute text-berlin-red-200 w-24 h-24 -top-4 -left-4 opacity-40" />
            
            <div className="relative z-10">
              <div 
                className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
              >
                <blockquote className="text-xl md:text-2xl text-berlin-gray-800 mb-8 font-medium leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].author}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-berlin-red-200"
                  />
                  <div>
                    <p className="font-bold text-berlin-gray-900">{testimonials[currentIndex].author}</p>
                    <p className="text-berlin-gray-600 font-medium">{testimonials[currentIndex].title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-berlin-red-500' : 'bg-berlin-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-berlin-gray-600 hover:text-berlin-red-600 focus:outline-none z-20 transition-colors border border-berlin-gray-200"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-berlin-gray-600 hover:text-berlin-red-600 focus:outline-none z-20 transition-colors border border-berlin-gray-200"
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};