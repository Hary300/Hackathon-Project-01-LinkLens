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
    header: 'Alamat mengarah ke halaman masuk atau pembayaran',
    description:
      'Halaman ini mungkin meminta kata sandi, data akun, atau pembayaran. Pastikan nama situs benar-benar milik layanan yang kamu tuju sebelum mengisi apa pun.',
  };
};
