import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkExecutablePath = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/\.(?:exe|msi|scr|bat|cmd|com|ps1|apk|jar)$/i.test(parsedUrl.pathname)) {
    return null;
  }

  return {
    header: 'Tautan mengarah ke berkas aplikasi',
    description:
      'Berkas aplikasi dapat mengubah perangkat saat dibuka. Unduh hanya dari situs resmi dan pastikan kamu mengenali pembuat berkasnya.',
  };
};
