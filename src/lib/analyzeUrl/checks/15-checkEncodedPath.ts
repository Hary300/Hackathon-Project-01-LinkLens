import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkEncodedPath = ({
  pathAndQuery,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const encodedSequences = pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? [];
  const hasEncodedUrlSeparators = /%(?:2f|5c|2e|40)/i.test(pathAndQuery);
  if (encodedSequences.length < 3 && !hasEncodedUrlSeparators) return null;

  return {
    header: 'Sebagian alamat sulit dibaca',
    description: `Ada ${encodedSequences.length} bagian alamat yang ditulis dengan kode${hasEncodedUrlSeparators ? ' dan dapat menyamarkan pemisah alamat' : ''}. Karena tujuan tautan jadi sulit dikenali, pastikan nama situs dan halaman akhirnya sesuai dengan layanan resmi.`,
  };
};
