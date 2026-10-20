'use client';
import { analyzeUrl } from '@/lib/analyzeUrl';
import Result from '@/components/Result';
import { inputSchema, InputSchema } from '@/schema/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Main = () => {
  const [result, setResult] = useState<ReturnType<typeof analyzeUrl> | null>(
    null
  );
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

  const onSubmit = (data: InputSchema) => {
    setResult(analyzeUrl(data.link));
  };
  return (
    <div className='w-full flex flex-col gap-3'>
      <p
        id='link-error'
        aria-live='polite'
        className={cn('text-sm h-5', errors.link && 'text-red-500')}
      >
        {errors.link?.message ? errors.link?.message : ''}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex justify-between gap-2 p-1  rounded-full shadow-[0_0_5px_rgba(0,0,0,0.2)]'
      >
        <input
          type='url'
          aria-invalid={Boolean(errors.link)}
          aria-describedby='link-error'
          className={cn(
            'py-2 px-4 rounded-full bg-white flex-4',
            errors.link && 'border border-red-500'
          )}
          placeholder='Masukan link'
          {...register('link')}
        />
        <button
          type='submit'
          className={cn(
            'flex justify-center items-center gap-1 bg-blue-500 text-white p-2 rounded-full flex-1 cursor-pointer transition-colors duration-200 hover:bg-blue-600 active:bg-blue-700'
          )}
        >
          <Stethoscope className='size-4' />
          <span>Periksa</span>
        </button>
      </form>
      {result && (
        <Result isSuspicious={result.isSuspicious} reasons={result.reasons} />
      )}
    </div>
  );
};

export default Main;
