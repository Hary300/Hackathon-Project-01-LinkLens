import { type AnalyzeUrl } from '@/lib/analyzeUrl';
import { type GoogleCheckResult } from '@/lib/reputation';
import { CheckMode } from './Main';
import LocalResult from './LocalResult';
import GoogleResult from './GoogleResult';

type ResultProps = {
  localResult?: AnalyzeUrl | null;
  googleResult?: GoogleCheckResult | null;
  resultOrder: CheckMode[];
};

const Result = ({ localResult, googleResult, resultOrder }: ResultProps) => {
  return (
    <section id='result' className='space-y-3'>
      {resultOrder.map((resultType) => {
        if (resultType === 'local' && localResult) {
          return <LocalResult key='local' localResult={localResult} />;
        }

        if (resultType === 'google' && googleResult) {
          return <GoogleResult key='google' googleResult={googleResult} />;
        }

        return null;
      })}
    </section>
  );
};

export default Result;
