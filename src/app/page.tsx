import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Main from '@/components/Main';

export default function Home() {
  return (
    <div className='flex flex-col gap-8 max-w-200 mx-auto w-full justify-between min-h-screen'>
      <div className='flex flex-col flex-1 gap-6 py-10 justify-center items-center max-w-150 mx-auto w-full'>
        <Header />
        <Main />
      </div>
      <Footer />
    </div>
  );
}
