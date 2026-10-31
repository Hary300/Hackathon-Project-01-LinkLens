import { getRedirectParameters } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkRedirectParameter = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const redirectParameters = getRedirectParameters(parsedUrl);
  if (redirectParameters.length === 0) return null;

  return {
    header: 'Mengandung parameter redirect',
    description: `Query memiliki parameter tujuan (${redirectParameters.map(([name]) => name).join(', ')}). Parameter ini dapat menentukan halaman lanjutan; periksa nilainya sebelum membuka link.`,
  };
};
