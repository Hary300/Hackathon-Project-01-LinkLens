import Image from 'next/image';
import logo from '@/assets/LinkLens.png';

const Header = () => {
  return (
    <header className='flex flex-col w-full'>
      <Image src={logo} alt='Logo' width={150} loading='eager' />
      <p>Scan URLs. Protect your digital world</p>
    </header>
  );
};

export default Header;
