/**
 * Bentuk hasil analisis lokal yang disimpan ke state `localResult` di `Main.tsx`.
 * `analyzeUrl()` mengembalikan objek seperti ini, lalu `UrlInputForm.tsx`
 * meneruskannya melalui `setLocalResult()`.
 *
 * Contoh:
 * {
 *   isSuspicious: true,
 *   checks: [
 *     {
 *       header: 'Koneksi menggunakan HTTP, bukan HTTPS',
 *       description: 'Koneksi HTTP tidak mengenkripsi data saat dikirim.',
 *     },
 *   ],
 * }
 */

export interface AnalyzeUrl {
  isSuspicious: boolean;
  checks: AnalyzeUrlCheck[];
}

export interface AnalyzeUrlCheck {
  header: string;
  description: string;
}

export interface UrlAnalysisContext {
  parsedUrl: URL;
  hostname: string;
  hostnameParts: string[];
  registrableDomainLabel: string;
  isIpv4: boolean;
  isIpv6: boolean;
  pathAndQuery: string;
}
