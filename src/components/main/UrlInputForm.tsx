import { AnalyzeUrl, analyzeUrl } from '@/lib/analyzeUrl';
import { InputSchema, inputSchema } from '@/schema/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Link2, LoaderCircle, Stethoscope } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CheckMode } from './Main';
import { Dispatch, SetStateAction } from 'react';
import { GoogleCheckResult, isReputationCheck } from '@/lib/reputation';

interface UrlInputFormProps {
  isCheckingGoogle: boolean;
  checkMode: CheckMode;
  setLocalResult: (params: AnalyzeUrl | null) => void;
  setIsCheckingGoogle: (params: boolean) => void;
  setResultOrder: Dispatch<SetStateAction<CheckMode[]>>;
  setGoogleResult: (params: GoogleCheckResult | null) => void;
}

const UrlInputForm = ({
  isCheckingGoogle,
  checkMode,
  setLocalResult,
  setIsCheckingGoogle,
  setResultOrder,
  setGoogleResult,
}: UrlInputFormProps) => {
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
            <LoaderCircle aria-hidden='true' className='size-5 animate-spin' />
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
  );
};

export default UrlInputForm;
