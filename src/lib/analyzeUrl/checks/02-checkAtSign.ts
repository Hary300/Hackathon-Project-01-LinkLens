import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkAtSign = ({
  parsedUrl,
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/^https?:\/\/[^/?#]*@/i.test(parsedUrl.href)) return null;

  return {
    header: 'Alamat memakai tanda @',
    description: `Tanda @ dapat menyamarkan alamat situs yang sebenarnya. Tujuan tautan ini adalah "${hostname}". Pastikan nama situs tersebut sesuai dengan layanan resmi sebelum mengisi data.`,
  };
};
