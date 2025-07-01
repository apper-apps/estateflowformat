import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'badge bg-neutral-100 text-neutral-800',
    new: 'status-new',
    contacted: 'status-contacted',
    showing: 'status-showing',
    negotiating: 'status-negotiating',
    closed: 'status-closed',
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    available: 'badge bg-green-100 text-green-800',
    pending: 'badge bg-yellow-100 text-yellow-800',
    sold: 'badge bg-gray-100 text-gray-800',
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  return (
    <span className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;