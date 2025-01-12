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
        <g>
          <text
            x="0"
            y="0"
            fontSize="32"
            fontWeight="700"
            fill="white"
            dominantBaseline="hanging"
            filter="url(#soft-shadow)"
          >
            {worldName}
          </text>
          <rect
            x="0"
            y="42"
            width="240"
            height="4"
            rx="2"
            fill={colors.accent}
            opacity="0.9"
            filter="url(#soft-shadow)"
          />
        </g>
      </g>

      {/* Players section - positioned at bottom */}
      <g transform="translate(32, 500)">
        {/* Players title */}
        <g>
          <text
            x="0"
            y="0"
            fontSize="14"
            fontWeight="600"
            fill="rgba(255, 255, 255, 0.7)"
            dominantBaseline="hanging"
            letterSpacing="0.05em"
          >
            PLAYERS
          </text>
        </g>

        {/* Player list */}
        <foreignObject x="0" y="24" width="740" height="76">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%',
              alignContent: 'flex-start',
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
