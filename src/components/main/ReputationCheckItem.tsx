import { ReputationCheck } from '@/lib/reputation';
import { cn } from 'cn';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

const indicatorTitles: Record<ReputationCheck['indicator'], string> = {
  21: 'Apakah tautan ini pernah ditandai karena bisa menipu orang?',
  22: 'Apakah tautan ini pernah dikaitkan dengan program berbahaya?',
  23: 'Apakah ada laporan berbahaya tentang situs ini?',
  24: 'Apakah nama situs ini baru dibuat?',
  25: 'Apakah tautan ini pernah dilaporkan?',
};

const ReputationCheckItem = ({ check }: { check: ReputationCheck }) => {
  const statusLabel =
    check.indicator === 24 && check.status === 'found'
      ? 'Baru dibuat'
      : check.indicator === 24 && check.status === 'clear'
        ? 'Dibuat lebih dari 30 hari lalu'
        : {
            found: 'Ada temuan',
            clear: 'Tidak ada temuan',
            unavailable: 'Belum diperiksa',
          }[check.status];
  const recommendation =
    check.status === 'unavailable'
      ? 'Pemeriksaan ini belum memberi hasil. Coba lagi nanti dan pastikan tautan berasal dari layanan resmi sebelum dibuka atau diisi.'
      : check.status === 'found'
        ? {
            21: 'Tautan ini pernah dipakai untuk menipu orang agar memberikan kata sandi atau kode verifikasi. Jangan isi data; buka layanan lewat alamat resmi yang kamu ketik sendiri.',
            22: 'Tautan ini bisa membawa program yang merusak perangkat. Jangan unduh berkas darinya; cari berkas melalui situs resmi pembuatnya.',
            23: 'Ada laporan berbahaya yang cocok dengan tautan ini. Pastikan nama situs dan halaman yang dituju melalui layanan resmi sebelum melanjutkan.',
            24: 'Nama situs ini baru dibuat sehingga belum banyak riwayat yang bisa diperiksa. Pastikan alamatnya diumumkan oleh layanan resmi sebelum mengisi data.',
            25: 'Tautan ini pernah dilaporkan sebagai berbahaya. Jangan buka; kunjungi layanan melalui alamat resmi yang kamu ketik sendiri.',
          }[check.indicator]
        : {
            21: 'Sebelum mengetik kata sandi atau kode verifikasi, pastikan nama situs sama persis dengan alamat resmi.',
            22: 'Jika tautan menawarkan berkas, pastikan berkas berasal dari situs resmi pembuatnya sebelum dibuka.',
            23: 'Sebelum masuk akun atau membayar, pastikan nama situs dan halaman yang dituju sesuai dengan alamat resmi.',
            24: 'Pastikan nama situs ini memang digunakan oleh layanan yang ingin kamu buka.',
            25: 'Sebelum melanjutkan, pastikan tautan dan halaman tujuannya berasal dari layanan resmi.',
          }[check.indicator];
  const sourceLabel = check.indicator === 24
    ? 'Data pendaftaran nama situs'
    : 'Google';
  const description =
    check.status === 'unavailable'
      ? 'Informasi ini belum bisa diperiksa. Coba lagi nanti.'
      : check.description;

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
          {String(check.indicator - 20).padStart(2, '0')}.{' '}
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
      <p className='mt-1 text-sm'>{description}</p>
      <p className='mt-1 text-xs opacity-75'>Informasi dari: {sourceLabel}</p>
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
          <span className='font-semibold'>Apa yang perlu dilakukan: </span>
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default ReputationCheckItem;
