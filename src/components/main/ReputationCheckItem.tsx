import { ReputationCheck } from '@/lib/reputation';
import { cn } from 'cn';

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

export default ReputationCheckItem;
