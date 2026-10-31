import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkLongHostname = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (hostname.length <= 50) return null;

  return {
    header: 'Apakah nama situs ini sangat panjang?',
    description: `Ya. Nama situs ini memiliki ${hostname.length} huruf dan angka, sehingga lebih sulit dibaca dan bisa menyerupai nama situs lain.`,
  };
};
