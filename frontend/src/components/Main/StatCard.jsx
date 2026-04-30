import React from 'react';

export default function StatCard({ title, value, unit, valueColor = 'inherit' }) {
  return (
    <div className="card">
      <h3 style={{ color: '#666', fontWeight: 700, fontSize: '22px' }}>{title}</h3>
      <div className="value" style={{ color: valueColor }}>
        {value}<span className="unit">{unit}</span>
      </div>
    </div>
  );
}