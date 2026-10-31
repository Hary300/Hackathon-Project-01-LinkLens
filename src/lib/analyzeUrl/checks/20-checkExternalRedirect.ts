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
    header: 'Parameter redirect mengarah ke domain lain',
    description: `Parameter redirect menunjuk ke "${externalRedirectTarget.hostname}", berbeda dari domain awal "${hostname}". Link dapat membawa kamu ke situs lain; jangan lanjut sebelum memastikan tujuan tersebut tepercaya.`,
  };
};
