import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHostnameCharacters = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const hyphenCount = (hostname.match(/-/g) ?? []).length;
  const digitCount = (hostname.match(/\d/g) ?? []).length;
  if (hyphenCount < 3 && digitCount < 4) return null;

  return {
    header: 'Apakah nama situs ini memakai banyak angka atau tanda hubung?',
    description: `Ya. Nama situs ini memakai ${hyphenCount} tanda hubung dan ${digitCount} angka. Gabungan ini dapat membuatnya terlihat seperti nama layanan lain.`,
  };
};
