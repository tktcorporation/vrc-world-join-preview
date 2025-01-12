import React from 'react';
import type { PreviewProps } from './types';

export function BoldPreview({
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
      <title>VRChat World Join Preview - Bold Style</title>
      <defs>
        <>
          <filter id="blur-effect">
            <feGaussianBlur stdDeviation="80" />
            <feColorMatrix type="saturate" values="1.5" />
          </filter>

          <pattern
            id="bg-image"
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

          <linearGradient id="overlay-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
            <stop
              offset="100%"
              stopColor={colors.secondary}
              stopOpacity="0.9"
            />
          </linearGradient>

          <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </linearGradient>
        </>
      </defs>

      {/* Main image */}
      <image
        href={imageUrl}
        width="800"
        height="600"
        preserveAspectRatio="xMidYMid slice"
        crossOrigin="anonymous"
      />

      {/* Background layers */}
      <>
        <rect
          width="100%"
          height="100%"
          fill="url(#bg-image)"
          filter="url(#blur-effect)"
          opacity="0.6"
        />
        <rect width="100%" height="100%" fill="url(#overlay-gradient)" />
      </>

      {/* Content grid */}
      <g transform="translate(32, 32)">
        {/* Left column */}
        <g>
          {/* Title section */}
          <g>
            <text
              x="0"
              y="0"
              fontSize="48"
              fontWeight="800"
              fill="white"
              dominantBaseline="hanging"
            >
              {worldName}
            </text>
            <rect
              x="0"
              y="70"
              width="128"
              height="8"
              fill="url(#accent-line)"
              rx="4"
            />
          </g>

          {/* Players section */}
          <g transform="translate(0, 120)">
            {/* Players title */}
            <g>
              <rect
                x="0"
                y="0"
                width="40"
                height="40"
                rx="8"
                fill="white"
                fillOpacity="0.2"
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
                y="28"
                fontSize="24"
                fontWeight="bold"
                fill="white"
                dominantBaseline="middle"
              >
                Players
              </text>
            </g>

            {/* Player list */}
            <g transform="translate(0, 60)">
              {playerNameList.map((player) => {
                const index = playerNameList.indexOf(player);
                const row = Math.floor(index / 2);
                const col = index % 2;
                return (
                  <g
                    key={player}
                    transform={`translate(${col * 180}, ${row * 50})`}
                  >
                    <rect
                      width="160"
                      height="40"
                      rx="8"
                      fill={
                        isDarkMode
                          ? 'rgba(31, 41, 55, 0.3)'
                          : 'rgba(255, 255, 255, 0.3)'
                      }
                    />
                    <text
                      x="16"
                      y="26"
                      fill={isDarkMode ? '#fff' : '#000'}
                      fontSize="14"
                    >
                      {player}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
