import { Download, RefreshCw } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { CreateSharePreviewOptions } from '../types';
import { extractDominantColors } from '../utils/colorExtractor';
import { downloadPreview } from '../utils/downloadPreview';
import { BoldPreview } from './previews/BoldPreview';

const PREVIEW_COMPONENTS = {
  bold: BoldPreview,
} as const;

type PreviewStyle = keyof typeof PREVIEW_COMPONENTS;

export function PreviewGenerator(props: CreateSharePreviewOptions) {
  const previewRef = useRef<SVGSVGElement>(null);
  const [selectedStyle, setSelectedStyle] = useState<PreviewStyle>('bold');
  const [colors, setColors] = useState<{
    primary: string;
    secondary: string;
    accent: string;
  }>({
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(147, 51, 234)',
    accent: 'rgb(79, 70, 229)',
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = props.imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/png');
      setImageBase64(base64);

      const extractedColors = extractDominantColors(img);
      setColors(extractedColors);
    };
  }, [props.imageUrl]);

  const handleDownloadSvg = () => {
    if (!previewRef.current) return;
    const svgData = new XMLSerializer().serializeToString(previewRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(svgBlob);
    link.download = `${props.worldName || 'preview'}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleDownloadPng = async () => {
    if (!previewRef.current || !imageBase64) return;
    
    // SVGをクローンして修正
    const svgElement = previewRef.current.cloneNode(true) as SVGSVGElement;
    
    // インラインスタイルを追加
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      text, div {
        font-family: 'Inter', sans-serif;
      }
      foreignObject div {
        font-family: 'Inter', sans-serif !important;
      }
    `;
    svgElement.insertBefore(styleElement, svgElement.firstChild);
    
    // foreignObject内のdivにもフォントを直接設定
    const foreignDivs = svgElement.getElementsByTagName('div');
    for (const div of foreignDivs) {
      div.style.fontFamily = 'Inter, sans-serif';
    }
    
    // SVGをデータURLに変換
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const modifiedSvgData = svgData.replace(
      new RegExp(props.imageUrl, 'g'),
      imageBase64
    );
    
    // SVGをbase64エンコード
    const svgBase64 = btoa(unescape(encodeURIComponent(modifiedSvgData)));
    const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;
    
    // フォントを読み込む
    await document.fonts.load('700 1em Inter');
    await document.fonts.load('600 1em Inter');
    await document.fonts.load('500 1em Inter');
    await document.fonts.load('400 1em Inter');
    
    // 新しい画像として読み込む
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800 * 2;
        canvas.height = 600 * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // 背景を透明に
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 画像を描画
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        try {
          // PNGとしてエクスポート
          const pngDataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${props.worldName || 'preview'}.png`;
          link.href = pngDataUrl;
          link.click();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = svgDataUrl;
    }).catch((error) => {
      console.error('Failed to convert to PNG:', error);
    });
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const PreviewComponent = PREVIEW_COMPONENTS[selectedStyle];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4 mb-4">
          {Object.keys(PREVIEW_COMPONENTS).map((style) => (
            <button
              type="button"
              key={style}
              onClick={() => setSelectedStyle(style as PreviewStyle)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedStyle === style
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : props.isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative">
          <PreviewComponent
            key={key}
            {...props}
            colors={colors}
            previewRef={previewRef}
            imageUrl={imageBase64 || props.imageUrl}
          />
          <button
            type="button"
            onClick={handleRefresh}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
            title="プレビューを更新"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
          >
            <Download size={20} />
            Download SVG
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg"
            disabled={!imageBase64}
          >
            <Download size={20} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
