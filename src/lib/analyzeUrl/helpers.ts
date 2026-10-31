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

export const getRegistrableDomainLabel = (hostname: string) => {
  const labels = hostname.split('.');
  const suffix = labels.slice(-2).join('.');
  return labels[multiPartPublicSuffixes.has(suffix) ? -3 : -2] ?? labels[0];
};

export const normalizeLookalikeCharacters = (value: string) =>
  value
    .replace(/0/g, 'o')
    .replace(/[1|]/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's');

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

export const getRedirectParameters = (url: URL) =>
  [...url.searchParams.entries()].filter(([name]) =>
    redirectParameterNames.has(name.toLowerCase())
  );

export const findMisleadingBrandDomain = (hostname: string) =>
  Object.entries(knownBrandDomains).find(([, brandDomain]) =>
    hostname.includes(`${brandDomain}.`)
  );

export const findSimilarBrand = (registrableDomainLabel: string) => {
  const normalizedLabel = normalizeLookalikeCharacters(registrableDomainLabel);

  return Object.keys(knownBrandDomains).find(
    (brand) =>
      registrableDomainLabel !== brand &&
      (normalizedLabel === brand ||
        hasOneCharacterDifference(normalizedLabel, brand))
  );
};

export const getKnownBrandDomain = (brand: string) => knownBrandDomains[brand];
