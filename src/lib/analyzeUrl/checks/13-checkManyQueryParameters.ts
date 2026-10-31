import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkManyQueryParameters = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const queryParameterCount = [...parsedUrl.searchParams.keys()].length;
  if (queryParameterCount < 4) return null;

  return {
    header: 'URL mengandung banyak parameter',
    description: `URL memiliki ${queryParameterCount} parameter query. Banyak parameter juga umum pada situs yang sah; periksa sebagai sinyal tambahan, bukan bukti penipuan.`,
  };
};
