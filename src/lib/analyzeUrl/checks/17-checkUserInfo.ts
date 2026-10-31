import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUserInfo = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.username && !parsedUrl.password) return null;

  return {
    header: 'Apakah alamat ini memuat tulisan sebelum tanda @?',
    description:
      'Ya. Tulisan sebelum tanda @ bisa mengalihkan perhatian dari nama situs sebenarnya atau berisi informasi akun. Nama situs tujuan ada setelah tanda @.',
  };
};
