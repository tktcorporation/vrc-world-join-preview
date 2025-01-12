import React, { useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import type { CreateSharePreviewOptions } from '../types';
import { ModernPreview } from './previews/ModernPreview';
import { MinimalPreview } from './previews/MinimalPreview';
import { BoldPreview } from './previews/BoldPreview';
import { downloadPreview } from '../utils/downloadPreview';
import { extractDominantColors } from '../utils/colorExtractor';

const PREVIEW_COMPONENTS = {
  modern: ModernPreview,
  minimal: MinimalPreview,
  bold: BoldPreview,
} as const;

type PreviewStyle = keyof typeof PREVIEW_COMPONENTS;

export function PreviewGenerator(props: CreateSharePreviewOptions) {
  const previewRef = useRef<SVGSVGElement>(null);
  const [selectedStyle, setSelectedStyle] = useState<PreviewStyle>('modern');
  const [colors, setColors] = useState<{ primary: string; secondary: string; accent: string }>({
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(147, 51, 234)',
    accent: 'rgb(79, 70, 229)'
  });

  useEffect(() => {
    if (props.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = props.imageUrl;
      img.onload = () => {
        const extractedColors = extractDominantColors(img);
        setColors(extractedColors);
      };
    }
  }, [props.imageUrl]);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    await downloadPreview(previewRef.current, props.isDarkMode, props.worldName);
  };

  const PreviewComponent = PREVIEW_COMPONENTS[selectedStyle];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4 mb-4">
          {Object.keys(PREVIEW_COMPONENTS).map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style as PreviewStyle)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStyle === style
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        <PreviewComponent {...props} colors={colors} previewRef={previewRef} />

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
        >
          <Download size={20} />
          Download SVG
        </button>
      </div>
    </div>
  );
}