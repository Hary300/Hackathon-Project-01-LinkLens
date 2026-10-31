import type { AnalyzeUrlCheck } from '../types';

export const checkUnsupportedProtocol = (
  parsedUrl: URL
): AnalyzeUrlCheck | null => {
  if (['http:', 'https:'].includes(parsedUrl.protocol)) return null;

  return {
    header: 'Tautan ini bukan alamat situs biasa',
    description:
      'Tautan ini mungkin dibuka oleh aplikasi, bukan halaman internet biasa. Jangan lanjutkan jika kamu tidak mengenali pengirim atau aplikasi yang akan membukanya.',
  };
};
