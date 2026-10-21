import { ReputationCheck } from '@/lib/reputation';
import { inputSchema, InputSchema } from '@/schema/Input';
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
        ? 'Google mencocokkan URL ini dengan ancaman phishing atau rekayasa sosial.'
        : 'Google tidak menemukan kecocokan phishing untuk URL ini.',
      source: 'Google Safe Browsing',
    },
    // 22. URL terdeteksi mengandung malware
    {
      indicator: 22,
      status: hasMalware ? 'found' : 'clear',
      description: hasMalware
        ? 'Google mencocokkan URL ini dengan ancaman malware.'
        : 'Google tidak menemukan kecocokan malware untuk URL ini.',
      source: 'Google Safe Browsing',
    },
    // 23. Domain memiliki reputasi buruk
    {
      indicator: 23,
      status: hasReputationMatch ? 'found' : 'clear',
      description: hasReputationMatch
        ? 'Google memiliki kecocokan ancaman untuk URL atau pola host/path terkait. Ini bukan skor reputasi menyeluruh untuk seluruh domain.'
        : 'Google tidak menemukan kecocokan ancaman untuk URL ini. Ini bukan skor reputasi menyeluruh untuk domain.',
      source: 'Kecocokan daftar ancaman Google Safe Browsing',
    },
    // 25. Domain atau URL pernah dilaporkan
    {
      indicator: 25,
      status: hasReport ? 'found' : 'clear',
      description: hasReport
        ? 'URL atau pola URL terkait tercantum sebagai ancaman yang diketahui Google.'
        : 'URL ini tidak ditemukan dalam daftar ancaman Google yang diperiksa.',
      source: 'Daftar ancaman Google Safe Browsing',
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
        'Usia domain tidak dapat diperiksa untuk hostname ini atau alamat IP.',
      source: 'RDAP',
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
          response.status === 404
            ? 'Data pendaftaran domain tidak ditemukan pada RDAP.'
            : `Layanan RDAP tidak dapat memeriksa domain (HTTP ${response.status}).`,
        source: 'RDAP',
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
          'Tanggal pendaftaran domain tidak tersedia pada data RDAP.',
        source: 'RDAP',
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
        description: 'Tanggal pendaftaran domain dari RDAP tidak valid.',
        source: 'RDAP',
      };
    }

    const isNewDomain = ageInDays <= 30;
    return {
      indicator: 24,
      status: isNewDomain ? 'found' : 'clear',
      description: isNewDomain
        ? `Domain terdaftar sekitar ${ageInDays} hari yang lalu. Domain baru perlu diverifikasi lebih lanjut, tetapi usia muda bukan bukti penipuan.`
        : `Domain terdaftar sekitar ${ageInDays} hari yang lalu (lebih dari 30 hari). Usia domain saja tidak membuktikan bahwa situs aman.`,
      source: `RDAP (${domain})`,
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
        'Tidak dapat terhubung ke layanan RDAP untuk memeriksa usia domain.',
      source: 'RDAP',
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
  let googleChecks: ReputationCheck[];

  if (!apiKey) {
    googleChecks = makeGoogleChecks(
      [],
      'SAFE_BROWSING_API_KEY belum dikonfigurasi.'
    );
  } else {
    const googleUrl = new URL(
      'https://safebrowsing.googleapis.com/v4/threatMatches:find'
    );
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
          : 'Tidak dapat menghubungi Google Safe Browsing.';
      console.error('Google Safe Browsing check failed:', message);
      googleChecks = makeGoogleChecks(
        [],
        'Google Safe Browsing tidak dapat memeriksa URL ini.'
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
