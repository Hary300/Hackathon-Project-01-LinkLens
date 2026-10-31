import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkManyQueryParameters = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const queryParameterCount = [...parsedUrl.searchParams.keys()].length;
  if (queryParameterCount < 4) return null;

  return {
    header: 'Alamat tautan memuat banyak informasi tambahan',
    description: `Ada ${queryParameterCount} bagian informasi tambahan pada tautan ini. Informasi tersebut dapat menentukan halaman yang dibuka; pastikan tautan berasal dari pengirim tepercaya dan jangan bagikan jika berisi informasi akun.`,
  };
};
