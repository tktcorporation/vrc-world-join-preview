export async function downloadPreview(
  element: SVGSVGElement,
  isDarkMode: boolean,
  worldName: string | null
): Promise<void> {
  try {
    // SVGの要素をクローンして、スタイルを適用
    const clone = element.cloneNode(true) as SVGSVGElement;
    clone.style.background = isDarkMode ? '#111827' : '#ffffff';

    // SVGをシリアライズ
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);

    // XML宣言とSVGネームスペースを追加
    const svgData = `<?xml version="1.0" encoding="UTF-8"?>
${svgString}`;

    // Blobを作成してダウンロード
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${worldName || 'preview'}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate SVG:', error);
  }
}
