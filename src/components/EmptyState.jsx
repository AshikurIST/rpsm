import React from 'react';
import { FileX, Plus } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FileX,
  title = 'No data found',
  description = 'Get started by creating your first item.',
  action = null,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
