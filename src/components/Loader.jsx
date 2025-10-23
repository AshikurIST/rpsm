import React from 'react';

const Loader = ({ 
  size = 'md', 
  className = '', 
  text = null,
  centered = true 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const LoaderContent = () => (
    <div className={`flex items-center ${text ? 'space-x-3' : ''}`}>
      <div 
        className={`
          animate-spin rounded-full border-2 border-gray-300 border-t-primary-600
          ${sizes[size]}
          ${className}
        `}
      />
      {text && (
        <span className="text-gray-600 font-medium">{text}</span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

export default Loader;
