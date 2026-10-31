import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkIpHostname = ({
  isIpv4,
  isIpv6,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!isIpv4 && !isIpv6) return null;

  return {
    header: 'Apakah alamat situs ini hanya berupa angka?',
    description:
      'Ya. Alamat ini memakai angka, bukan nama situs yang biasa dikenali. Karena itu, pemiliknya lebih sulit diketahui.',
  };
};
