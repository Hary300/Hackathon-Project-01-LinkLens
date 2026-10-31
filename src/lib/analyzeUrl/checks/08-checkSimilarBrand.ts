import { findSimilarBrand } from '../helpers';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkSimilarBrand = ({
  registrableDomainLabel,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  const similarBrand = findSimilarBrand(registrableDomainLabel);
  if (!similarBrand) return null;

  return {
    header: 'Apakah nama situs ini mirip dengan nama layanan terkenal?',
    description: `Ya. Nama situs "${registrableDomainLabel}" mirip dengan "${similarBrand}". Perbedaan kecil seperti satu huruf atau angka mudah terlewat saat dibaca.`,
  };
};
