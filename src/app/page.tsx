import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Main from '@/components/Main';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col justify-between gap-8 mx-auto w-full max-w-200'>
      <div className='flex flex-col flex-1 gap-6 py-10  mx-auto w-full'>
        <Header />
        <Main />
      </div>
      <Footer />
    </div>
  );
}
