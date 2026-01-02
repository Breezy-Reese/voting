import React from 'react';

export default function HeartIcon({ size = 18, status = 'ok', className = '' }) {
  const isCritical = status === 'critical';
  const color = isCritical ? '#ff3b3b' : status === 'warning' ? '#ff9f1c' : '#28a745';
  const outer = isCritical ? 1.5 : 1;
  const svgSize = Math.round(size * outer);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }} className={className} aria-hidden>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
        role="img"
        aria-label={isCritical ? 'System health critical' : 'System health'}
      >
        <style>{`
          .hv-pulse { transform-origin: 50% 50%; animation: hv-pulse 1s ease-in-out infinite; }
          @keyframes hv-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        `}</style>
        <g className={isCritical ? 'hv-pulse' : ''} transform={isCritical ? 'translate(0,0) scale(1.05)' : undefined}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
          />
        </g>
      </svg>

      {isCritical && (
        <span style={{
          marginLeft: 6,
          background: '#c82333',
          color: 'white',
          fontWeight: 700,
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 4,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>ICU</span>
      )}
    </span>
  );
}
