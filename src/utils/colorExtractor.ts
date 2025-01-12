function getPixelData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

interface ColorBucket {
  r: number;
  g: number;
  b: number;
  count: number;
}

export function extractDominantColors(img: HTMLImageElement) {
  const imageData = getPixelData(img);
  const data = imageData.data;
  const colorBuckets: { [key: string]: ColorBucket } = {};
  
  // 色のバケット化（似た色をグループ化）
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.floor(data[i] / 10) * 10;
    const g = Math.floor(data[i + 1] / 10) * 10;
    const b = Math.floor(data[i + 2] / 10) * 10;
    
    // HSLに変換して彩度と明度をチェック
    const [, s, l] = rgbToHsl(r, g, b);
    
    // 彩度が低すぎる、または明度が極端な色は除外
    if (s < 0.1 || l < 0.1 || l > 0.9) continue;
    
    const key = `${r},${g},${b}`;
    
    if (colorBuckets[key]) {
      colorBuckets[key].count++;
    } else {
      colorBuckets[key] = { r, g, b, count: 1 };
    }
  }

  // 出現頻度でソート
  const sortedColors = Object.values(colorBuckets)
    .sort((a, b) => b.count - a.count)
    .filter(bucket => bucket.count > 50); // ノイズ除去

  // 最も出現頻度の高い色を取得
  const primary = sortedColors[0] || { r: 59, g: 130, b: 246 };
  const secondary = sortedColors[Math.floor(sortedColors.length / 3)] || { r: 147, g: 51, b: 234 };
  const accent = sortedColors[Math.floor(sortedColors.length / 2)] || { r: 79, g: 70, b: 229 };

  return {
    primary: `rgb(${primary.r}, ${primary.g}, ${primary.b})`,
    secondary: `rgb(${secondary.r}, ${secondary.g}, ${secondary.b})`,
    accent: `rgb(${accent.r}, ${accent.g}, ${accent.b})`
  };
}