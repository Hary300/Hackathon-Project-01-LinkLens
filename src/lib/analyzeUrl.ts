export interface AnalyzeUrl {
  isSuspicious: boolean;
  checks: { header: string; description: string }[];
}

const knownBrandDomains: Record<string, string> = {
  amazon: 'amazon.com',
  apple: 'apple.com',
  bca: 'bca.co.id',
  facebook: 'facebook.com',
  google: 'google.com',
  instagram: 'instagram.com',
  mandiri: 'bankmandiri.co.id',
  microsoft: 'microsoft.com',
  netflix: 'netflix.com',
  paypal: 'paypal.com',
  shopee: 'shopee.co.id',
  tokopedia: 'tokopedia.com',
  whatsapp: 'whatsapp.com',
};

const multiPartPublicSuffixes = new Set([
  'co.id',
  'com.au',
  'com.br',
  'com.cn',
  'com.id',
  'co.uk',
  'go.id',
  'or.id',
]);

const shortenerDomains = new Set([
  'bit.ly',
  'cutt.ly',
  'is.gd',
  'lnkd.in',
  'rb.gy',
  's.id',
  'tiny.cc',
  'tinyurl.com',
  't.co',
]);

const redirectParameterNames = new Set([
  'dest',
  'destination',
  'next',
  'redirect',
  'redirect_to',
  'return',
  'returnurl',
  'target',
  'to',
  'url',
]);

const getRegistrableDomainLabel = (hostname: string) => {
  const labels = hostname.split('.');
  const suffix = labels.slice(-2).join('.');
  return labels[multiPartPublicSuffixes.has(suffix) ? -3 : -2] ?? labels[0];
};

const normalizeLookalikeCharacters = (value: string) =>
  value
    .replace(/0/g, 'o')
    .replace(/[1|]/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's');

const hasOneCharacterDifference = (left: string, right: string) => {
  if (Math.abs(left.length - right.length) > 1) return false;

  let leftIndex = 0;
  let rightIndex = 0;
  let differences = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) return false;

    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else {
      leftIndex += 1;
      rightIndex += 1;
    }
  }

  if (leftIndex < left.length || rightIndex < right.length) differences += 1;
  return differences === 1;
};

