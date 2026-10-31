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
    header: 'Path atau query memuat kata yang sering digunakan dalam phishing',
    description:
      'Path atau parameter URL memuat kata seperti login, verify, password, account, atau payment. Kata ini juga digunakan situs resmi, jadi periksa sebagai sinyal tambahan saja.',
  };
};
