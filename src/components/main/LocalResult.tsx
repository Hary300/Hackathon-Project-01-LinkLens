import { AnalyzeUrl } from '@/lib/analyzeUrl';
import { cn } from 'cn';
import { AlertTriangle, ChevronDown, Search, ShieldCheck } from 'lucide-react';

interface LocalResultProps {
  localResult: AnalyzeUrl;
}

const checkQuestions: Record<string, string> = {
  'Alamat situs hanya berupa angka': 'Apakah alamat situs ini hanya berupa angka?',
  'Alamat memakai tanda @': 'Apakah alamat ini memakai tanda @?',
  'Alamat situs punya banyak bagian': 'Apakah alamat situs ini punya banyak bagian?',
  'Nama situs sangat panjang': 'Apakah nama situs ini sangat panjang?',
  'Nama situs memakai banyak angka atau tanda hubung':
    'Apakah nama situs ini memakai banyak angka atau tanda hubung?',
  'Nama situs memakai huruf khusus': 'Apakah nama situs ini memakai huruf khusus?',
  'Nama layanan hanya muncul di bagian depan alamat':
    'Apakah nama layanan hanya muncul di bagian depan alamat?',
  'Nama situs mirip dengan nama layanan terkenal':
    'Apakah nama situs ini mirip dengan nama layanan terkenal?',
  'Koneksi ke situs ini tidak terlindungi':
    'Apakah koneksi ke situs ini tidak terlindungi?',
  'Alamat memakai nomor tambahan yang tidak biasa':
    'Apakah alamat ini memakai nomor tambahan yang tidak biasa?',
  'Tautan ini bukan alamat situs biasa':
    'Apakah tautan ini dibuka oleh aplikasi, bukan halaman internet biasa?',
  'Alamat mengarah ke halaman masuk atau pembayaran':
    'Apakah alamat ini mengarah ke halaman masuk atau pembayaran?',
  'Alamat tautan memuat banyak informasi tambahan':
    'Apakah alamat ini memuat banyak informasi tambahan?',
  'Alamat tautan sangat panjang': 'Apakah alamat tautan ini sangat panjang?',
  'Sebagian alamat sulit dibaca': 'Apakah ada bagian alamat yang sulit dibaca?',
  'Tautan mengarah ke berkas aplikasi':
    'Apakah tautan ini mengarah ke berkas aplikasi?',
  'Alamat memuat tulisan sebelum tanda @':
    'Apakah alamat ini memuat tulisan sebelum tanda @?',
  'Alamat tautan dipendekkan': 'Apakah alamat tautan ini dipendekkan?',
  'Tautan dapat membawa kamu ke halaman lain':
    'Apakah tautan ini bisa membawa kamu ke halaman lain?',
  'Tautan mengarah ke situs yang berbeda':
    'Apakah tautan ini mengarah ke situs yang berbeda?',
};

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
          ? 'border-red-300 bg-red-50 text-red-950'
          : 'border-blue-200 bg-blue-50 text-blue-950'
      )}
    >
      <div className='flex items-center gap-2'>
        <Search aria-hidden='true' className='size-5 shrink-0' />
        <h2 className='font-semibold'>Hasil pemeriksaan lokal</h2>
      </div>
      <div
        className={cn(
          'mt-3 flex items-start gap-3 rounded-xl border-2 bg-white p-4 shadow-sm',
          isSuspicious ? 'border-amber-300' : 'border-emerald-300'
        )}
      >
        {isSuspicious ? (
          <AlertTriangle
            aria-hidden='true'
            className='mt-0.5 size-6 shrink-0'
          />
        ) : (
          <ShieldCheck aria-hidden='true' className='mt-0.5 size-6 shrink-0' />
        )}
        <div>
          <h3 className='text-lg font-bold'>
            {isSuspicious
              ? 'Perlu diwaspadai'
              : 'Belum terlihat tanda mencurigakan'}
          </h3>
          <p className='mt-1 text-sm font-medium'>
            {isSuspicious
              ? 'Pastikan nama situs dan halaman yang dituju sesuai dengan informasi dari layanan resminya sebelum membuka tautan atau mengisi data.'
              : 'Sebelum masuk akun atau membayar, cocokkan nama situs dengan alamat resmi layanan yang ingin kamu buka.'}
          </p>
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
        <div className='space-y-3 border-t border-current/15 p-3 text-sm'>
          <p>
            {isSuspicious
              ? 'Ada bagian alamat yang perlu diperiksa. Berikut alasan dan hal yang perlu kamu pastikan.'
              : 'Belum terlihat tanda mencurigakan pada alamat. Tetap pastikan nama situs dan halaman yang dibuka memang berasal dari layanan resmi.'}
          </p>
          {checks.map(({ header, description }, index) => (
            <div key={header}>
              <h3 className='font-semibold'>
                {String(index + 1).padStart(2, '0')}.{' '}
                {checkQuestions[header] ?? `${header}?`}
              </h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
};

export default LocalResult;
