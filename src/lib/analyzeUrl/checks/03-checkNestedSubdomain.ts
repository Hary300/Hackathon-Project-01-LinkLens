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
    header: 'Apakah alamat situs ini punya banyak bagian?',
    description: `Ya. Alamat ini memiliki ${hostnameParts.length} bagian${hasSensitiveSubdomain ? ' dan memuat kata yang menyerupai halaman masuk atau verifikasi' : ''}. Banyak bagian membuat nama situs sebenarnya lebih sulit dikenali.`,
  };
};
