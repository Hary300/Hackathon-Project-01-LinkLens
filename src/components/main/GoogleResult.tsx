import {
  AlertTriangle,
  ChevronDown,
  LoaderCircle,
  Search,
  SearchCheck,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import ReputationCheckItem from './ReputationCheckItem';
import { GoogleCheckResult } from '@/lib/reputation';
import { cn } from 'cn';

interface GoogleResultProps {
  googleResult: GoogleCheckResult;
}

const GoogleResult = ({ googleResult }: GoogleResultProps) => {
  const hasKnownThreat =
    googleResult?.status === 'complete' &&
    googleResult.checks.some(
      (check) =>
        [21, 22, 23, 25].includes(check.indicator) && check.status === 'found'
    );
  const hasNewDomain =
    googleResult.status === 'complete' &&
    googleResult.checks.some(
      (check) => check.indicator === 24 && check.status === 'found'
    );
  const hasUnavailableCheck =
    googleResult.status === 'complete' &&
    googleResult.checks.some((check) => check.status === 'unavailable');
  const hasNoChecks =
    googleResult.status === 'complete' && googleResult.checks.length === 0;
  const needsCaution =
    googleResult.status === 'complete' &&
    (hasNewDomain || hasUnavailableCheck || hasNoChecks);

  const conclusion =
    googleResult.status === 'checking'
      ? 'Tunggu sampai pemeriksaan selesai sebelum memutuskan untuk membuka link.'
      : googleResult.status === 'error'
        ? 'Coba periksa lagi nanti. Jangan anggap link aman selama pemeriksaan gagal.'
        : hasKnownThreat
          ? 'Jangan buka link. Hapus pesan tersebut atau laporkan sebagai mencurigakan.'
          : needsCaution
            ? 'Jangan masukkan data sensitif. Verifikasi link melalui situs atau kanal resmi dan ulangi pemeriksaan jika ada sumber yang gagal.'
            : 'Tidak ada ancaman yang ditemukan oleh sumber pemeriksaan ini. Tetap pastikan domain benar dan berhati-hati sebelum memasukkan data.';
  const conclusionTitle =
    googleResult.status === 'checking'
      ? 'Pemeriksaan sedang berlangsung'
      : googleResult.status === 'error'
        ? 'Belum dapat disimpulkan'
        : hasKnownThreat
          ? 'Ancaman terdeteksi'
          : needsCaution
            ? 'Hasil belum lengkap atau perlu diwaspadai'
            : 'Tidak ada ancaman yang ditemukan';
  return (
    <section
      id='google-result'
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
        <Search aria-hidden='true' className='size-5 shrink-0' />
        <h2 className='font-semibold'>Pemeriksaan reputasi eksternal</h2>
      </div>

      <div
        className={cn(
          'mt-3 flex items-start gap-3 rounded-xl border-2 bg-white p-4 shadow-sm',
          googleResult.status === 'complete' && hasKnownThreat
            ? 'border-red-300'
            : googleResult.status === 'complete' && !needsCaution
              ? 'border-emerald-300'
              : 'border-amber-300'
        )}
      >
        {googleResult.status === 'checking' ? (
          <LoaderCircle
            aria-hidden='true'
            className='mt-0.5 size-6 shrink-0 animate-spin'
          />
        ) : googleResult.status === 'complete' && hasKnownThreat ? (
          <XCircle aria-hidden='true' className='mt-0.5 size-6 shrink-0' />
        ) : googleResult.status === 'complete' && !needsCaution ? (
          <ShieldCheck aria-hidden='true' className='mt-0.5 size-6 shrink-0' />
        ) : (
          <AlertTriangle
            aria-hidden='true'
            className='mt-0.5 size-6 shrink-0'
          />
        )}
        <div>
          <h3 className='text-lg font-bold'>{conclusionTitle}</h3>
          <p className='mt-1 text-sm font-medium'>{conclusion}</p>
        </div>
      </div>

      <details className='group mt-3 rounded-lg border border-current/15 bg-white/60 [interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-clip details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-300 details-content:ease-in-out [&[open]::details-content]:h-auto'>
        <summary className='flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-semibold [&::-webkit-details-marker]:hidden'>
          <span>Lihat detail pemeriksaan</span>
          <ChevronDown
            aria-hidden='true'
            className='size-4 shrink-0 transition-transform duration-300 ease-in-out group-open:rotate-180'
          />
        </summary>
        <div className='space-y-3 border-t border-current/15 p-3'>
          <p className='text-sm'>
            {googleResult.status === 'checking'
              ? 'Sedang memeriksa Google Safe Browsing dan data pendaftaran domain.'
              : googleResult.status === 'error'
                ? googleResult.message
                : hasKnownThreat
                  ? 'Satu atau lebih sumber menemukan indikator risiko. Hindari membuka link sampai diverifikasi.'
                  : needsCaution
                    ? 'Hasil pemeriksaan belum cukup untuk menyimpulkan bahwa link aman.'
                    : 'Hasil “tidak ditemukan” bukan jaminan bahwa link aman.'}
          </p>
          {googleResult.status === 'complete' && (
            <div className='space-y-2'>
              {googleResult.checks.map((check) => (
                <ReputationCheckItem key={check.indicator} check={check} />
              ))}
            </div>
          )}
          {googleResult.status === 'complete' && (
            <p className='flex items-center gap-2 text-xs'>
              <SearchCheck aria-hidden='true' className='size-4 shrink-0' />
              Hasil berasal dari Google Safe Browsing dan RDAP. Usia domain
              bukan bukti keamanan atau penipuan.
            </p>
          )}
        </div>
      </details>
    </section>
  );
};

export default GoogleResult;
