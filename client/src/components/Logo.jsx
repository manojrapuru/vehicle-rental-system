import React from 'react';

/**
 * Modern Brand Logo Component
 * Sleek, futuristic automotive crest emblem with glowing indigo-cyan gradient
 */
export default function Logo({ size = 38, showText = true, textVariant = 'default' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', userSelect: 'none' }}>
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          padding: '2px',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#0f172a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Custom Stylized Vector Emblem */}
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            {/* Aerodynamic Wing / Speed Profile */}
            <path
              d="M4 18L10 8H22L28 18H24L20 12H12L8 18H4Z"
              fill="url(#logoGrad)"
            />
            {/* Lower Chassis & Wheels Accent */}
            <circle cx="9" cy="22" r="3" fill="#38bdf8" />
            <circle cx="23" cy="22" r="3" fill="#818cf8" />
            <path
              d="M12 22H20"
              stroke="url(#logoGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Speed Lightning Streak */}
            <path
              d="M17 6L14 14H18L15 22"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: textVariant === 'footer' ? '#ffffff' : 'var(--text-main)',
              }}
            >
              DRIVE<span style={{ color: '#4f46e5' }}>PULSE</span>
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                color: '#fff',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              PRO
            </span>
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
            }}
          >
            Vehicle Rental Network
          </span>
        </div>
      )}
    </div>
  );
}
