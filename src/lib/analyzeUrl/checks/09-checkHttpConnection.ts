import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkHttpConnection = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (parsedUrl.protocol !== 'http:') return null;

  return {
    header: 'Apakah koneksi ke situs ini tidak terlindungi?',
    description:
      'Ya. Alamat situs ini memakai http://, sehingga data tidak disamarkan saat dikirim. Orang lain yang dapat mengintip koneksi internet yang sama bisa membaca kata sandi atau informasi pembayaran.',
  };
};
