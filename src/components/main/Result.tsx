import { type AnalyzeUrl } from '@/lib/analyzeUrl';
import { type GoogleCheckResult } from '@/lib/reputation';
import { cn } from 'cn';
import {
  AlertTriangle,
  LoaderCircle,
  SearchCheck,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import ReputationCheckItem from './ReputationCheckItem';
import { CheckMode } from './Main';

type ResultProps = {
  localResult?: AnalyzeUrl | null;
  googleResult?: GoogleCheckResult | null;
  resultOrder: CheckMode[];
};

const Result = ({ localResult, googleResult, resultOrder }: ResultProps) => {
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
    <section id='result' className='space-y-3'>
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
                  <AlertTriangle
                    aria-hidden='true'
                    className='size-5 shrink-0'
                  />
                ) : (
                  <ShieldCheck aria-hidden='true' className='size-5 shrink-0' />
                )}
                <h2 className='font-semibold'>
                  Pemeriksaan lokal: struktur URL
                </h2>
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
            <div
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
                    <ReputationCheckItem key={check.indicator} check={check} />
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
            </div>
          );
        }

        return null;
      })}
    </section>
  );
};

export default Result;
