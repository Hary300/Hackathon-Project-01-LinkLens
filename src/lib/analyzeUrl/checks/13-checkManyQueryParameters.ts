import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkManyQueryParameters = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const queryParameterCount = [...parsedUrl.searchParams.keys()].length;
  if (queryParameterCount < 4) return null;

  return {
    header: 'Apakah alamat ini memuat banyak informasi tambahan?',
    description: `Ya. Tautan ini memuat ${queryParameterCount} bagian informasi tambahan. Bagian-bagian ini dapat mengubah halaman yang dibuka atau membawa informasi akun.`,
  };
};
