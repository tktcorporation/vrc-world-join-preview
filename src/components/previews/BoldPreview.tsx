import { useEffect, useRef, useState } from 'react';
import { PLAYER_COUNT_SUFFIX } from '../../types';
import type { PreviewProps } from './types';

export function BoldPreview({
  worldName,
  imageUrl,
  playerNameList,
  isDarkMode,
  colors,
  previewRef,
  showAllPlayers = false,
}: PreviewProps) {
  const [visiblePlayers, setVisiblePlayers] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tempContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tempContainerRef.current) return;

    if (showAllPlayers) {
      setVisiblePlayers(playerNameList);
      setHiddenCount(0);
      return;
    }

    const container = tempContainerRef.current;
    const containerWidth = 740; // 固定の幅
    const gap = 8;
    const visible: string[] = [];

    // +N more 表示用の余白を確保（およそ100px）
    const reservedWidth = 100;
    const effectiveWidth = containerWidth - reservedWidth;

    let currentRow = 0;
    let currentWidth = 0;

    // 一時的なdivを作成して幅を計算
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.padding = '6px 12px';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.style.fontSize = '14px';
    container.appendChild(tempDiv);

    // プレイヤー要素の位置を計算
    for (const player of playerNameList) {
      tempDiv.textContent = player;
      const width = tempDiv.offsetWidth;

      if (currentWidth + width + gap > effectiveWidth) {
        currentRow++;
        currentWidth = width + gap;
      } else {
        currentWidth += width + gap;
      }

      if (currentRow < 2) {
        visible.push(player);
      } else {
        break;
      }
    }

    container.removeChild(tempDiv);
    setVisiblePlayers(visible);
    setHiddenCount(playerNameList.length - visible.length);
  }, [playerNameList, showAllPlayers]);

  // プレビューの高さを動的に計算
  const calculatePreviewHeight = () => {
    if (!showAllPlayers) return 600;
    const playerCount = playerNameList.length;
    const estimatedRows = Math.ceil(playerCount / 8); // 1行あたり約8人と仮定
    const additionalHeight = Math.max(0, (estimatedRows - 2) * 40); // 2行以上の場合、1行あたり40pxを追加
    return 600 + additionalHeight;
  };

  const previewHeight = calculatePreviewHeight();
  const playersSectionY = 480;
  const playerListHeight = showAllPlayers
    ? previewHeight - playersSectionY - 40
    : 76; // 余白を40pxに調整

  return (
    <svg
      ref={previewRef}
      width="800"
      height={previewHeight}
      viewBox={`0 0 800 ${previewHeight}`}
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
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>

          <pattern
            id="bg-image"
            patternUnits="userSpaceOnUse"
            width="800"
            height={previewHeight}
          >
            <g transform={`translate(400 ${previewHeight / 2})`}>
              <image
                href={imageUrl}
                x="-600"
                y={-previewHeight}
                width="1200"
                height={previewHeight * 2}
                preserveAspectRatio="xMidYMid slice"
                crossOrigin="anonymous"
                style={{
                  transformOrigin: 'center center',
                }}
              />
            </g>
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

          <linearGradient
            id="overlay-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2={previewHeight}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop
              offset="100%"
              stopColor={colors.secondary}
              stopOpacity="0.4"
            />
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

      {/* Players section - positioned relative to bottom */}
      <g transform={`translate(32, ${playersSectionY})`}>
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
        <foreignObject x="0" y="24" width="740" height={playerListHeight}>
          <div
            ref={tempContainerRef}
            style={{ position: 'absolute', visibility: 'hidden' }}
          />
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
              paddingBottom: '16px',
            }}
          >
            {(showAllPlayers ? playerNameList : visiblePlayers).map(
              (player) => (
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
                    marginBottom: '2px',
                    height: '30px',
                    lineHeight: '18px',
                    boxSizing: 'border-box',
                  }}
                >
                  {player}
                </div>
              )
            )}
            {!showAllPlayers && hiddenCount > 0 && (
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
                  marginBottom: '2px',
                  height: '30px',
                  lineHeight: '18px',
                  boxSizing: 'border-box',
                }}
              >
                +{hiddenCount}
                {PLAYER_COUNT_SUFFIX}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
