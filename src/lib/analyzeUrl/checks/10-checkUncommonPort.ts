import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkUncommonPort = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!parsedUrl.port || ['80', '443'].includes(parsedUrl.port)) return null;

  return {
    header: 'Alamat memakai nomor tambahan yang tidak biasa',
    description: `Alamat ini memakai nomor :${parsedUrl.port} yang tidak umum untuk situs biasa. Pastikan nomor ini diberikan oleh layanan resmi sebelum membuka halaman atau mengisi data.`,
  };
};
