import React from 'react';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="skeleton w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-32 mb-2 rounded" />
                <div className="skeleton h-3 w-48 rounded" />
              </div>
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-4">
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-6 w-full rounded" />
            <div className="flex justify-between items-center">
              <div className="skeleton h-4 w-20 rounded" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'calendar') {
    return (
      <div className="bg-white rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="flex space-x-2">
            <div className="skeleton h-10 w-24 rounded-lg" />
            <div className="skeleton h-10 w-24 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Default dashboard loading
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="skeleton h-4 w-24 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
              <div className="skeleton h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="skeleton h-6 w-32 rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-32 mb-2 rounded" />
                <div className="skeleton h-3 w-48 rounded" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="skeleton h-6 w-32 rounded mb-4" />
          <div className="skeleton h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Loading;