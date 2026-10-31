'use client';
import { type AnalyzeUrl } from '@/lib/analyzeUrl';
import Result from '@/components/main/Result';
import { type GoogleCheckResult } from '@/lib/reputation';
import { useState } from 'react';
import CheckModeSelector from './CheckModeSelector';
import UrlInputForm from './UrlInputForm';

export type CheckMode = 'local' | 'google';

const Main = () => {
  // pilihan pemeriksaan state
  const [checkMode, setCheckMode] = useState<'local' | 'google'>('local');
  const [isCheckingGoogle, setIsCheckingGoogle] = useState(false);

  // result state
  const [localResult, setLocalResult] = useState<AnalyzeUrl | null>(null);
  const [googleResult, setGoogleResult] = useState<GoogleCheckResult | null>(
    null
  );
  const [resultOrder, setResultOrder] = useState<CheckMode[]>([]);

  const handleCheckModeChange = (mode: CheckMode) => {
    setCheckMode(mode);
  };

  return (
    <div className='w-full flex flex-col gap-3'>
      <CheckModeSelector
        checkMode={checkMode}
        isCheckingGoogle={isCheckingGoogle}
        handleCheckModeChange={handleCheckModeChange}
      />

      <UrlInputForm
        checkMode={checkMode}
        isCheckingGoogle={isCheckingGoogle}
        setGoogleResult={setGoogleResult}
        setIsCheckingGoogle={setIsCheckingGoogle}
        setLocalResult={setLocalResult}
        setResultOrder={setResultOrder}
      />

      {/* result */}
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
