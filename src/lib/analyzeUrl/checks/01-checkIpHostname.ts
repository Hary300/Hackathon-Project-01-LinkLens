import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkIpHostname = ({
  isIpv4,
  isIpv6,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!isIpv4 && !isIpv6) return null;

  return {
    header: 'Hostname berupa alamat IP',
    description:
      'Alamat IP langsung tidak menunjukkan nama organisasi. Pastikan tujuan link benar sebelum memasukkan data.',
  };
};
