import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseStyles = 'font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    outline: 'border-2 border-primary text-primary hover:bg-blue-50 focus:ring-primary disabled:border-blue-300 disabled:text-blue-300',
  };

  // Touch-optimized sizes with minimum 44px height for mobile
  // Responsive sizing: smaller on mobile, larger on desktop
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[44px] min-w-[44px]',
    md: 'px-4 py-2 text-base min-h-[44px] md:min-h-[48px]',
    lg: 'px-6 py-3 text-lg min-h-[44px] md:min-h-[52px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
