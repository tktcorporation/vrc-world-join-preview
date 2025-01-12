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
        background: '#7FB5B5',
      }}
    >
      <title>VRChat World Join Preview - Bold Style</title>
      <defs>
        <>
          <filter id="blur-effect">
            <feGaussianBlur stdDeviation="40" />
            <feColorMatrix type="saturate" values="1.2" />
          </filter>

          <filter id="soft-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
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
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.4" />
          </linearGradient>
        </>
      </defs>

      {/* Background image with blur */}
      <rect
        width="100%"
        height="100%"
        fill="url(#bg-image)"
        filter="url(#blur-effect)"
        opacity="0.8"
      />

      {/* Gradient overlay */}
      <rect width="100%" height="100%" fill="url(#overlay-gradient)" />

      {/* Main image container with shadow */}
      <rect
        x="80"
        y="120"
        width="640"
        height="360"
        fill="url(#bg-image)"
        rx="16"
        filter="url(#soft-shadow)"
      />

      {/* Content grid */}
      <g transform="translate(32, 32)">
        {/* Title section */}
        <text
          x="0"
          y="0"
          fontSize="48"
          fontWeight="700"
          fill="white"
          dominantBaseline="hanging"
          filter="url(#soft-shadow)"
        >
          {worldName}
        </text>
      </g>

      {/* Players section - positioned at bottom */}
      <g transform="translate(32, 520)">
        {/* Players title */}
        <g>
          <rect
            x="0"
            y="0"
            width="100"
            height="32"
            rx="16"
            fill="rgba(0, 0, 0, 0.3)"
          />
          <text
            x="16"
            y="16"
            fontSize="16"
            fontWeight="600"
            fill="white"
            dominantBaseline="middle"
          >
            Players
          </text>
        </g>

        {/* Player list */}
        <foreignObject x="110" y="0" width="640" height="40">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          >
            {playerNameList.map((player) => (
              <div
                key={player}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                }}
              >
                {player}
              </div>
            ))}
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
