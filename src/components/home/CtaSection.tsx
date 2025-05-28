import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make the Switch to Sustainable Packaging?
          </h2>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Join thousands of forward-thinking brands creating a positive impact with every package. Your sustainable packaging journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50"
              href="/signup"
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
              href="/contact"
            >
              Talk to an Expert <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};