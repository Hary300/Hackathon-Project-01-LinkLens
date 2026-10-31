import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkIpHostname = ({
  isIpv4,
  isIpv6,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!isIpv4 && !isIpv6) return null;

  return {
    header: 'Alamat situs hanya berupa angka',
    description:
      'Alamat situs hanya berupa angka, jadi sulit mengetahui siapa pemiliknya. Pastikan tautan ini berasal dari layanan resmi sebelum dibuka atau diisi.',
  };
};
