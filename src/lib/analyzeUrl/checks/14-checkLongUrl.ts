import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongUrl = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.href.length <= 2000) return null;

  return {
    header: 'Apakah alamat tautan ini sangat panjang?',
    description: `Ya. Tautan ini memiliki ${parsedUrl.href.length} karakter, sehingga nama situs dan tujuan akhirnya lebih sulit diperiksa.`,
  };
};
