import { ReputationCheck } from '@/lib/reputation';
import { cn } from 'cn';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

const indicatorTitles: Record<ReputationCheck['indicator'], string> = {
  21: 'URL terdaftar sebagai phishing',
  22: 'URL terdeteksi mengandung malware',
  23: 'Domain memiliki reputasi buruk',
  24: 'Domain baru terdaftar',
  25: 'Domain atau URL pernah dilaporkan',
};

const ReputationCheckItem = ({ check }: { check: ReputationCheck }) => {
  const statusLabel = {
    found: 'Terdeteksi',
    clear: 'Tidak ditemukan',
    unavailable: 'Tidak dapat diperiksa',
  }[check.status];
  const recommendation =
    check.status === 'unavailable'
      ? 'Coba periksa lagi nanti dan jangan anggap hasil ini sebagai tanda bahwa link aman.'
      : check.status === 'found' && check.indicator === 24
        ? 'Domain baru perlu diwaspadai. Verifikasi melalui kanal resmi sebelum membuka atau memasukkan data.'
        : check.status === 'found'
          ? 'Jangan buka link. Verifikasi alamat melalui situs atau kanal resmi.'
          : 'Sumber ini tidak menemukan indikator tersebut. Tetap periksa domain sebelum memasukkan data sensitif.';

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
      <div className='mt-2 flex items-start gap-2 border-t border-slate-200 pt-2 text-xs'>
        {check.status === 'clear' ? (
          <ShieldCheck
            aria-hidden='true'
            className='mt-0.5 size-4 shrink-0 text-emerald-700'
          />
        ) : check.status === 'found' && check.indicator !== 24 ? (
          <XCircle
            aria-hidden='true'
            className='mt-0.5 size-4 shrink-0 text-red-700'
          />
        ) : (
          <AlertTriangle
            aria-hidden='true'
            className='mt-0.5 size-4 shrink-0 text-amber-700'
          />
        )}
        <p>
          <span className='font-semibold'>Langkah selanjutnya: </span>
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default ReputationCheckItem;
