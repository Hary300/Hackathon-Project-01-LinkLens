import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkExecutablePath = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/\.(?:exe|msi|scr|bat|cmd|com|ps1|apk|jar)$/i.test(parsedUrl.pathname)) {
    return null;
  }

  return {
    header: 'Path mengarah ke file yang dapat dijalankan',
    description:
      'URL berakhir dengan ekstensi file aplikasi atau skrip. Ekstensi tidak membuktikan isi file, tetapi jangan unduh atau jalankan file dari sumber yang tidak dikenal.',
  };
};
