import type { PreviewProps } from './types';
import { useEffect, useRef, useState } from 'react';
import { PLAYER_COUNT_SUFFIX } from '../../types';

export function BoldPreview({
  worldName,
  imageUrl,
  playerNameList,
  isDarkMode,
  colors,
  previewRef,
}: PreviewProps) {
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerHeight = 76; // 固定の高さ
    const containerWidth = 740; // 固定の幅
    let currentRow = 0;
    let currentWidth = 0;
    const gap = 8;
    const visible: string[] = [];
    
    // +N人 表示用の余白を確保（およそ100px）
    const reservedWidth = 100;
    const effectiveWidth = containerWidth - reservedWidth;
    
    // プレイヤー要素の位置を計算
    for (const player of playerNameList) {
      const element = playerRefs.current.get(player);
      if (!element) continue;

      const width = element.offsetWidth;
      
      if (currentWidth + width > effectiveWidth) {
        currentRow++;
        currentWidth = width + gap;
      } else {
        currentWidth += width + gap;
      }

      // 2行までに収まる場合のみ表示
      if (currentRow < 2) {
        visible.push(player);
      } else {
        break; // 2行を超えた時点で終了
      }
    }

    setVisiblePlayers(visible);
    setHiddenCount(playerNameList.length - visible.length);
  }, [playerNameList]);

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

          <pattern
            id="main-image"
            patternUnits="userSpaceOnUse"
            x="80"
            y="100"
            width="640"
            height="360"
          >
            <image
              href={imageUrl}
              x="0"
              y="0"
              width="640"
              height="360"
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
        y="100"
        width="640"
        height="360"
        fill="url(#main-image)"
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
      <g transform="translate(32, 480)">
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
            PLAYERS ({playerNameList.length})
          </text>
        </g>

        {/* Player list */}
        <foreignObject x="0" y="24" width="740" height="76">
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%',
              alignContent: 'flex-start',
              position: 'relative',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {playerNameList.map((player) => (
              <div
                key={player}
                ref={(el) => {
                  if (el) {
                    playerRefs.current.set(player, el);
                  } else {
                    playerRefs.current.delete(player);
                  }
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: visiblePlayers.includes(player) ? 'inline-block' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {player}
              </div>
            ))}
            {hiddenCount > 0 && (
              <div
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
                +{hiddenCount}{PLAYER_COUNT_SUFFIX}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
