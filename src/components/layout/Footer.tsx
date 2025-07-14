import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Mission', path: '/mission' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Contact', path: '/contact' },
    ],
    Platform: [
      { name: 'How it Works', path: '/how-it-works' },
      { name: 'Browse Products', path: '/products' },
      { name: 'Find Suppliers', path: '/suppliers' },
      { name: 'Request Samples', path: '/samples' },
      { name: 'Get Quotes', path: '/quotes' },
    ],
    Resources: [
      { name: 'Sustainability Guide', path: '/sustainability-guide' },
      { name: 'Material Library', path: '/materials' },
      { name: 'Packaging Glossary', path: '/glossary' },
      { name: 'Industry News', path: '/news' },
      { name: 'FAQs', path: '/faqs' },
    ],
    Legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Acceptable Use', path: '/acceptable-use' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, path: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter size={20} />, path: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram size={20} />, path: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin size={20} />, path: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-berlin-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/Berlin_Logo.png" 
                alt="Berlin Packaging Logo" 
                className="w-8 h-8 mr-3 rounded-full border border-berlin-gray-700" 
              />
              <span className="text-xl font-bold text-white">Berlin Packaging</span>
            </Link>
            <p className="text-berlin-gray-300 mb-8 leading-relaxed">
              The World's Largest Hybrid Packaging Supplier - Making sustainable packaging accessible to all businesses.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-berlin-gray-800 hover:bg-berlin-red-600 text-berlin-gray-300 hover:text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-base text-berlin-gray-300 hover:text-berlin-red-400 transition-colors duration-300 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-berlin-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-berlin-gray-400 text-sm">
              &copy; {currentYear} Berlin Packaging. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-berlin-gray-400 text-sm">
                Made with <span className="text-berlin-red-500">♥</span> for a sustainable future
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};