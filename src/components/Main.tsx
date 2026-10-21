'use client';
import { type AnalyzeUrl, analyzeUrl } from '@/lib/analyzeUrl';
import Result from '@/components/Result';
import { isReputationCheck, type GoogleCheckResult } from '@/lib/reputation';
import { inputSchema, InputSchema } from '@/schema/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Link2, LoaderCircle, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Main = () => {
  const [checkMode, setCheckMode] = useState<'local' | 'google'>('local');
  const [localResult, setLocalResult] = useState<AnalyzeUrl | null>(null);
  const [isCheckingGoogle, setIsCheckingGoogle] = useState(false);
  const [googleResult, setGoogleResult] = useState<GoogleCheckResult | null>(
    null
  );
  const [resultOrder, setResultOrder] = useState<('local' | 'google')[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputSchema>({
    defaultValues: {
      link: '',
    },
    resolver: zodResolver(inputSchema),
  });

  const handleCheckModeChange = (mode: 'local' | 'google') => {
    setCheckMode(mode);
  };

  const onSubmit = async (data: InputSchema) => {
    if (checkMode === 'local') {
      setLocalResult(analyzeUrl(data.link));
      setResultOrder((current) =>
        current.includes('local') ? current : [...current, 'local']
      );
      return;
    }

    setIsCheckingGoogle(true);
    setGoogleResult({ status: 'checking' });
    setResultOrder((current) =>
      current.includes('google') ? current : [...current, 'google']
    );

    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : `Pemeriksaan Google gagal (HTTP ${response.status}).`;
        throw new Error(errorMessage);
      }

      if (
        typeof payload !== 'object' ||
        payload === null ||
        !('checks' in payload) ||
        !Array.isArray(payload.checks) ||
        !payload.checks.every(isReputationCheck)
      ) {
        throw new Error('Respons pemeriksaan Google tidak valid.');
      }

      setGoogleResult({
        status: 'complete',
        checks: payload.checks,
      });
    } catch (error) {
      setGoogleResult({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Pemeriksaan Google Safe Browsing gagal. Coba lagi.',
      });
    } finally {
      setIsCheckingGoogle(false);
    }
  };

  return (
    <div className='w-full flex flex-col gap-3'>
      <fieldset className='space-y-2' disabled={isCheckingGoogle}>
        <legend className='text-sm font-semibold'>
          Pilih cara pemeriksaan
        </legend>
        <div className='grid gap-2 sm:grid-cols-2'>
          <label
            className={cn(
              'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors',
              checkMode === 'local'
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <input
              type='radio'
              name='check-mode'
              value='local'
              checked={checkMode === 'local'}
              onChange={() => handleCheckModeChange('local')}
              className='mt-1 accent-blue-600'
            />
            <span>
              <span className='block text-sm font-semibold'>
                Pemeriksaan lokal (tanpa API)
              </span>
              <span className='block text-xs text-gray-600'>
                Cepat. Memeriksa pola pada alamat saja.
              </span>
            </span>
          </label>
          <label
            className={cn(
              'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors',
              checkMode === 'google'
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <input
              type='radio'
              name='check-mode'
              value='google'
              checked={checkMode === 'google'}
              onChange={() => handleCheckModeChange('google')}
              className='mt-1 accent-blue-600'
            />
            <span>
              <span className='block text-sm font-semibold'>
                Pemeriksaan dengan Google Safe Browsing
              </span>
              <span className='block text-xs text-gray-600'>
                Mencocokkan ancaman dengan Google Safe Browsing dan mengecek
                usia domain melalui RDAP.
              </span>
            </span>
          </label>
        </div>
      </fieldset>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex flex-col gap-3'
      >
        <label
          htmlFor='url-input'
          className='text-sm font-semibold text-gray-800'
        >
          URL yang ingin diperiksa
        </label>
        <div className='flex flex-col gap-2 rounded-2xl border border-gray-300 bg-white p-2 shadow-sm transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 sm:flex-row'>
          <div className='relative min-w-0 flex-1'>
            <Link2
              aria-hidden='true'
              className='pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400'
            />
            <input
              id='url-input'
              type='url'
              autoComplete='url'
              aria-invalid={Boolean(errors.link)}
              aria-describedby={errors.link ? 'link-error' : 'link-help'}
              disabled={isCheckingGoogle}
              className={cn(
                'h-12 w-full rounded-xl border border-transparent bg-transparent py-2 pl-11 pr-3 text-base text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-60',
                errors.link && 'border-red-500'
              )}
              placeholder='https://contoh.id/halaman'
              {...register('link', {
                onChange: () => {
                  setLocalResult(null);
                  setGoogleResult(null);
                  setResultOrder([]);
                },
              })}
            />
          </div>
          <button
            type='submit'
            disabled={isCheckingGoogle}
            className='inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-400 px-5 font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:w-auto'
          >
            {isCheckingGoogle ? (
              <LoaderCircle
                aria-hidden='true'
                className='size-5 animate-spin'
              />
            ) : (
              <Stethoscope aria-hidden='true' className='size-5' />
            )}
            <span>{isCheckingGoogle ? 'Memeriksa...' : 'Periksa URL'}</span>
          </button>
        </div>
        <p
          id='link-error'
          aria-live='polite'
          className={cn('min-h-5 text-sm', errors.link && 'text-red-600')}
        >
          {errors.link?.message ? (
            errors.link.message
          ) : (
            <span id='link-help' className='text-gray-500'>
              Tempel atau ketik alamat lengkap, termasuk http:// atau https://.
            </span>
          )}
        </p>
      </form>
      {resultOrder.length > 0 && (
        <Result
          localResult={localResult}
          googleResult={googleResult}
          resultOrder={resultOrder}
        />
      )}
    </div>
  );
};

export default Main;
