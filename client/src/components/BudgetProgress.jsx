import React from 'react';

function BudgetProgress({ name, spent, limit }) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const percentageClamped = Math.min(percentage, 100);

  let progressBarColor = '#4caf50'; // Green
  if (percentage >= 100) {
    progressBarColor = '#f44336'; // Red
  } else if (percentage >= 75) {
    progressBarColor = '#ff9800'; // Orange
  }

  const containerStyles = {
    marginBottom: '1rem',
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
  };

  const barContainerStyles = {
    height: '20px',
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: '10px',
    marginTop: '0.5rem',
  };

  const fillerStyles = {
    height: '100%',
    width: `${percentageClamped}%`,
    backgroundColor: progressBarColor,
    borderRadius: 'inherit',
    textAlign: 'right',
  };

  return (
    <div style={containerStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{name}</strong>
        <span>
          ${spent.toFixed(2)} / ${limit.toFixed(2)}
        </span>
      </div>
      <div style={barContainerStyles}>
        <div style={fillerStyles}></div>
      </div>
      {percentage > 100 && (
         <p style={{ color: 'red', marginTop: '0.5rem' }}>
            You are ${ (spent - limit).toFixed(2) } over budget!
         </p>
      )}
    </div>
  );
}

export default BudgetProgress;
