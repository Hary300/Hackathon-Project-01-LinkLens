import { describe, expect, it } from 'vitest';
import { analyzeUrl } from './analyzeUrl';

const getCheck = (url: string, header: string) =>
  analyzeUrl(url).checks.find((check) => check.header === header);

describe('analyzeUrl - indikator A: struktur hostname dan domain', () => {
  it.each([
    ['192.0.2.10', 'IPv4'],
    ['[2001:db8::1]', 'IPv6'],
  ])('mendeteksi hostname berupa alamat %s (%s)', (hostname) => {
    const result = analyzeUrl(`http://${hostname}/login`);

    expect(result.isSuspicious).toBe(true);
    expect(
      getCheck(`http://${hostname}/login`, 'Hostname berupa alamat IP')
    ).toBeDefined();
  });

  it('tidak menandai hostname domain biasa sebagai alamat IP', () => {
    const result = analyzeUrl('https://shop.example/home');

    expect(result.checks).toEqual([]);
    expect(result.isSuspicious).toBe(false);
  });

  it('mendeteksi userinfo sebelum @ dan menjelaskan hostname tujuan sebenarnya', () => {
    const result = analyzeUrl('https://paypal.com@evil.invalid/login');
    const check = getCheck(
      'https://paypal.com@evil.invalid/login',
      'URL menggunakan karakter @'
    );

    expect(result.isSuspicious).toBe(true);
    expect(check?.description).toContain('evil.invalid');
  });

  it('tidak menandai @ pada path atau query sebagai userinfo', () => {
    const result = analyzeUrl('https://shop.example/contact@support');

    expect(result.checks).toEqual([]);
  });

  it('mendeteksi subdomain bertingkat atau subdomain login yang mencurigakan', () => {
    const url = 'https://login.account.verify.example.com/signin';

    expect(getCheck(url, 'Subdomain bertingkat atau panjang')).toBeDefined();
  });

  it('tidak menandai subdomain bertingkat biasa tanpa pola sensitif', () => {
    const result = analyzeUrl('https://cdn.shop.example.com/image.png');

    expect(result.checks).toEqual([]);
  });

  it('mendeteksi hostname yang lebih panjang dari 50 karakter', () => {
    const hostname = `${'a'.repeat(51)}.invalid`;
    const url = `https://${hostname}/`;

    expect(getCheck(url, 'Hostname sangat panjang')).toBeDefined();
  });

  it('tidak menandai hostname dengan panjang tepat 50 karakter', () => {
    const hostname = `${'a'.repeat(42)}.invalid`;
    expect(hostname.length).toBe(50);

    expect(
      getCheck(`https://${hostname}/`, 'Hostname sangat panjang')
    ).toBeUndefined();
  });

  it('mendeteksi beberapa tanda hubung pada hostname', () => {
    const url = 'https://secure-account-login-check.invalid/';

    expect(
      getCheck(url, 'Domain menggunakan banyak tanda hubung atau angka')
    ).toBeDefined();
  });

  it('mendeteksi beberapa angka pada hostname', () => {
    const url = 'https://account2026.invalid/';

    expect(
      getCheck(url, 'Domain menggunakan banyak tanda hubung atau angka')
    ).toBeDefined();
  });

  it('tidak menandai satu tanda hubung atau sedikit angka saja', () => {
    const result = analyzeUrl('https://shop-2.example/');

    expect(result.checks).toEqual([]);
  });

  it('mendeteksi label domain Punycode', () => {
    const url = 'https://xn--pple-43d.invalid/';

    expect(getCheck(url, 'Domain menggunakan Punycode')).toBeDefined();
  });

  it('mendeteksi domain resmi brand yang ditempel sebelum domain lain', () => {
    const url = 'https://paypal.com.login-check.invalid/';

    expect(
      getCheck(url, 'Nama domain resmi ditempel sebagai subdomain')
    ).toBeDefined();
  });

  it('tidak menandai domain resmi brand yang berdiri sendiri dengan pola subdomain', () => {
    const url = 'https://paypal.com/';

    expect(
      getCheck(url, 'Nama domain resmi ditempel sebagai subdomain')
    ).toBeUndefined();
  });

  it('mendeteksi domain dengan angka yang menggantikan huruf pada nama brand', () => {
    const url = 'https://paypa1.invalid/';

    expect(getCheck(url, 'Domain menyerupai nama brand')).toBeDefined();
  });

  it('tidak menandai domain brand yang cocok persis', () => {
    const url = 'https://paypal.com/';

    expect(getCheck(url, 'Domain menyerupai nama brand')).toBeUndefined();
  });
});

