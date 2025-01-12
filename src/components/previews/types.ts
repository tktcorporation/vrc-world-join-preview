import type { CreateSharePreviewOptions } from '../../types';

export interface PreviewProps extends Omit<CreateSharePreviewOptions, 'isDarkMode'> {
  isDarkMode: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  previewRef: React.RefObject<SVGSVGElement>;
}