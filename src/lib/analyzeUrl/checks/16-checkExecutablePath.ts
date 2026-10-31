import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkExecutablePath = ({
  parsedUrl,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/\.(?:exe|msi|scr|bat|cmd|com|ps1|apk|jar)$/i.test(parsedUrl.pathname)) {
    return null;
  }

  return {
    header: 'Apakah tautan ini mengarah ke berkas aplikasi?',
    description:
      'Ya. Tautan ini menuju berkas aplikasi yang bisa mengubah perangkat saat dibuka. Berkas dari sumber yang salah dapat membahayakan perangkat atau data.',
  };
};
