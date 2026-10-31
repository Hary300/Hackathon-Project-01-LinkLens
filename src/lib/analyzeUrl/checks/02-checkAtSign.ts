import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkAtSign = ({
  parsedUrl,
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/^https?:\/\/[^/?#]*@/i.test(parsedUrl.href)) return null;

  return {
    header: 'Apakah alamat ini memakai tanda @?',
    description: `Ya. Tanda @ bisa menyamarkan alamat situs yang sebenarnya. Tautan ini membuka "${hostname}", jadi pastikan nama itu sesuai dengan layanan yang dituju.`,
  };
};
