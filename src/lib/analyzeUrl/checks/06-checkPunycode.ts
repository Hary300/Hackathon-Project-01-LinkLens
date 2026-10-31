import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkPunycode = ({
  hostnameParts,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!hostnameParts.some((part) => part.startsWith('xn--'))) return null;

  return {
    header: 'Apakah nama situs ini memakai huruf khusus?',
    description:
      'Ya. Ada huruf khusus yang bisa terlihat sama seperti huruf biasa, padahal berbeda. Hal ini dapat membuat nama situs sulit dibedakan dari yang asli.',
  };
};
