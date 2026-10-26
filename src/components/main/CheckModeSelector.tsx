import { cn } from 'cn';
import { CheckMode } from './Main';

interface CheckOptionProps {
  checkMode: CheckMode;
  isCheckingGoogle: boolean;
  handleCheckModeChange: (mode: CheckMode) => void;
}

const CheckModeSelector = ({
  checkMode,
  handleCheckModeChange,
  isCheckingGoogle,
}: CheckOptionProps) => {
  return (
    <fieldset id='selector' className='space-y-2' disabled={isCheckingGoogle}>
      <legend className='text-sm font-semibold'>Pilih cara pemeriksaan</legend>
      <div className='grid gap-2 grid-cols-1 md:grid-cols-2'>
        {/* Pemeriksaan Lokal */}
        <label
          className={cn(
            'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors items-center',
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
            className='accent-blue-600'
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

        {/* Pemeriksaan Google Safe */}
        <label
          className={cn(
            'flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors items-center',
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
            className='accent-blue-600'
          />
          <span>
            <span className='block text-sm font-semibold'>
              Pemeriksaan dengan Google Safe Browsing
            </span>
            <span className='block text-xs text-gray-600'>
              Mencocokkan ancaman dengan Google Safe Browsing dan mengecek usia
              domain melalui RDAP.
            </span>
          </span>
        </label>
      </div>
    </fieldset>
  );
};

export default CheckModeSelector;
