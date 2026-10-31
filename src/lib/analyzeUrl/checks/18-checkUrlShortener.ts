import { shortenerDomains } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUrlShortener = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const normalizedHostname = hostname.replace(/^www\./, '');
  if (!shortenerDomains.has(normalizedHostname)) return null;

  return {
    header: 'Alamat tautan dipendekkan',
    description:
      'Tautan pendek menyembunyikan nama situs yang akan dibuka. Pastikan pengirimnya tepercaya dan cari tahu alamat lengkapnya sebelum melanjutkan.',
  };
};
