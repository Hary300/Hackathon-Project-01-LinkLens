import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUserInfo = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.username && !parsedUrl.password) return null;

  return {
    header: 'Alamat memuat tulisan sebelum tanda @',
    description:
      'Tulisan sebelum tanda @ bisa membuat nama situs sebenarnya sulit terlihat dan mungkin berisi informasi akun. Periksa nama situs setelah tanda @ dan jangan bagikan tautan ini.',
  };
};
