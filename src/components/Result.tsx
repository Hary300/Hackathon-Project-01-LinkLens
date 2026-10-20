import { AnalyzeUrl } from '@/lib/analyzeUrl';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

type ResultProps = AnalyzeUrl;

const Result = ({ isSuspicious, reasons }: ResultProps) => {
  const Icon = isSuspicious ? AlertTriangle : ShieldCheck;

  return (
    <section
      aria-live='polite'
      className={`w-full rounded-xl border p-4 ${
        isSuspicious
          ? 'border-red-300 bg-red-50 text-red-900'
          : 'border-green-300 bg-green-50 text-green-900'
      }`}
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
        reasons.length > 0 ? (
          <ul className='mt-2 list-inside list-disc text-sm'>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p className='mt-2 text-sm'>
            Link ini ditandai mencurigakan, tetapi tidak ada alasan tambahan.
          </p>
        )
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
