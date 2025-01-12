import React from 'react';
import type { PreviewProps } from './types';

export function MinimalPreview({
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
      <title>VRChat World Join Preview - Minimal Style</title>
      <defs>
        {imageUrl && (
          <>
            <linearGradient id="minimal-overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="transparent" />
              <stop
                offset="100%"
                stopColor={colors.primary}
                stopOpacity="0.5"
              />
            </linearGradient>

            <filter id="minimal-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
            </filter>
          </>
        )}
      </defs>

      {/* Content */}
      <g transform="translate(32, 32)">
        {/* Left column */}
        <g>
          {/* Title */}
          {worldName && (
            <text
              x="0"
              y="0"
              fontSize="36"
              fontWeight="bold"
              fill={colors.primary}
              dominantBaseline="hanging"
            >
              {worldName}
            </text>
          )}

          {/* Image */}
          {imageUrl && (
            <g transform="translate(0, 60)">
              <clipPath id="minimal-image-clip">
                <rect width="500" height="450" rx="8" />
              </clipPath>
              <image
                href={imageUrl}
                width="500"
                height="450"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#minimal-image-clip)"
                crossOrigin="anonymous"
              />
              <rect
                width="500"
                height="450"
                rx="8"
                fill="url(#minimal-overlay)"
              />
            </g>
          )}
        </g>

        {/* Right column - Players */}
        {playerNameList && playerNameList.length > 0 && (
          <g transform="translate(540, 0)">
            {/* Players header */}
            <g>
              <path
                d="M17 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M23 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -8) scale(0.9)"
              />
              <text
                x="20"
                y="0"
                fontSize="12"
                fontWeight="600"
                fill={isDarkMode ? '#fff' : '#000'}
                letterSpacing="0.1em"
                dominantBaseline="hanging"
              >
                PLAYERS
              </text>
            </g>

            {/* Player list */}
            <g transform="translate(0, 40)">
              {playerNameList.map((player) => (
                <g
                  key={player}
                  transform={`translate(0, ${
                    playerNameList.indexOf(player) * 36
                  })`}
                >
                  <rect
                    width="200"
                    height="30"
                    rx="6"
                    fill={
                      isDarkMode
                        ? 'rgba(31, 41, 55, 0.3)'
                        : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                  <text
                    x="16"
                    y="20"
                    fill={isDarkMode ? '#fff' : '#000'}
                    fontSize="14"
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
    </svg>
  );
}