describe('analyzeUrl - indikator B: protokol dan koneksi', () => {
  it('memberi peringatan untuk HTTP tanpa menyebutnya bukti penipuan', () => {
    const url = 'http://connection-check.invalid/login';
    const result = analyzeUrl(url);
    const check = getCheck(url, 'Koneksi menggunakan HTTP, bukan HTTPS');

    expect(result.isSuspicious).toBe(true);
    expect(check?.description).toContain('bukan bukti');
    expect(check?.description).toContain('HTTPS juga tidak menjamin');
  });

  it('tidak memberi peringatan HTTP pada koneksi HTTPS', () => {
    const url = 'https://connection-check.invalid/login';

    expect(
      getCheck(url, 'Koneksi menggunakan HTTP, bukan HTTPS')
    ).toBeUndefined();
  });

  it.each([
    'http://connection-check.invalid:8080/',
    'https://connection-check.invalid:8443/',
  ])('memberi peringatan untuk port nonstandar pada %s', (url) => {
    const check = getCheck(url, 'URL menggunakan port yang tidak umum');

    expect(check?.description).toContain('bisa dipakai layanan yang sah');
  });

  it.each([
    'http://connection-check.invalid:80/',
    'https://connection-check.invalid:443/',
    'https://connection-check.invalid/',
  ])(
    'tidak memberi peringatan port untuk port standar atau tanpa port: %s',
    (url) => {
      expect(
        getCheck(url, 'URL menggunakan port yang tidak umum')
      ).toBeUndefined();
    }
  );

  it.each([
    ['ftp://connection-check.invalid/file', 'ftp:'],
    ['javascript:alert(1)', 'javascript:'],
    ['file:///temporary/document.pdf', 'file:'],
  ])('menolak skema URL yang tidak didukung: %s', (url, protocol) => {
    const result = analyzeUrl(url);
    const check = getCheck(url, 'Skema URL tidak didukung');

    expect(result.isSuspicious).toBe(true);
    expect(result.checks).toHaveLength(1);
    expect(check?.description).toContain(protocol);
  });

  it('menerima skema HTTP dan HTTPS untuk analisis lanjutan', () => {
    expect(() => analyzeUrl('http://connection-check.invalid/')).not.toThrow();
    expect(() => analyzeUrl('https://connection-check.invalid/')).not.toThrow();
  });
});

describe('analyzeUrl - indikator C: path dan parameter URL', () => {
  it.each([
    'https://site.invalid/verify-account/reset-password',
    'https://site.invalid/checkout?next=payment',
  ])(
    'mendeteksi kata yang sering digunakan dalam phishing di path/query: %s',
    (url) => {
      expect(
        getCheck(
          url,
          'Path atau query memuat kata yang sering digunakan dalam phishing'
        )
      ).toBeDefined();
    }
  );

  it('tidak mencari kata phishing di hostname', () => {
    const url = 'https://login-account.invalid/home';

    expect(
      getCheck(
        url,
        'Path atau query memuat kata yang sering digunakan dalam phishing'
      )
    ).toBeUndefined();
  });

  it('mendeteksi empat atau lebih parameter query', () => {
    const url = 'https://site.invalid/page?a=1&b=2&c=3&d=4';
    const check = getCheck(url, 'URL mengandung banyak parameter');

    expect(check?.description).toContain('4 parameter');
  });

  it('tidak menandai tiga parameter query', () => {
    const url = 'https://site.invalid/page?a=1&b=2&c=3';

    expect(
      getCheck(url, 'C13. URL mengandung banyak parameter')
    ).toBeUndefined();
  });

  it('mendeteksi URL dengan panjang lebih dari 2000 karakter', () => {
    const url = `https://site.invalid/?data=${'a'.repeat(2000)}`;

    expect(getCheck(url, 'URL sangat panjang')).toBeDefined();
  });

  it('tidak menandai URL dengan panjang tepat 2000 karakter', () => {
    const prefix = 'https://site.invalid/?data=';
    const url = `${prefix}${'a'.repeat(2000 - prefix.length)}`;
    expect(new URL(url).href.length).toBe(2000);

    expect(getCheck(url, 'URL sangat panjang')).toBeUndefined();
  });

  it.each([
    'https://site.invalid/%6c%6f%67%69%6e',
    'https://site.invalid/path%2faccount',
  ])('mendeteksi encoding yang berulang atau pemisah ter-encode: %s', (url) => {
    expect(getCheck(url, 'Path atau query menggunakan encoding')).toBeDefined();
  });

  it('tidak menandai satu encoding karakter biasa', () => {
    const url = 'https://site.invalid/file%20name';

    expect(
      getCheck(url, 'Path atau query menggunakan encoding')
    ).toBeUndefined();
  });

  it.each([
    'https://site.invalid/download/invoice.exe',
    'https://site.invalid/download/installer.msi',
    'https://site.invalid/download/document.apk',
  ])('mendeteksi ekstensi file yang dapat dijalankan: %s', (url) => {
    expect(
      getCheck(url, 'Path mengarah ke file yang dapat dijalankan')
    ).toBeDefined();
  });

  it('tidak menandai ekstensi file biasa atau ekstensi yang hanya ada di query', () => {
    expect(
      getCheck(
        'https://site.invalid/download/invoice.pdf',
        'C16. Path mengarah ke file yang dapat dijalankan'
      )
    ).toBeUndefined();
    expect(
      getCheck(
        'https://site.invalid/download?file=invoice.exe',
        'C16. Path mengarah ke file yang dapat dijalankan'
      )
    ).toBeUndefined();
  });

  it('mendeteksi userinfo tanpa menampilkan nilai kredensial', () => {
    const url = 'https://alice:secret-password@site.invalid/login';
    const check = getCheck(url, 'URL mengandung informasi userinfo');

    expect(check).toBeDefined();
    expect(check?.description).not.toContain('alice');
    expect(check?.description).not.toContain('secret-password');
  });

  it('tidak menandai URL tanpa userinfo', () => {
    const url = 'https://site.invalid/login';

    expect(getCheck(url, 'URL mengandung informasi userinfo')).toBeUndefined();
  });
});

