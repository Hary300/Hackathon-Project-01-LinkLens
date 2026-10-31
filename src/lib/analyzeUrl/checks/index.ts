import { checkAtSign } from './checkAtSign';
import { checkEncodedPath } from './checkEncodedPath';
import { checkExecutablePath } from './checkExecutablePath';
import { checkExternalRedirect } from './checkExternalRedirect';
import { checkHttpConnection } from './checkHttpConnection';
import { checkHostnameCharacters } from './checkHostnameCharacters';
import { checkIpHostname } from './checkIpHostname';
import { checkLongHostname } from './checkLongHostname';
import { checkLongUrl } from './checkLongUrl';
import { checkManyQueryParameters } from './checkManyQueryParameters';
import { checkMisleadingBrandSubdomain } from './checkMisleadingBrandSubdomain';
import { checkNestedSubdomain } from './checkNestedSubdomain';
import { checkPhishingTerms } from './checkPhishingTerms';
import { checkPunycode } from './checkPunycode';
import { checkRedirectParameter } from './checkRedirectParameter';
import { checkSimilarBrand } from './checkSimilarBrand';
import { checkUncommonPort } from './checkUncommonPort';
import { checkUrlShortener } from './checkUrlShortener';
import { checkUserInfo } from './checkUserInfo';
import type { AnalyzeUrlCheck, UrlAnalysisContext } from '../types';

const checks = [
  // Memperingatkan koneksi HTTP yang tidak mengenkripsi data.
  checkHttpConnection,
  // Menandai layanan pemendek URL yang menyembunyikan alamat tujuan akhir.
  checkUrlShortener,
  // Mendeteksi parameter query yang umum dipakai untuk menentukan tujuan redirect.
  checkRedirectParameter,
  // Memeriksa apakah nilai parameter redirect menuju hostname lain.
  checkExternalRedirect,
  // Mencari kata yang umum pada halaman login atau phishing di path dan query.
  checkPhishingTerms,
  // Menandai URL dengan empat atau lebih parameter query.
  checkManyQueryParameters,
  // Menandai URL yang panjangnya lebih dari 2.000 karakter.
  checkLongUrl,
  // Mendeteksi encoding berulang atau encoding karakter pemisah URL.
  checkEncodedPath,
  // Mendeteksi path yang berakhir dengan ekstensi file aplikasi atau skrip.
  checkExecutablePath,
  // Memperingatkan informasi user atau password yang tertanam di URL.
  checkUserInfo,
  // Menandai port selain port HTTP/HTTPS standar.
  checkUncommonPort,
  // Mendeteksi hostname yang berupa alamat IPv4 atau IPv6 langsung.
  checkIpHostname,
  // Mendeteksi tanda @ pada bagian authority URL yang dapat menyamarkan hostname tujuan.
  checkAtSign,
  // Menandai hostname dengan banyak tingkat subdomain atau label sensitif.
  checkNestedSubdomain,
  // Menandai hostname yang panjangnya lebih dari 50 karakter.
  checkLongHostname,
  // Menandai hostname dengan setidaknya tiga tanda hubung atau empat angka.
  checkHostnameCharacters,
  // Mendeteksi label domain Punycode yang dapat mewakili karakter Unicode.
  checkPunycode,
  // Mendeteksi nama domain resmi yang ditempel sebagai subdomain domain lain.
  checkMisleadingBrandSubdomain,
  // Mendeteksi label domain yang mirip dengan nama brand yang dikenal.
  checkSimilarBrand,
];

export const runUrlChecks = (
  context: UrlAnalysisContext
): AnalyzeUrlCheck[] =>
  checks
    .map((check) => check(context))
    .filter((check): check is AnalyzeUrlCheck => check !== null);
