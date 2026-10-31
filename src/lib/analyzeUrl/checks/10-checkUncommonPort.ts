import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUncommonPort = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.port || ['80', '443'].includes(parsedUrl.port)) return null;

  return {
    header: 'URL menggunakan port yang tidak umum',
    description: `URL menggunakan port :${parsedUrl.port}. Port ini bisa dipakai layanan yang sah, tetapi tidak umum untuk halaman publik; pastikan alamatnya benar sebelum memasukkan data.`,
  };
};
