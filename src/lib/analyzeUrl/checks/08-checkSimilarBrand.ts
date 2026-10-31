import { findSimilarBrand } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkSimilarBrand = ({
  registrableDomainLabel,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const similarBrand = findSimilarBrand(registrableDomainLabel);
  if (!similarBrand) return null;

  return {
    header: 'Nama situs mirip dengan nama layanan terkenal',
    description: `Nama situs "${registrableDomainLabel}" mirip dengan "${similarBrand}". Perbedaan satu huruf atau angka mudah terlewat; periksa ejaannya dan cocokkan dengan alamat resmi.`,
  };
};
