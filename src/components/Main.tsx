'use client';
import { inputSchema, InputSchema } from '@/schema/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Main = () => {
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
    console.log(data);
  };
  return (
    <div className='w-full flex flex-col gap-3'>
      <p className={cn('text-sm h-5', errors.link && 'text-red-500')}>
        {errors.link?.message ? errors.link?.message : ''}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex justify-between gap-2 p-1  rounded-full shadow-[0_0_5px_rgba(0,0,0,0.2)]'
      >
        <input
          type='text'
          className={cn(
            'py-2 px-4 rounded-full bg-white flex-4',
            errors.link && 'border border-red-500'
          )}
          placeholder='Enter URL to check'
          {...register('link')}
        />
        <button
          type='submit'
          className={cn(
            'flex justify-center gap-1 bg-blue-500 text-white p-2 rounded-full flex-1 cursor-pointer transition-colors duration-200 hover:bg-blue-600 active:bg-blue-700'
          )}
        >
          <Check />
          Scan
        </button>
      </form>
    </div>
  );
};

export default Main;
