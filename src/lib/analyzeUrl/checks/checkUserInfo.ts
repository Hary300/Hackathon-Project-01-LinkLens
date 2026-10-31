import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUserInfo = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.username && !parsedUrl.password) return null;

  return {
    header: 'URL mengandung informasi userinfo',
    description:
      'URL memuat informasi sebelum tanda @. Informasi tersebut tidak ditampilkan; hindari membagikan URL ini karena bisa mengandung kredensial.',
  };
};
