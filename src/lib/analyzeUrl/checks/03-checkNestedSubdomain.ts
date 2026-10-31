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
    header: 'Subdomain bertingkat atau panjang',
    description: `Hostname memiliki ${hostnameParts.length} bagian${hasSensitiveSubdomain ? ' dan subdomain yang menyerupai halaman login/verifikasi' : ''}. Banyak bagian dapat membuat domain utama sulit dikenali; periksa bagian domain sebelum memasukkan data.`,
  };
};
