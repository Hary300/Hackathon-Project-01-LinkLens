import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkNestedSubdomain = ({
  hostnameParts,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const subdomainLabels = hostnameParts.slice(0, -2);
  const hasSensitiveSubdomain = subdomainLabels.some((label) =>
    /^(login|signin|verify|verification|account|secure|update)$/i.test(label)
  );
  if (
    hostnameParts.length < 5 &&
    !(hostnameParts.length >= 4 && hasSensitiveSubdomain)
  ) {
    return null;
  }

  return {
    header: 'Alamat situs punya banyak bagian',
    description: `Alamat situs ini memiliki ${hostnameParts.length} bagian${hasSensitiveSubdomain ? ' dan ada kata yang menyerupai halaman masuk atau verifikasi' : ''}. Nama situs sebenarnya bisa sulit dikenali; cocokkan dengan alamat resmi sebelum masuk akun.`,
  };
};
