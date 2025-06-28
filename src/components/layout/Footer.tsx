import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Leaf } from 'lucide-react';

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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Leaf className="w-8 h-8 text-green-500 mr-2" />
              <span className="text-xl font-semibold text-gray-900">Packgine</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Making sustainable packaging accessible to all businesses, one package at a time.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-green-50 text-gray-600 hover:text-green-600 p-2 rounded-full border border-gray-200 transition-colors"
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
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-base text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Packgine. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-sm">
                Made with ♥ for a sustainable future
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};