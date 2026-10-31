// Daftar domain resmi untuk membandingkan hostname pada pemeriksaan 7 dan 8.
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

// Suffix multi-label agar pemeriksaan 8 mengambil label domain yang tepat,
// misalnya "example" dari "shop.example.co.id".
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

// Domain pemendek URL yang diperiksa oleh pemeriksaan 18.
export const shortenerDomains = new Set([
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

// Nama query yang berpotensi menentukan tujuan redirect pada pemeriksaan 19 dan 20.
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

// Mengambil label domain yang dapat dibandingkan dengan nama brand;
// dipakai oleh pemeriksaan 8 melalui konteks analisis URL.
export const getRegistrableDomainLabel = (hostname: string) => {
  const labels = hostname.split('.');
  const suffix = labels.slice(-2).join('.');
  return labels[multiPartPublicSuffixes.has(suffix) ? -3 : -2] ?? labels[0];
};

// Mengubah beberapa karakter yang umum dipakai untuk meniru huruf brand;
// dipakai oleh findSimilarBrand untuk pemeriksaan 8.
export const normalizeLookalikeCharacters = (value: string) =>
  value
    .replace(/0/g, 'o')
    .replace(/[1|]/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's');

// Memeriksa apakah dua nama berbeda tepat satu karakter, termasuk satu
// karakter yang ditambah atau dihilangkan; dipakai pemeriksaan 8.
export const hasOneCharacterDifference = (left: string, right: string) => {
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

// Mengambil semua parameter query yang namanya dikenal sebagai parameter
// redirect; dipakai bersama oleh pemeriksaan 19 dan 20.
export const getRedirectParameters = (url: URL) =>
  [...url.searchParams.entries()].filter(([name]) =>
    redirectParameterNames.has(name.toLowerCase())
  );

// Mendeteksi nama domain resmi yang muncul sebelum label domain lain;
// dipakai oleh pemeriksaan 7.
export const findMisleadingBrandDomain = (hostname: string) =>
  Object.entries(knownBrandDomains).find(([, brandDomain]) =>
    hostname.includes(`${brandDomain}.`)
  );

// Mencari label domain yang sama atau hampir sama dengan brand yang dikenal;
// dipakai oleh pemeriksaan 8.
export const findSimilarBrand = (registrableDomainLabel: string) => {
  const normalizedLabel = normalizeLookalikeCharacters(registrableDomainLabel);

  return Object.keys(knownBrandDomains).find(
    (brand) =>
      registrableDomainLabel !== brand &&
      (normalizedLabel === brand ||
        hasOneCharacterDifference(normalizedLabel, brand))
  );
};

// Mengambil domain resmi untuk menjelaskan temuan pemeriksaan 7.
export const getKnownBrandDomain = (brand: string) => knownBrandDomains[brand];
