import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHostnameCharacters = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const hyphenCount = (hostname.match(/-/g) ?? []).length;
  const digitCount = (hostname.match(/\d/g) ?? []).length;
  if (hyphenCount < 3 && digitCount < 4) return null;

  return {
    header: 'Nama situs memakai banyak angka atau tanda hubung',
    description: `Nama situs ini memiliki ${hyphenCount} tanda hubung dan ${digitCount} angka. Periksa setiap huruf dan angka, lalu bandingkan dengan alamat resmi agar tidak tertukar dengan nama yang mirip.`,
  };
};
