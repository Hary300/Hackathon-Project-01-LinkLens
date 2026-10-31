import type { AnalyzeUrlCheck } from '../types';

export const checkUnsupportedProtocol = (
  parsedUrl: URL
): AnalyzeUrlCheck | null => {
  if (['http:', 'https:'].includes(parsedUrl.protocol)) return null;

  return {
    header: 'Apakah tautan ini dibuka oleh aplikasi, bukan halaman internet biasa?',
    description:
      'Ya. Tautan ini bukan alamat halaman internet biasa dan mungkin membuka aplikasi lain. Karena itu, pastikan kamu mengenali pengirim dan aplikasi yang terbuka.',
  };
};
