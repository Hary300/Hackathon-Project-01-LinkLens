import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongUrl = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.href.length <= 2000) return null;

  return {
    header: 'Alamat tautan sangat panjang',
    description: `Tautan ini memiliki ${parsedUrl.href.length} karakter sehingga nama situs dan tujuan akhirnya sulit dilihat. Periksa nama situs di awal dan pastikan halaman yang dituju sesuai sebelum dibuka.`,
  };
};
