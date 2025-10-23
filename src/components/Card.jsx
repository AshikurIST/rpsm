import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title = null, 
  titleActions = null,
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      {title && (
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {titleActions && (
              <div className="flex items-center space-x-2">
                {titleActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={title ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
