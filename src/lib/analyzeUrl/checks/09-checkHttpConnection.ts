import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHttpConnection = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.protocol !== 'http:') return null;

  return {
    header: 'Koneksi ke situs ini tidak terlindungi',
    description:
      'Kata sandi atau informasi pembayaran yang dikirim lewat koneksi ini bisa dilihat orang lain. Jangan isi data apa pun; cari alamat resmi layanan dan buka dari sana.',
  };
};
