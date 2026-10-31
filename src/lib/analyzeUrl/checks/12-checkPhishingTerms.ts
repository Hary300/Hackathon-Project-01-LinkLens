import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

export const checkPhishingTerms = ({
  pathAndQuery,
}: UrlAnalysisContext): AnalyzeUrlCheck | null => {
  if (
    !/(?:^|[/_.?&=-])(login|signin|verify|verification|password|account|payment)(?=$|[/_.?&=-])/i.test(
      pathAndQuery
    )
  ) {
    return null;
  }

  return {
    header: 'Apakah alamat ini mengarah ke halaman masuk atau pembayaran?',
    description:
      'Ya. Alamat ini memuat kata yang biasanya ada di halaman masuk atau pembayaran. Halaman seperti ini dapat meminta kata sandi atau data keuangan.',
  };
};
