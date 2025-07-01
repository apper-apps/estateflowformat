import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  className = '' 
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-neutral-500'
  };

  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-neutral-900 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {value}
            </p>
            {change && (
              <div className={`ml-2 flex items-center text-sm font-medium ${trendColors[trend]}`}>
                <ApperIcon name={trendIcons[trend]} className="w-4 h-4 mr-1" />
                {change}
              </div>
            )}
          </div>
        </div>
        <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
          <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-full -mr-16 -mt-16 opacity-20" />
    </Card>
  );
};

export default StatCard;