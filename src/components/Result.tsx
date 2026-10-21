import { type AnalyzeUrl } from '@/lib/analyzeUrl';
import {
  type GoogleCheckResult,
  type ReputationCheck,
} from '@/lib/reputation';
import { cn } from 'cn';
import {
  AlertTriangle,
  LoaderCircle,
  SearchCheck,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

type ResultProps = {
  localResult?: AnalyzeUrl | null;
  googleResult?: GoogleCheckResult | null;
  resultOrder: ('local' | 'google')[];
};

const indicatorTitles: Record<ReputationCheck['indicator'], string> = {
  21: 'URL terdaftar sebagai phishing',
  22: 'URL terdeteksi mengandung malware',
  23: 'Domain memiliki reputasi buruk',
  24: 'Domain baru terdaftar',
  25: 'Domain atau URL pernah dilaporkan',
};

const Result = ({
  localResult,
  googleResult,
  resultOrder,
}: ResultProps) => {
  const { isSuspicious, checks } = localResult ?? {
    isSuspicious: false,
    checks: [],
  };
  const hasKnownThreat =
    googleResult?.status === 'complete' &&
    googleResult.checks.some(
      (check) =>
        [21, 22, 23, 25].includes(check.indicator) && check.status === 'found'
    );

  return (
    <div className='space-y-3'>
      {resultOrder.map((resultType) => {
        if (resultType === 'local' && localResult) {
          return (
        <section
          key='local'
          aria-live='polite'
          className={cn(
            'w-full rounded-xl border p-4',
            isSuspicious
              ? 'border-amber-300 bg-amber-50 text-amber-950'
              : 'border-emerald-300 bg-emerald-50 text-emerald-950'
          )}
        >
          <div className='flex items-center gap-2'>
            {isSuspicious ? (
              <AlertTriangle aria-hidden='true' className='size-5 shrink-0' />
            ) : (
              <ShieldCheck aria-hidden='true' className='size-5 shrink-0' />
            )}
            <h2 className='font-semibold'>Pemeriksaan lokal: struktur URL</h2>
          </div>
          <p className='mt-2 text-sm'>
            {isSuspicious
              ? 'Ditemukan indikator pada bentuk alamat URL. Ini bukan konfirmasi bahwa situs berbahaya.'
              : 'Tidak ditemukan indikator mencurigakan pada struktur URL. Ini bukan jaminan bahwa situs aman.'}
          </p>
          {checks.length > 0 && (
            <div className='mt-3 space-y-3 text-sm'>
              {checks.map(({ header, description }) => (
                <div key={header}>
                  <h3 className='font-semibold'>{header}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
          );
        }

        if (resultType === 'google' && googleResult) {
          return (
        <section
          key='google'
          aria-live='polite'
          className={cn(
            'w-full rounded-xl border p-4',
            googleResult.status === 'checking'
              ? 'border-blue-200 bg-blue-50 text-blue-950'
              : googleResult.status === 'error'
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : hasKnownThreat
                  ? 'border-red-300 bg-red-50 text-red-950'
                  : 'border-blue-200 bg-blue-50 text-blue-950'
          )}
        >
          <div className='flex items-center gap-2'>
            {googleResult.status === 'checking' ? (
              <LoaderCircle
                aria-hidden='true'
                className='size-5 shrink-0 animate-spin'
              />
            ) : googleResult.status === 'error' ? (
              <AlertTriangle
                aria-hidden='true'
                className='size-5 shrink-0'
              />
            ) : hasKnownThreat ? (
              <XCircle aria-hidden='true' className='size-5 shrink-0' />
            ) : (
              <SearchCheck aria-hidden='true' className='size-5 shrink-0' />
            )}
            <h2 className='font-semibold'>
              Pemeriksaan reputasi eksternal
            </h2>
          </div>

          <p className='mt-2 text-sm'>
            {googleResult.status === 'checking'
              ? 'Sedang memeriksa Google Safe Browsing dan data pendaftaran domain.'
              : googleResult.status === 'error'
                ? googleResult.message
                : hasKnownThreat
                  ? 'Satu atau lebih sumber menemukan indikator risiko. Hindari membuka link sampai diverifikasi.'
                  : 'Hasil di bawah menunjukkan status setiap sumber. “Tidak ditemukan” bukan jaminan link aman.'}
          </p>

          {googleResult.status === 'complete' && (
            <div className='mt-4 space-y-2'>
              {googleResult.checks.map((check) => (
                <ReputationCheckItem
                  key={check.indicator}
                  check={check}
                />
              ))}
            </div>
          )}

          {googleResult.status === 'complete' && (
            <p className='mt-3 flex items-center gap-2 text-xs'>
              <SearchCheck aria-hidden='true' className='size-4 shrink-0' />
              Hasil berasal dari Google Safe Browsing dan RDAP. Usia domain
              bukan bukti keamanan atau penipuan.
            </p>
          )}
        </section>
          );
        }

        return null;
      })}
    </div>
  );
};

const ReputationCheckItem = ({ check }: { check: ReputationCheck }) => {
  const statusLabel = {
    found: 'Terdeteksi',
    clear: 'Tidak ditemukan',
    unavailable: 'Tidak dapat diperiksa',
  }[check.status];

  return (
    <div
      className={cn(
        'rounded-lg border p-3',
        check.status === 'found'
          ? 'border-red-200 bg-white/70'
          : check.status === 'unavailable'
            ? 'border-amber-200 bg-white/70'
            : 'border-slate-200 bg-white/70'
      )}
    >
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h3 className='text-sm font-semibold'>
          {indicatorTitles[check.indicator]}
        </h3>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            check.status === 'found'
              ? 'bg-red-100 text-red-800'
              : check.status === 'unavailable'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-slate-100 text-slate-700'
          )}
        >
          {statusLabel}
        </span>
      </div>
      <p className='mt-1 text-sm'>{check.description}</p>
      <p className='mt-1 text-xs opacity-75'>Sumber: {check.source}</p>
    </div>
  );
};

export default Result;
