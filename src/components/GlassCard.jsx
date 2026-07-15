import React from 'react';

const GlassCard = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
