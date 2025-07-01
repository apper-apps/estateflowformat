import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Database",
  title = "No data available", 
  message = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-neutral-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-8 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          icon="Plus"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="absolute -z-10 opacity-20">
        <div className="w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Empty;