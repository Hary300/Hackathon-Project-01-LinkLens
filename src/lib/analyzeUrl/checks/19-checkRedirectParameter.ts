import { getRedirectParameters } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkRedirectParameter = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const redirectParameters = getRedirectParameters(parsedUrl);
  if (redirectParameters.length === 0) return null;

  return {
    header: 'Apakah tautan ini bisa membawa kamu ke halaman lain?',
    description: `Ya. Tautan memuat petunjuk untuk membuka halaman lain (${redirectParameters.map(([name]) => name).join(', ')}). Jadi, tujuan akhirnya bisa berbeda dari halaman yang terlihat sekarang.`,
  };
};
