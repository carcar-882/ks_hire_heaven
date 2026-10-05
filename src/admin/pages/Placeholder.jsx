import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)'}}>
      <div style={{fontSize: '48px', marginBottom: '16px'}}>🚧</div>
      <h2>{title} Module</h2>
      <p>This module is currently under construction for Hire Heaven Admin.</p>
    </div>
  );
};

export default Placeholder;
