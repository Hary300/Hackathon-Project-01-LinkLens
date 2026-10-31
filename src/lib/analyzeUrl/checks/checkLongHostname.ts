import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongHostname = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (hostname.length <= 50) return null;

  return {
    header: 'Hostname sangat panjang',
    description: `Hostname ini memiliki ${hostname.length} karakter. Alamat yang panjang dapat menyamarkan domain utama; periksa domainnya secara teliti.`,
  };
};
