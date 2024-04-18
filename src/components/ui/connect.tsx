'use client';

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function ConnectWallet() {
  return (
    <div className=' relative z-[999]'>
      <WalletMultiButtonDynamic className='spox-connect text-sm flex items-center justify-center w-full' />
    </div>
  );
}
