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
    header: 'Apakah nama layanan hanya muncul di bagian depan alamat?',
    description: `Ya. "${getKnownBrandDomain(brand)}" hanya muncul di bagian depan alamat; nama situs sebenarnya berada setelahnya. Jadi, alamat ini belum tentu milik layanan tersebut.`,
  };
};
