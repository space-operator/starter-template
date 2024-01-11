import { ModeToggle } from '@/components/dark-toggle';
import ConnectWallet from '@/components/ui/connect';
import { InputForm } from '@/components/input-form';
import { SelectNetwork } from '@/components/select-network';
import { CodeEditor } from '@/components/editor';
import { LoadedFlow } from '@/components/loaded-flow';
import { StartFlow } from '@/components/start-flow';
import { FlowRun } from '@/components/flow-run';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between p-12'>
      <div className='w-full items-center justify-between lg:flex'>
        <div className='font-mono text-xl font-semibold'>Space Operator</div>
        <ModeToggle />
        <ConnectWallet />
      </div>

      <div className='mt-24 flex place-items-start gap-8'>
        <InputForm />
        <LoadedFlow />
        <StartFlow />
      </div>
      <FlowRun />
    </main>
  );
}
