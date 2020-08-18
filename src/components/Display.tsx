import React from 'react';

const Display = ({ title, value }: { title: string; value: any }) => {
  return (
    <div className="display">
      <div className="display__title">{title}:</div>
      <div className="display__value">{value}</div>
    </div>
  );
};

export default Display;
