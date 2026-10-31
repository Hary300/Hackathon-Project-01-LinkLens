import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkPunycode = ({
  hostnameParts,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!hostnameParts.some((part) => part.startsWith('xn--'))) return null;

  return {
    header: 'Domain menggunakan Punycode',
    description:
      'Punycode dapat mewakili karakter Unicode yang tampak mirip huruf biasa. Cocokkan nama domain dengan alamat resmi; Punycode sendiri bukan bukti penipuan.',
  };
};
