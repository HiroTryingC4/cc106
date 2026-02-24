import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
