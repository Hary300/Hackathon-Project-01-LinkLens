const Footer = () => {
  return (
    <footer className='flex flex-col gap-4 justify-center items-center pb-4'>
      <div className='h-px w-full bg-slate-300/40 [background:linear-gradient(to_right,transparent,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0.1)_80%,transparent)]' />
      <span className='text-xs'>
        &copy; 2026 LinkLens. All rights reservec | privacy Policy | Terms of
        Service
      </span>
    </footer>
  );
};

export default Footer;
