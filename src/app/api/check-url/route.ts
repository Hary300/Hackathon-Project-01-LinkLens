import { type ReputationCheck } from '../../../lib/reputation';
import { inputSchema, InputSchema } from '../../../schema/Input';
import { isIP } from 'node:net';

type Body = InputSchema;

type SafeBrowsingMatch = {
  threatType?: string;
  threat?: { url?: string };
};

const publicSuffixes = new Set([
  'co.id',
  'com.au',
  'com.br',
  'com.cn',
  'com.id',
  'co.uk',
  'go.id',
  'or.id',
]);

const getRegistrableDomain = (hostname: string) => {
  const labels = hostname.split('.');
  const lastTwoLabels = labels.slice(-2).join('.');
  const domainLabelCount = publicSuffixes.has(lastTwoLabels) ? 3 : 2;

  return labels.length >= domainLabelCount
    ? labels.slice(-domainLabelCount).join('.')
    : null;
};

const makeGoogleChecks = (
  matches: SafeBrowsingMatch[],
  errorMessage?: string
): ReputationCheck[] => {
  if (errorMessage) {
    return [
      // 21. URL terdaftar sebagai phishing
      {
        indicator: 21,
        status: 'unavailable',
        description: errorMessage,
        source: 'Google Safe Browsing',
      },
      // 22. URL terdeteksi mengandung malware
      {
        indicator: 22,
        status: 'unavailable',
        description: errorMessage,
        source: 'Google Safe Browsing',
      },
      // 23. Domain memiliki reputasi buruk
      {
        indicator: 23,
        status: 'unavailable',
        description: errorMessage,
        source: 'Google Safe Browsing',
      },
      // 25. Domain atau URL pernah dilaporkan
      {
        indicator: 25,
        status: 'unavailable',
        description: errorMessage,
        source: 'Google Safe Browsing',
      },
    ];
  }

  const hasPhishing = matches.some(
    (match) => match.threatType === 'SOCIAL_ENGINEERING'
  );
  const hasMalware = matches.some((match) => match.threatType === 'MALWARE');
  const hasReputationMatch = matches.length > 0;
  const hasReport = matches.some((match) => Boolean(match.threat?.url));

  return [
    // 21. URL terdaftar sebagai phishing
    {
      indicator: 21,
      status: hasPhishing ? 'found' : 'clear',
      description: hasPhishing
        ? 'Tautan ini pernah ditandai karena digunakan untuk menipu orang agar memberikan informasi pribadi.'
        : 'Belum ditemukan laporan bahwa tautan ini digunakan untuk mencuri informasi pribadi.',
      source: 'Google Safe Browsing',
    },
    // 22. URL terdeteksi mengandung malware
    {
      indicator: 22,
      status: hasMalware ? 'found' : 'clear',
      description: hasMalware
        ? 'Tautan ini pernah dikaitkan dengan program yang dapat merusak perangkat atau mengambil data.'
        : 'Belum ditemukan laporan bahwa tautan ini membawa program yang merusak perangkat.',
      source: 'Google Safe Browsing',
    },
    // 23. Domain memiliki reputasi buruk
    {
      indicator: 23,
      status: hasReputationMatch ? 'found' : 'clear',
      description: hasReputationMatch
        ? 'Ada laporan berbahaya yang cocok dengan alamat atau nama situs ini.'
        : 'Belum ditemukan laporan berbahaya yang cocok dengan alamat atau nama situs ini.',
      source: 'Google',
    },
    // 25. Domain atau URL pernah dilaporkan
    {
      indicator: 25,
      status: hasReport ? 'found' : 'clear',
      description: hasReport
        ? 'Alamat ini pernah dilaporkan ke Google sebagai berbahaya.'
        : 'Belum ditemukan laporan tentang alamat ini.',
      source: 'Google',
    },
  ];
};

const isSafeBrowsingMatch = (value: unknown): value is SafeBrowsingMatch =>
  typeof value === 'object' &&
  value !== null &&
  (!('threatType' in value) || typeof value.threatType === 'string') &&
  (!('threat' in value) ||
    (typeof value.threat === 'object' &&
      value.threat !== null &&
      (!('url' in value.threat) || typeof value.threat.url === 'string')));

