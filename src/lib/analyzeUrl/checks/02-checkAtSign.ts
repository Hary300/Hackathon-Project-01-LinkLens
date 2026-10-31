import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkAtSign = ({
  parsedUrl,
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (!/^https?:\/\/[^/?#]*@/i.test(parsedUrl.href)) return null;

  return {
    header: 'URL menggunakan karakter @',
    description: `Hostname tujuan sebenarnya adalah "${hostname}", bukan bagian sebelum tanda @. Periksa hostname ini sebelum membuka link.`,
  };
};
