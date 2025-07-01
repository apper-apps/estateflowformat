import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterDropdown = ({ 
  label = "Filter", 
  options = [], 
  value = '', 
  onChange,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        icon="Filter"
        className="justify-between min-w-32"
      >
        {selectedOption ? selectedOption.label : label}
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 ml-2" 
        />
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-neutral-200 rounded-lg shadow-large">
          <div className="py-1">
            <button
              onClick={() => handleSelect('')}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              All {label}
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full text-left px-4 py-2 text-sm hover:bg-neutral-50
                  ${value === option.value ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;