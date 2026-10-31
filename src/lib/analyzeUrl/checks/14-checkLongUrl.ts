import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongUrl = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.href.length <= 2000) return null;

  return {
    header: 'URL sangat panjang',
    description: `URL ini memiliki ${parsedUrl.href.length} karakter. URL panjang dapat menyulitkan pemeriksaan alamat tujuan; panjang saja tidak membuktikan adanya ancaman.`,
  };
};
