import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkEncodedPath = ({
  pathAndQuery,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const encodedSequences = pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? [];
  const hasEncodedUrlSeparators = /%(?:2f|5c|2e|40)/i.test(pathAndQuery);
  if (encodedSequences.length < 3 && !hasEncodedUrlSeparators) return null;

  return {
    header: 'Path atau query menggunakan encoding',
    description: `Path atau query mengandung ${encodedSequences.length} karakter percent-encoded${hasEncodedUrlSeparators ? ', termasuk encoding untuk karakter pemisah URL' : ''}. Encoding dapat digunakan secara sah, tetapi pola yang sulit dibaca perlu diperiksa lebih lanjut.`,
  };
};
