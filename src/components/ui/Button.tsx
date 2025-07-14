import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  isExternal = false,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-berlin-red-500 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-berlin-red-500 hover:bg-berlin-red-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-berlin-gray-100 hover:bg-berlin-gray-200 text-berlin-gray-700 border border-berlin-gray-300',
    outline: 'border-2 border-berlin-red-500 text-berlin-red-600 hover:bg-berlin-red-50 hover:border-berlin-red-600',
    ghost: 'text-berlin-red-600 hover:bg-berlin-red-50',
    link: 'text-berlin-red-600 hover:text-berlin-red-700 hover:underline p-0',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    variant !== 'link' && sizeClasses[size],
    disabledClasses,
    className
  );

  if (href) {
    const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <Link to={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};