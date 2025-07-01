import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAction = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'primary',
  className = '' 
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      icon={icon}
      className={`flex-col h-auto py-4 px-6 space-y-2 ${className}`}
    >
      <ApperIcon name={icon} className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
};

export default QuickAction;