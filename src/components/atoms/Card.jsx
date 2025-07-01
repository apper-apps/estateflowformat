import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  interactive = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = interactive ? 'card-interactive' : 'card';
  
  const CardComponent = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;