import { getRedirectParameters } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkRedirectParameter = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const redirectParameters = getRedirectParameters(parsedUrl);
  if (redirectParameters.length === 0) return null;

  return {
    header: 'Tautan dapat membawa kamu ke halaman lain',
    description: `Ada petunjuk di dalam tautan yang dapat membuka halaman lain (${redirectParameters.map(([name]) => name).join(', ')}). Pastikan halaman tujuan berasal dari layanan resmi sebelum dibuka.`,
  };
};