export const analyzeUrl = (url: string): AnalyzeUrl => {
  const checks: AnalyzeUrl['checks'] = [];
  const parsedUrl = new URL(url);

  // B11. Skema URL yang tidak didukung
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    checks.push({
      header: 'Skema URL tidak didukung',
      description: `Skema "${parsedUrl.protocol}" bukan link web HTTP/HTTPS yang didukung. Gunakan URL yang diawali http:// atau https://.`,
    });
    return { isSuspicious: true, checks };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const hostnameParts = hostname.split('.');
  const registrableDomainLabel = getRegistrableDomainLabel(hostname);
  const isIpv4 =
    hostnameParts.length === 4 &&
    hostnameParts.every((part) => /^\d+$/.test(part)) &&
    hostnameParts.every((part) => {
      const number = Number(part);
      return number >= 0 && number <= 255;
    });
  const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');

  // B9. Menggunakan HTTP, bukan HTTPS
  if (parsedUrl.protocol === 'http:') {
    checks.push({
      header: 'Koneksi menggunakan HTTP, bukan HTTPS',
      description:
        'Koneksi HTTP tidak mengenkripsi data saat dikirim. Ini peringatan keamanan koneksi, bukan bukti bahwa situs tersebut penipuan. HTTPS juga tidak menjamin situs tepercaya.',
    });
  }

  // D18. Menggunakan URL shortener
  const normalizedHostname = hostname.replace(/^www\./, '');
  if (shortenerDomains.has(normalizedHostname)) {
    checks.push({
      header: 'Menggunakan URL shortener',
      description:
        'URL shortener menyembunyikan alamat tujuan akhir. Tujuannya belum diketahui dan ini bukan bukti bahwa link berbahaya; jangan buka jika sumbernya tidak tepercaya.',
    });
  }

  // D19. Mengandung parameter redirect
  const redirectParameters = [...parsedUrl.searchParams.entries()].filter(
    ([name]) => redirectParameterNames.has(name.toLowerCase())
  );
  if (redirectParameters.length > 0) {
    checks.push({
      header: 'Mengandung parameter redirect',
      description: `Query memiliki parameter tujuan (${redirectParameters.map(([name]) => name).join(', ')}). Parameter ini dapat menentukan halaman lanjutan; periksa nilainya sebelum membuka link.`,
    });
  }

  // D20. Tujuan eksternal dicantumkan pada parameter redirect
  const externalRedirectTarget = redirectParameters
    .map(([, value]) => {
      try {
        return new URL(value, parsedUrl.origin);
      } catch {
        return null;
      }
    })
    .find(
      (target) =>
        target !== null &&
        ['http:', 'https:'].includes(target.protocol) &&
        target.hostname.toLowerCase() !== hostname
    );
  if (externalRedirectTarget) {
    checks.push({
      header: 'Parameter redirect mengarah ke domain lain',
      description: `Parameter redirect menunjuk ke "${externalRedirectTarget.hostname}", berbeda dari domain awal "${hostname}". Link dapat membawa kamu ke situs lain; jangan lanjut sebelum memastikan tujuan tersebut tepercaya.`,
    });
  }

  const pathAndQuery = `${parsedUrl.pathname}${parsedUrl.search}`;

  // C12. Kata yang sering digunakan dalam phishing pada path dan query
  if (
    /(?:^|[/_.?&=-])(login|signin|verify|verification|password|account|payment)(?=$|[/_.?&=-])/i.test(
      pathAndQuery
    )
  ) {
    checks.push({
      header:
        'Path atau query memuat kata yang sering digunakan dalam phishing',
      description:
        'Path atau parameter URL memuat kata seperti login, verify, password, account, atau payment. Kata ini juga digunakan situs resmi, jadi periksa sebagai sinyal tambahan saja.',
    });
  }

  // C13. URL mengandung banyak parameter
  const queryParameterCount = [...parsedUrl.searchParams.keys()].length;
  if (queryParameterCount >= 4) {
    checks.push({
      header: 'URL mengandung banyak parameter',
      description: `URL memiliki ${queryParameterCount} parameter query. Banyak parameter juga umum pada situs yang sah; periksa sebagai sinyal tambahan, bukan bukti penipuan.`,
    });
  }

  // C14. URL sangat panjang
  if (parsedUrl.href.length > 2000) {
    checks.push({
      header: 'URL sangat panjang',
      description: `URL ini memiliki ${parsedUrl.href.length} karakter. URL panjang dapat menyulitkan pemeriksaan alamat tujuan; panjang saja tidak membuktikan adanya ancaman.`,
    });
  }

  // C15. Karakter encoding atau obfuscation
  const encodedSequences = pathAndQuery.match(/%[0-9a-f]{2}/gi) ?? [];
  const hasEncodedUrlSeparators = /%(?:2f|5c|2e|40)/i.test(pathAndQuery);
  if (encodedSequences.length >= 3 || hasEncodedUrlSeparators) {
    checks.push({
      header: 'Path atau query menggunakan encoding',
      description: `Path atau query mengandung ${encodedSequences.length} karakter percent-encoded${hasEncodedUrlSeparators ? ', termasuk encoding untuk karakter pemisah URL' : ''}. Encoding dapat digunakan secara sah, tetapi pola yang sulit dibaca perlu diperiksa lebih lanjut.`,
    });
  }

  // C16. Path menyerupai file yang dapat dijalankan
  if (/\.(?:exe|msi|scr|bat|cmd|com|ps1|apk|jar)$/i.test(parsedUrl.pathname)) {
    checks.push({
      header: 'Path mengarah ke file yang dapat dijalankan',
      description:
        'URL berakhir dengan ekstensi file aplikasi atau skrip. Ekstensi tidak membuktikan isi file, tetapi jangan unduh atau jalankan file dari sumber yang tidak dikenal.',
    });
  }

  // C17. URL mengandung informasi userinfo
  if (parsedUrl.username || parsedUrl.password) {
    checks.push({
      header: 'URL mengandung informasi userinfo',
      description:
        'URL memuat informasi sebelum tanda @. Informasi tersebut tidak ditampilkan; hindari membagikan URL ini karena bisa mengandung kredensial.',
    });
  }

  // B10. Menggunakan port yang tidak umum
  if (parsedUrl.port && !['80', '443'].includes(parsedUrl.port)) {
    checks.push({
      header: 'URL menggunakan port yang tidak umum',
      description: `URL menggunakan port :${parsedUrl.port}. Port ini bisa dipakai layanan yang sah, tetapi tidak umum untuk halaman publik; pastikan alamatnya benar sebelum memasukkan data.`,
    });
  }

  // A1. Hostname berupa alamat IP
  if (isIpv4 || isIpv6) {
    checks.push({
      header: 'Hostname berupa alamat IP',
      description:
        'Alamat IP langsung tidak menunjukkan nama organisasi. Pastikan tujuan link benar sebelum memasukkan data.',
    });
  }

  // A2. URL menggunakan karakter @
  const hasUserInfo = /^https?:\/\/[^/?#]*@/i.test(parsedUrl.href);
  if (hasUserInfo) {
    checks.push({
      header: 'URL menggunakan karakter @',
      description: `Hostname tujuan sebenarnya adalah "${hostname}", bukan bagian sebelum tanda @. Periksa hostname ini sebelum membuka link.`,
    });
  }

  // A3. Subdomain bertingkat atau panjang
  const subdomainLabels = hostnameParts.slice(0, -2);
  const hasSensitiveSubdomain = subdomainLabels.some((label) =>
    /^(login|signin|verify|verification|account|secure|update)$/i.test(label)
  );
  if (
    hostnameParts.length >= 5 ||
    (hostnameParts.length >= 4 && hasSensitiveSubdomain)
  ) {
    checks.push({
      header: 'Subdomain bertingkat atau panjang',
      description: `Hostname memiliki ${hostnameParts.length} bagian${hasSensitiveSubdomain ? ' dan subdomain yang menyerupai halaman login/verifikasi' : ''}. Banyak bagian dapat membuat domain utama sulit dikenali; periksa bagian domain sebelum memasukkan data.`,
    });
  }

  // A4. Hostname sangat panjang
  if (hostname.length > 50) {
    checks.push({
      header: 'Hostname sangat panjang',
      description: `Hostname ini memiliki ${hostname.length} karakter. Alamat yang panjang dapat menyamarkan domain utama; periksa domainnya secara teliti.`,
    });
  }

  // A5. Domain menggunakan banyak tanda hubung atau angka
  const hyphenCount = (hostname.match(/-/g) ?? []).length;
  const digitCount = (hostname.match(/\d/g) ?? []).length;
  if (hyphenCount >= 3 || digitCount >= 4) {
    checks.push({
      header: 'Domain menggunakan banyak tanda hubung atau angka',
      description: `Hostname memiliki ${hyphenCount} tanda hubung dan ${digitCount} angka. Kombinasi ini dapat dipakai untuk meniru nama layanan, tetapi bukan bukti penipuan dengan sendirinya.`,
    });
  }

  // A6. Domain menggunakan karakter Unicode atau Punycode
  if (hostnameParts.some((part) => part.startsWith('xn--'))) {
    checks.push({
      header: 'Domain menggunakan Punycode',
      description:
        'Punycode dapat mewakili karakter Unicode yang tampak mirip huruf biasa. Cocokkan nama domain dengan alamat resmi; Punycode sendiri bukan bukti penipuan.',
    });
  }

  // A7. Tanda titik atau subdomain yang menyesatkan
  const misleadingBrandDomain = Object.entries(knownBrandDomains).find(
    ([, brandDomain]) => hostname.includes(`${brandDomain}.`)
  );
  if (misleadingBrandDomain) {
    const [brand] = misleadingBrandDomain;
    checks.push({
      header: 'Nama domain resmi ditempel sebagai subdomain',
      description: `Hostname memuat "${knownBrandDomains[brand]}" diikuti domain lain. Contohnya pola seperti "paypal.com.situs-lain.tld" tetap dimiliki domain setelahnya, bukan PayPal.`,
    });
  }

  // A8. Domain menyerupai brand terkenal
  const similarBrand = Object.keys(knownBrandDomains).find((brand) => {
    const normalizedLabel = normalizeLookalikeCharacters(
      registrableDomainLabel
    );
    return (
      registrableDomainLabel !== brand &&
      (normalizedLabel === brand ||
        hasOneCharacterDifference(normalizedLabel, brand))
    );
  });
  if (similarBrand) {
    checks.push({
      header: 'Domain menyerupai nama brand',
      description: `Nama domain "${registrableDomainLabel}" mirip dengan brand "${similarBrand}". Perbedaan satu huruf/angka dapat dipakai untuk menyamar; pastikan alamatnya melalui kanal resmi.`,
    });
  }

  return { isSuspicious: checks.length > 0, checks };
};
