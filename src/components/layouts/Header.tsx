import Image from 'next/image';
import logo from '@/assets/LinkLens.png';

const Header = () => {
  return (
    <header className='flex flex-col w-full'>
      <Image src={logo} alt='Logo' width={200} loading='eager' />
      <p>Periksa link. Lindungi dunia digitalmu.</p>
    </header>
  );
};

export default Header;
