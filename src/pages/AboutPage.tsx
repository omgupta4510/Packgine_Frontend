import { Building2, Globe, Award, Users, Target, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';

const AboutPage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Packgine
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your trusted marketplace for sustainable packaging solutions, operating under the aegis of Berlin Packaging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/products" className="flex items-center gap-2">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" href="/become-supplier" className="flex items-center gap-2">
                Become a Supplier <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Packgine is dedicated to revolutionizing the packaging industry by connecting suppliers and buyers 
                  through a streamlined digital marketplace. We believe in making packaging solutions accessible, 
                  sustainable, and profitable for all stakeholders.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our platform empowers businesses of all sizes to find the perfect packaging solutions while 
                  promoting environmentally responsible practices and fostering innovation in the industry.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Making packaging easy, sustainable, and profitable</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                    <div className="text-sm text-gray-600">Products Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Trusted Suppliers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                    <div className="text-sm text-gray-600">Countries Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berlin Packaging Partnership */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powered by Berlin Packaging
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Packgine operates under the guidance and expertise of Berlin Packaging, the world's largest 
                hybrid packaging supplier with over 125 years of industry experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Building2 className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Expertise</h3>
                <p className="text-gray-600">
                  Backed by Berlin Packaging's extensive network of 1,700+ global suppliers and 
                  100+ locations worldwide, ensuring quality and reliability.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Award className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Leadership</h3>
                <p className="text-gray-600">
                  Leveraging 225+ packaging awards and ISO 9001 certification to deliver 
                  world-class packaging solutions and unmatched quality standards.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Globe className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Future</h3>
                <p className="text-gray-600">
                  Committed to environmental responsibility with a focus on sustainable packaging 
                  solutions that reduce environmental impact while maintaining performance.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Learn more about our parent company and their industry-leading packaging solutions.
              </p>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 mx-auto"
                onClick={() => window.open('https://www.berlinpackaging.com/', '_blank')}
              >
                Visit Berlin Packaging <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">
                The principles that guide everything we do at Packgine
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for the highest quality in every product and service we offer.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  Environmental responsibility is at the core of our business model.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership</h3>
                <p className="text-gray-600">
                  We believe in building long-term relationships with our suppliers and customers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate to meet the evolving needs of the packaging industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
              <p className="text-lg text-gray-600">
                Providing specialized packaging solutions across diverse markets
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                'Food & Beverage',
                'Cosmetics & Beauty',
                'Pharmaceuticals',
                'Home Care',
                'Spirits & Wine',
                'Pet Care',
                'Industrial',
                'Automotive',
                'Nutraceuticals',
                'Personal Care'
              ].map((industry, index) => (
                <div key={index} className="bg-white p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-sm font-medium text-gray-700">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Packaging Experience?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of businesses who trust Packgine for their packaging needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" href="/products" className="flex items-center gap-2">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" href="/become-supplier" className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-green-600">
                Partner With Us <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
