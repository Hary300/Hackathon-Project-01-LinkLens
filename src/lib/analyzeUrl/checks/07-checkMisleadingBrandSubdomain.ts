import {
  findMisleadingBrandDomain,
  getKnownBrandDomain,
} from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkMisleadingBrandSubdomain = ({
  hostname,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const misleadingBrandDomain = findMisleadingBrandDomain(hostname);
  if (!misleadingBrandDomain) return null;

  const [brand] = misleadingBrandDomain;

  return {
    header: 'Nama domain resmi ditempel sebagai subdomain',
    description: `Hostname memuat "${getKnownBrandDomain(brand)}" diikuti domain lain. Contohnya pola seperti "paypal.com.situs-lain.tld" tetap dimiliki domain setelahnya, bukan PayPal.`,
  };
};
