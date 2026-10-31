import { runUrlChecks } from './analyzeUrl/checks';
import { getRegistrableDomainLabel } from './analyzeUrl/helpers';
import { checkUnsupportedProtocol } from './analyzeUrl/checks/checkUnsupportedProtocol';
import type { AnalyzeUrl, UrlAnalysisContext } from './analyzeUrl/types';

export type { AnalyzeUrl } from './analyzeUrl/types';

export const analyzeUrl = (url: string): AnalyzeUrl => {
  // Parse URL sekali agar seluruh pemeriksaan memakai hasil parsing yang sama.
  const parsedUrl = new URL(url);

  // Tolak skema selain HTTP/HTTPS sebelum menjalankan pemeriksaan lainnya.
  const unsupportedProtocolCheck = checkUnsupportedProtocol(parsedUrl);

  if (unsupportedProtocolCheck) {
    return { isSuspicious: true, checks: [unsupportedProtocolCheck] };
  }

  // Siapkan informasi hostname dan URL yang dipakai oleh fungsi-fungsi pemeriksaan.
  const hostname = parsedUrl.hostname.toLowerCase();
  const hostnameParts = hostname.split('.');
  // Bedakan alamat IP dari hostname domain agar aturan hostname bisa memilih kondisi yang tepat.
  const isIpv4 =
    hostnameParts.length === 4 &&
    hostnameParts.every((part) => /^\d+$/.test(part)) &&
    hostnameParts.every((part) => {
      const number = Number(part);
      return number >= 0 && number <= 255;
    });
  const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');

  const context: UrlAnalysisContext = {
    parsedUrl,
    hostname,
    hostnameParts,
    registrableDomainLabel: getRegistrableDomainLabel(hostname),
    isIpv4,
    isIpv6,
    pathAndQuery: `${parsedUrl.pathname}${parsedUrl.search}`,
  };

  // Jalankan semua pemeriksaan yang didaftarkan di analyzeUrl/checks/index.ts.
  const checks = runUrlChecks(context);

  // URL ditandai mencurigakan jika setidaknya satu pemeriksaan menghasilkan temuan.
  return { isSuspicious: checks.length > 0, checks };
};
