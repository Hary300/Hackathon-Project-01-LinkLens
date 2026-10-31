import { checkIpHostname } from './01-checkIpHostname';
import { checkAtSign } from './02-checkAtSign';
import { checkNestedSubdomain } from './03-checkNestedSubdomain';
import { checkLongHostname } from './04-checkLongHostname';
import { checkHostnameCharacters } from './05-checkHostnameCharacters';
import { checkPunycode } from './06-checkPunycode';
import { checkMisleadingBrandSubdomain } from './07-checkMisleadingBrandSubdomain';
import { checkSimilarBrand } from './08-checkSimilarBrand';
import { checkHttpConnection } from './09-checkHttpConnection';
import { checkUncommonPort } from './10-checkUncommonPort';
import { checkPhishingTerms } from './12-checkPhishingTerms';
import { checkManyQueryParameters } from './13-checkManyQueryParameters';
import { checkLongUrl } from './14-checkLongUrl';
import { checkEncodedPath } from './15-checkEncodedPath';
import { checkExecutablePath } from './16-checkExecutablePath';
import { checkUserInfo } from './17-checkUserInfo';
import { checkUrlShortener } from './18-checkUrlShortener';
import { checkRedirectParameter } from './19-checkRedirectParameter';
import { checkExternalRedirect } from './20-checkExternalRedirect';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

const checks = [
  // 1. Mendeteksi hostname yang berupa alamat IPv4 atau IPv6 langsung.
  checkIpHostname,
  // 2. Mendeteksi tanda @ yang dapat menyamarkan hostname tujuan.
  checkAtSign,
  // 3. Menandai hostname dengan banyak tingkat subdomain atau label sensitif.
  checkNestedSubdomain,
  // 4. Menandai hostname yang panjangnya lebih dari 50 karakter.
  checkLongHostname,
  // 5. Menandai hostname dengan banyak tanda hubung atau angka.
  checkHostnameCharacters,
  // 6. Mendeteksi label domain Punycode yang dapat mewakili karakter Unicode.
  checkPunycode,
  // 7. Mendeteksi nama domain resmi yang ditempel sebagai subdomain domain lain.
  checkMisleadingBrandSubdomain,
  // 8. Mendeteksi label domain yang mirip dengan nama brand yang dikenal.
  checkSimilarBrand,
  // 9. Memperingatkan koneksi HTTP yang tidak mengenkripsi data.
  checkHttpConnection,
  // 10. Menandai port selain port HTTP/HTTPS standar.
  checkUncommonPort,
  // 12. Mencari kata yang umum pada halaman login atau phishing di path dan query.
  checkPhishingTerms,
  // 13. Menandai URL dengan empat atau lebih parameter query.
  checkManyQueryParameters,
  // 14. Menandai URL yang panjangnya lebih dari 2.000 karakter.
  checkLongUrl,
  // 15. Mendeteksi encoding berulang atau encoding karakter pemisah URL.
  checkEncodedPath,
  // 16. Mendeteksi path yang berakhir dengan ekstensi file aplikasi atau skrip.
  checkExecutablePath,
  // 17. Memperingatkan informasi user atau password yang tertanam di URL.
  checkUserInfo,
  // 18. Menandai layanan pemendek URL yang menyembunyikan alamat tujuan akhir.
  checkUrlShortener,
  // 19. Mendeteksi parameter query yang umum dipakai untuk menentukan tujuan redirect.
  checkRedirectParameter,
  // 20. Memeriksa apakah parameter redirect menunjuk ke hostname lain.
  checkExternalRedirect,
];

export const runUrlChecks = (
  context: UrlAnalysisContext
): AnalyzeUrlCheck[] =>
  checks
    .map((check) => check(context))
    .filter((check): check is AnalyzeUrlCheck => check !== null);
