import { shortenerDomains } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUrlShortener = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const normalizedHostname = hostname.replace(/^www\./, '');
  if (!shortenerDomains.has(normalizedHostname)) return null;

  return {
    header: 'Menggunakan URL shortener',
    description:
      'URL shortener menyembunyikan alamat tujuan akhir. Tujuannya belum diketahui dan ini bukan bukti bahwa link berbahaya; jangan buka jika sumbernya tidak tepercaya.',
  };
};
