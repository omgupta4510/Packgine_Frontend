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
  const baseClasses = 'font-medium rounded-full transition-all duration-300 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-green-100 hover:bg-green-200 text-green-800',
    outline: 'border border-green-500 text-green-700 hover:bg-green-50',
    ghost: 'text-green-700 hover:bg-green-50',
    link: 'text-green-700 hover:underline p-0',
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