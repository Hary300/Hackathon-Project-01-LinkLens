import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHttpConnection = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.protocol !== 'http:') return null;

  return {
    header: 'Koneksi menggunakan HTTP, bukan HTTPS',
    description:
      'Koneksi HTTP tidak mengenkripsi data saat dikirim. Ini peringatan keamanan koneksi, bukan bukti bahwa situs tersebut penipuan. HTTPS juga tidak menjamin situs tepercaya.',
  };
};
