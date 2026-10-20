export interface AnalyzeUrl {
  isSuspicious: boolean;
  reasons: string[];
}

export const analyzeUrl = (url: string): AnalyzeUrl => {
  let isSuspicious = false;
  const reasons: string[] = [];
  const hostname = new URL(url).hostname;
  const hostnameArr = hostname.split('.');

  if (hostnameArr.length === 4) {
    const allAreNumbers = hostnameArr.every((item) => /^\d+$/.test(item));
    if (allAreNumbers) {
      const isBetween0And255 = hostnameArr.every((item) => {
        const number = Number(item);
        return number >= 0 && number <= 255;
      });

      if (isBetween0And255) {
        isSuspicious = true;
        reasons.push('Url menggunakan alamat IP sebagai hostname');
      }
    }
  }

  return { isSuspicious, reasons };
};
