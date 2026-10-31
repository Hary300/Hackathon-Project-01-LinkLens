import { shortenerDomains } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUrlShortener = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const normalizedHostname = hostname.replace(/^www\./, '');
  if (!shortenerDomains.has(normalizedHostname)) return null;

  return {
    header: 'Apakah alamat tautan ini dipendekkan?',
    description:
      'Ya. Tautan pendek menyembunyikan nama situs tujuan. Karena itu, kamu tidak bisa tahu ke mana tautan akan membawa sebelum dibuka.',
  };
};