// 24. Domain baru terdaftar
const checkDomainAge = async (hostname: string): Promise<ReputationCheck> => {
  const domain = getRegistrableDomain(hostname);
  if (!domain || isIP(hostname)) {
    return {
      indicator: 24,
      status: 'unavailable',
      description:
        'Waktu pembuatan nama situs ini belum bisa diperiksa.',
      source: 'Data pendaftaran nama situs',
    };
  }

  try {
    const response = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`,
      {
        signal: AbortSignal.timeout(8_000),
        cache: 'no-store',
        headers: { Accept: 'application/rdap+json, application/json' },
      }
    );

    if (!response.ok) {
      return {
        indicator: 24,
        status: 'unavailable',
        description:
          'Informasi kapan nama situs dibuat belum bisa diperiksa.',
        source: 'Data pendaftaran nama situs',
      };
    }

    const data: unknown = await response.json();
    const events =
      typeof data === 'object' &&
      data !== null &&
      'events' in data &&
      Array.isArray(data.events)
        ? data.events
        : [];
    const registrationEvent = events.find(
      (event) =>
        typeof event === 'object' &&
        event !== null &&
        'eventAction' in event &&
        typeof event.eventAction === 'string' &&
        /registration|registered/i.test(event.eventAction) &&
        'eventDate' in event &&
        typeof event.eventDate === 'string'
    );

    if (
      !registrationEvent ||
      !('eventDate' in registrationEvent) ||
      typeof registrationEvent.eventDate !== 'string'
    ) {
      return {
        indicator: 24,
        status: 'unavailable',
        description:
          'Informasi kapan nama situs dibuat belum tersedia.',
        source: 'Data pendaftaran nama situs',
      };
    }

    const registrationDate = new Date(registrationEvent.eventDate);
    const ageInDays = Math.floor(
      (Date.now() - registrationDate.getTime()) / 86_400_000
    );

    if (!Number.isFinite(ageInDays) || ageInDays < 0) {
      return {
        indicator: 24,
        status: 'unavailable',
        description: 'Waktu pembuatan nama situs belum bisa dipastikan.',
        source: 'Data pendaftaran nama situs',
      };
    }

    const isNewDomain = ageInDays <= 30;
    return {
      indicator: 24,
      status: isNewDomain ? 'found' : 'clear',
      description: isNewDomain
        ? `Nama situs ini dibuat sekitar ${ageInDays} hari yang lalu. Pastikan alamatnya diumumkan oleh layanan resmi sebelum dibuka atau diisi.`
        : `Nama situs ini dibuat sekitar ${ageInDays} hari yang lalu. Pastikan alamat dan halaman yang dituju sesuai dengan layanan resmi.`,
      source: 'Data pendaftaran nama situs',
    };
  } catch (error) {
    console.error(
      'RDAP lookup failed:',
      error instanceof Error ? error.message : 'Unknown network error'
    );
    return {
      indicator: 24,
      status: 'unavailable',
      description:
        'Informasi kapan nama situs dibuat belum bisa diperiksa. Coba lagi nanti.',
      source: 'Data pendaftaran nama situs',
    };
  }
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Format request tidak valid' },
      { status: 400 }
    );
  }

  const result = inputSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0].message },
      {
        status: 400,
      }
    );
  }

  const parsedUrl = new URL(result.data.link);
  const hostname = parsedUrl.hostname.toLowerCase();
  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  const safeBrowsingApiUrl = process.env.SAFE_BROWSING_API_URL;
  let googleChecks: ReputationCheck[];

  if (!apiKey || !safeBrowsingApiUrl) {
    googleChecks = makeGoogleChecks(
      [],
      'Pemeriksaan tambahan belum tersedia. Coba lagi nanti.'
    );
  } else {
    let googleUrl: URL;
    try {
      googleUrl = new URL(safeBrowsingApiUrl);
      if (
        googleUrl.protocol !== 'https:' ||
        googleUrl.hostname !== 'safebrowsing.googleapis.com'
      ) {
        throw new Error(        'Pengaturan pemeriksaan tidak sesuai.');
      }
    } catch (error) {
      console.error(
        'Invalid SAFE_BROWSING_API_URL:',
        error instanceof Error ? error.message : 'Invalid URL'
      );
      googleChecks = makeGoogleChecks(
        [],
        'Pemeriksaan tambahan belum tersedia. Coba lagi nanti.'
      );
      const domainAgeCheck = await checkDomainAge(hostname);
      return Response.json({
        receivedUrl: result.data.link,
        checks: [...googleChecks, domainAgeCheck].sort(
          (left, right) => left.indicator - right.indicator
        ),
      });
    }

    googleUrl.searchParams.set('key', apiKey);

    try {
      const response = await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: {
            clientId: 'linklens',
            clientVersion: '1.0.0',
          },
          threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url: result.data.link }],
          },
        }),
        signal: AbortSignal.timeout(10_000),
        cache: 'no-store',
      });

      const responseText = await response.text();
      const data: unknown = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        const googleError =
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof data.error === 'object' &&
          data.error !== null &&
          'message' in data.error &&
          typeof data.error.message === 'string'
            ? data.error.message.replaceAll(apiKey, '[REDACTED]')
            : 'Google menolak permintaan';
        throw new Error(
          `Google Safe Browsing HTTP ${response.status}: ${googleError}`
        );
      }

      const rawMatches =
        typeof data === 'object' &&
        data !== null &&
        'matches' in data &&
        Array.isArray(data.matches)
          ? data.matches
          : [];
      const matches = rawMatches.filter(isSafeBrowsingMatch);
      googleChecks = makeGoogleChecks(matches);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.replaceAll(apiKey, '[REDACTED]')
            : 'Pemeriksaan tambahan belum bisa dilakukan.';
      console.error('Google Safe Browsing check failed:', message);
      googleChecks = makeGoogleChecks(
        [],
        'Pemeriksaan tambahan belum bisa dilakukan. Coba lagi nanti.'
      );
    }
  }

  const domainAgeCheck = await checkDomainAge(hostname);
  const checks = [...googleChecks, domainAgeCheck].sort(
    (left, right) => left.indicator - right.indicator
  );

  return Response.json({
    receivedUrl: result.data.link,
    checks,
  });
}
