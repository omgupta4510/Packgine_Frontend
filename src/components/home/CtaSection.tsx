import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const CtaSection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-berlin-red-600 to-berlin-red-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Make the Switch to Sustainable Packaging?
          </h2>
          <p className="text-xl text-berlin-red-50 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of forward-thinking brands creating a positive impact with every package. Your sustainable packaging journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-berlin-red-700 hover:bg-berlin-gray-50 font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl"
              href="/signup"
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-4"
              href="/contact"
            >
              Talk to an Expert <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};