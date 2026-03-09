import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'default', // 'none', 'sm', 'default', 'lg'
  hover = false 
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 md:p-4',
    default: 'p-4 md:p-6 lg:p-8',
    lg: 'p-6 md:p-8 lg:p-10'
  };
  
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-lg active:shadow-lg transition-shadow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
