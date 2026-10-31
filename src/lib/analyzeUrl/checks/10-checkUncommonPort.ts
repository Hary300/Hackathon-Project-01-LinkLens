import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUncommonPort = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.port || ['80', '443'].includes(parsedUrl.port)) return null;

  return {
    header: 'Apakah alamat ini memakai nomor tambahan yang tidak biasa?',
    description: `Ya. Alamat ini memakai nomor :${parsedUrl.port}, yang tidak biasa untuk situs umum. Nomor ini menentukan tujuan sambungan, jadi pastikan memang digunakan oleh layanan yang dituju.`,
  };
};
