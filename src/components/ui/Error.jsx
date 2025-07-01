import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  title = "Something went wrong", 
  message = "We're sorry, but there was an error loading this content. Please try again.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-md">
        {message}
      </p>
      
      <div className="flex items-center space-x-4">
        {onRetry && (
          <Button 
            onClick={onRetry}
            icon="RefreshCw"
            variant="primary"
          >
            Try Again
          </Button>
        )}
        
        <Button 
          onClick={() => window.location.reload()}
          variant="secondary"
          icon="RotateCcw"
        >
          Refresh Page
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200 max-w-md">
        <p className="text-sm text-neutral-500">
          If this problem persists, please contact support with the error details.
        </p>
      </div>
    </div>
  );
};

export default Error;