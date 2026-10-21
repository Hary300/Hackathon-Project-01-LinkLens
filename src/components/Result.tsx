import { AnalyzeUrl } from '@/lib/analyzeUrl';
import { cn } from 'cn';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

type ResultProps = AnalyzeUrl;

const Result = ({ isSuspicious, checks }: ResultProps) => {
  const Icon = isSuspicious ? AlertTriangle : ShieldCheck;
  return (
    <section
      id='result'
      aria-live='polite'
      className={cn(
        'w-full rounded-xl border p-4',
        isSuspicious
          ? 'border-red-300 bg-red-50 text-red-900'
          : 'border-green-300 bg-green-50 text-green-900'
      )}
    >
      <div className='flex items-center gap-2'>
        <Icon aria-hidden='true' className='size-5 shrink-0' />
        <h2 className='font-semibold'>
          {isSuspicious
            ? 'Link mencurigakan'
            : 'Tidak ditemukan indikasi mencurigakan'}
        </h2>
      </div>
      {isSuspicious ? (
        <div className='mt-3 space-y-3 text-sm'>
          {checks.map(({ header, description }) => (
            <div key={header}>
              <h3 className='font-semibold'>{header}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className='mt-2 text-sm'>
          Pemeriksaan ini tidak menemukan indikasi mencurigakan. Tetap
          berhati-hati sebelum membuka link.
        </p>
      )}
    </section>
  );
};

export default Result;