describe('analyzeUrl - indikator D: redirect dan URL perantara', () => {
  it.each([
    'https://bit.ly/abc123',
    'https://tinyurl.com/abc123',
    'https://t.co/abc123',
  ])('menandai domain URL shortener yang dikenal: %s', (url) => {
    expect(getCheck(url, 'Menggunakan URL shortener')).toBeDefined();
  });

  it('tidak menandai URL dari domain biasa sebagai shortener', () => {
    const url = 'https://news.invalid/article/123';

    expect(getCheck(url, 'Menggunakan URL shortener')).toBeUndefined();
  });

  it.each([
    'https://site.invalid/redirect?url=https%3A%2F%2Fother.invalid%2Fpage',
    'https://site.invalid/go?next=%2Faccount',
    'https://site.invalid/login?returnUrl=%2Fdashboard',
  ])('mendeteksi parameter redirect yang dikenal: %s', (url) => {
    expect(getCheck(url, 'Mengandung parameter redirect')).toBeDefined();
  });

  it('tidak menandai parameter query biasa sebagai redirect', () => {
    const url = 'https://site.invalid/search?q=shoes&page=2';

    expect(getCheck(url, 'Mengandung parameter redirect')).toBeUndefined();
  });

  it('mendeteksi parameter redirect yang menunjuk ke hostname lain', () => {
    const url =
      'https://site.invalid/redirect?url=https%3A%2F%2Foutside.invalid%2Flogin';
    const check = getCheck(url, 'Parameter redirect mengarah ke domain lain');

    expect(check?.description).toContain('outside.invalid');
    expect(check?.description).toContain('site.invalid');
  });

  it('tidak menandai tujuan redirect relatif sebagai domain lain', () => {
    const url = 'https://site.invalid/redirect?next=%2Faccount';

    expect(
      getCheck(url, 'D20. Parameter redirect mengarah ke domain lain')
    ).toBeUndefined();
  });

  it('tidak menandai parameter redirect yang tetap pada hostname sama', () => {
    const url =
      'https://site.invalid/redirect?url=https%3A%2F%2Fsite.invalid%2Faccount';

    expect(
      getCheck(url, 'Parameter redirect mengarah ke domain lain')
    ).toBeUndefined();
  });

  it('tidak menandai nilai redirect non-HTTP sebagai domain tujuan eksternal', () => {
    const url = 'https://site.invalid/redirect?url=javascript%3Aalert(1)';

    expect(
      getCheck(url, 'Parameter redirect mengarah ke domain lain')
    ).toBeUndefined();
  });
});
