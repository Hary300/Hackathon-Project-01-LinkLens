import { AnalyzeUrl } from '@/lib/analyzeUrl';
import { cn } from 'cn';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface LocalResultProps {
  localResult: AnalyzeUrl;
}

const LocalResult = ({ localResult }: LocalResultProps) => {
  const { isSuspicious, checks } = localResult ?? {
    isSuspicious: false,
    checks: [],
  };
  return (
    <section
      id='local-result'
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
};

export default LocalResult;
