import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongHostname = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (hostname.length <= 50) return null;

  return {
    header: 'Nama situs sangat panjang',
    description: `Nama situs ini memiliki ${hostname.length} huruf dan angka sehingga nama aslinya sulit dikenali. Periksa ejaannya dengan teliti dan cocokkan dengan alamat resmi.`,
  };
};
