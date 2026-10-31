import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkPunycode = ({
  hostnameParts,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!hostnameParts.some((part) => part.startsWith('xn--'))) return null;

  return {
    header: 'Nama situs memakai huruf khusus',
    description:
      'Beberapa huruf pada nama situs bisa terlihat sama, padahal sebenarnya berbeda. Periksa nama situs dengan teliti dan cocokkan dengan alamat resmi sebelum masuk akun.',
  };
};
