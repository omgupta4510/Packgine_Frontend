import React from 'react';
import { Link } from 'react-router-dom';

type CategoryCardProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

export const CategoryCard = ({ icon, title, href }: CategoryCardProps) => {
  return (
    <Link 
      to={href}
      className="flex flex-col items-center justify-center bg-white p-5 rounded-lg border border-berlin-gray-100 hover:border-berlin-red-200 hover:shadow-md transition-all duration-300 group"
    >
      <div className="text-berlin-red-500 mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-berlin-gray-800 font-medium text-center group-hover:text-berlin-red-700 transition-colors">
        {title}
      </span>
    </Link>
  );
};