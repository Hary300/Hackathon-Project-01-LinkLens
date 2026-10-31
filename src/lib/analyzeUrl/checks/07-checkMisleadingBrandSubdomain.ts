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
    header: 'Nama layanan hanya muncul di bagian depan alamat',
    description: `Alamat memuat "${getKnownBrandDomain(brand)}" di bagian depan, tetapi nama situs sebenarnya berada setelahnya. Pastikan nama situs paling akhir cocok dengan alamat resmi layanan tersebut.`,
  };
};
