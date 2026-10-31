import type { AnalyzeUrlCheck } from '../types';

export const checkUnsupportedProtocol = (
  parsedUrl: URL
): AnalyzeUrlCheck | null => {
  if (['http:', 'https:'].includes(parsedUrl.protocol)) return null;

  return {
    header: 'Skema URL tidak didukung',
    description: `Skema "${parsedUrl.protocol}" bukan link web HTTP/HTTPS yang didukung. Gunakan URL yang diawali http:// atau https://.`,
  };
};
