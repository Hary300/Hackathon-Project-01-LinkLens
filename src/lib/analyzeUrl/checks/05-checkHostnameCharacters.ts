import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHostnameCharacters = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const hyphenCount = (hostname.match(/-/g) ?? []).length;
  const digitCount = (hostname.match(/\d/g) ?? []).length;
  if (hyphenCount < 3 && digitCount < 4) return null;

  return {
    header: 'Domain menggunakan banyak tanda hubung atau angka',
    description: `Hostname memiliki ${hyphenCount} tanda hubung dan ${digitCount} angka. Kombinasi ini dapat dipakai untuk meniru nama layanan, tetapi bukan bukti penipuan dengan sendirinya.`,
  };
};
