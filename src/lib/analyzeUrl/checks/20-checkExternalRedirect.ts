import { getRedirectParameters } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkExternalRedirect = ({
  parsedUrl,
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const externalRedirectTarget = getRedirectParameters(parsedUrl)
    .map(([, value]) => {
      try {
        return new URL(value, parsedUrl.origin);
      } catch {
        return null;
      }
    })
    .find(
      (target) =>
        target !== null &&
        ['http:', 'https:'].includes(target.protocol) &&
        target.hostname.toLowerCase() !== hostname
    );

  if (!externalRedirectTarget) return null;

  return {
    header: 'Apakah tautan ini mengarah ke situs yang berbeda?',
    description: `Ya. Tautan ini membawa kamu dari "${hostname}" ke "${externalRedirectTarget.hostname}". Situs tujuan berbeda dari situs awal, jadi pastikan kamu mengenalinya sebelum mengisi data.`,
  };
};
