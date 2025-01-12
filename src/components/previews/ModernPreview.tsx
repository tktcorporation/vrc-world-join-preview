import React from 'react';
import type { PreviewProps } from './types';

export function ModernPreview({
  worldName,
  imageUrl,
  playerNameList,
  isDarkMode,
  colors,
  previewRef,
}: PreviewProps) {
  return (
    <svg
      ref={previewRef}
      width="800"
      height="600"
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: isDarkMode ? '#111827' : '#ffffff',
      }}
    >
      <defs>
        {imageUrl && (
          <>
            <filter id="modern-blur">
              <feGaussianBlur stdDeviation="40" />
              <feColorMatrix
                type="matrix"
                values="0.7 0 0 0 0
                        0 0.7 0 0 0
                        0 0 0.7 0 0
                        0 0 0 1 0"
              />
            </filter>
            
            <pattern
              id="modern-bg"
              patternUnits="userSpaceOnUse"
              width="100%"
              height="100%"
            >
              <image
                href={imageUrl}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                crossOrigin="anonymous"
              />
            </pattern>
            
            <linearGradient id="modern-text-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
            
            <filter id="modern-shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
            </filter>
          </>
        )}
      </defs>
      
      {/* Background layers */}
      {imageUrl && (
        <>
          <rect
            width="100%"
            height="100%"
            fill="url(#modern-bg)"
            filter="url(#modern-blur)"
            opacity="0.5"
          />
          <rect
            width="100%"
            height="100%"
            fill={isDarkMode ? '#111827' : '#ffffff'}
            opacity="0.9"
          />
        </>
      )}
      
      {/* Content */}
      <g transform="translate(32, 32)">
        {/* Title */}
        {worldName && (
          <text
            x="0"
            y="0"
            fontSize="48"
            fontWeight="bold"
            fill="url(#modern-text-gradient)"
            dominantBaseline="hanging"
          >
            {worldName}
          </text>
        )}
        
        {/* Main content */}
        <g transform="translate(0, 100)">
          {/* Image */}
          {imageUrl && (
            <g>
              <clipPath id="modern-image-clip">
                <rect width="450" height="380" rx="16" />
              </clipPath>
              <image
                href={imageUrl}
                width="450"
                height="380"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#modern-image-clip)"
                filter="url(#modern-shadow)"
                crossOrigin="anonymous"
              />
            </g>
          )}
          
          {/* Players */}
          {playerNameList && playerNameList.length > 0 && (
            <g transform="translate(490, 0)">
              {/* Players header */}
              <g>
                <rect
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  rx="12"
                  fill="url(#modern-text-gradient)"
                />
                <path
                  d="M17 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M23 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(8, 8)"
                />
                <text
                  x="52"
                  y="26"
                  fontSize="20"
                  fontWeight="600"
                  fill={isDarkMode ? 'white' : 'black'}
                  dominantBaseline="middle"
                >
                  Players
                </text>
              </g>
              
              {/* Player list */}
              <g transform="translate(0, 60)">
                {playerNameList.map((player, index) => (
                  <g
                    key={index}
                    transform={`translate(0, ${index * 50})`}
                  >
                    <rect
                      width="250"
                      height="40"
                      rx="12"
                      fill={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                      stroke={`${colors.primary}25`}
                    />
                    <text
                      x="16"
                      y="20"
                      fontSize="14"
                      fontWeight="500"
                      fill={isDarkMode ? 'white' : 'black'}
                      dominantBaseline="middle"
                    >
                      {player}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}