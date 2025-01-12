import React from 'react';
import { Users } from 'lucide-react';
import type { CreateSharePreviewOptions } from '../types';

interface PreviewProps extends Omit<CreateSharePreviewOptions, 'isDarkMode'> {
  isDarkMode: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  previewRef: React.RefObject<HTMLDivElement>;
}

export function Preview({
  worldName,
  imageUrl,
  playerNameList,
  isDarkMode,
  colors,
  previewRef,
}: PreviewProps) {
  return (
    <div
      ref={previewRef}
      style={{
        width: '800px',
        height: '600px',
        background: isDarkMode ? '#111827' : '#ffffff',
      }}
      className="rounded-2xl shadow-xl relative overflow-hidden"
    >
      {/* ブラー処理した背景画像 */}
      {imageUrl && (
        <>
          {/* 背景画像を2回配置してより強い効果を得る */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(100px) brightness(0.7)',
              transform: 'scale(1.5)',
              opacity: 0.4,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(50px) brightness(0.8)',
              transform: 'scale(1.2)',
              opacity: 0.3,
            }}
          />
        </>
      )}

      {/* オーバーレイグラデーション */}
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? 'linear-gradient(165deg, rgba(17, 24, 39, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)'
            : 'linear-gradient(165deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
        }}
      />

      <div className="relative h-full flex flex-col p-8 z-10">
        {worldName && (
          <div className="relative">
            <h1
              className="text-4xl font-bold mb-6 tracking-tight"
              style={{
                color: isDarkMode ? '#fff' : '#000',
              }}
            >
              {worldName}
            </h1>
            <div
              className="absolute bottom-0 left-0 w-32 h-1 rounded-full"
              style={{
                background: colors.primary,
                opacity: 0.5,
              }}
            />
          </div>
        )}

        <div className="flex-1 flex gap-8 items-stretch mt-4">
          {imageUrl && (
            <div className="relative w-[450px] h-[400px]">
              <img
                src={imageUrl}
                alt="World preview"
                className="w-full h-full object-cover rounded-2xl shadow-lg relative z-10"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 rounded-2xl shadow-inner" />
            </div>
          )}

          {playerNameList && playerNameList.length > 0 && (
            <div className="w-[250px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{
                    background: colors.primary,
                    opacity: 0.8,
                  }}
                >
                  <Users size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Players
                </h2>
              </div>
              <div className="flex-1">
                <div
                  className={`h-full rounded-2xl ${
                    isDarkMode ? 'bg-gray-800/20' : 'bg-white/20'
                  } p-4 backdrop-blur-sm`}
                >
                  <div className="grid gap-2">
                    {playerNameList.map((player, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-800/30' : 'bg-white/30'
                        } backdrop-blur-sm`}
                      >
                        <span className="text-base font-medium">{player}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
