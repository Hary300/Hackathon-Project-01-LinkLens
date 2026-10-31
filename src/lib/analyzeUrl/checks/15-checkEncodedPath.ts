import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkEncodedPath = ({
  pathAndQuery,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const encodedSequences = pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? [];
  const hasEncodedUrlSeparators = /%(?:2f|5c|2e|40)/i.test(pathAndQuery);
  if (encodedSequences.length < 3 && !hasEncodedUrlSeparators) return null;

  return {
    header: 'Apakah ada bagian alamat yang sulit dibaca?',
    description: `Ya. Ada ${encodedSequences.length} bagian alamat yang ditulis dengan kode${hasEncodedUrlSeparators ? ' termasuk kode yang menyamarkan pemisah alamat' : ''}. Akibatnya, isi dan tujuan tautan lebih sulit dibaca.`,
  };
};
