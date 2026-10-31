import { findSimilarBrand } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkSimilarBrand = ({
  registrableDomainLabel,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const similarBrand = findSimilarBrand(registrableDomainLabel);
  if (!similarBrand) return null;

  return {
    header: 'Domain menyerupai nama brand',
    description: `Nama domain "${registrableDomainLabel}" mirip dengan brand "${similarBrand}". Perbedaan satu huruf/angka dapat dipakai untuk menyamar; pastikan alamatnya melalui kanal resmi.`,
  };
};
