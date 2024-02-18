'use client';

import { useFlowStore } from '@/stores/loaded-flow';
import { CodeEditor } from './editor';
import { SelectNetwork } from './select-network';
import { Button } from './ui/button';
import { baseUrl } from '@/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useJsonForm } from '@/stores/json-form';
import { useFlowRun } from '@/stores/flow-run';
import { toast } from 'sonner';
import { StartFlowButton } from './start-flow-button';
import { prepFlowInputs } from '@/utils/flow';

export const StartFlow = () => {
  const { flow } = useFlowStore((state) => state);
  const { json } = useJsonForm((state) => state);
  const wallet = useWallet();

  return (
    flow && (
      <div className='border'>
        <CodeEditor />

        <div className='m-4 flex justify-end gap-4'>
          <SelectNetwork />
          {flow.id && wallet.publicKey ? (
            <StartFlowButton
              flowId={flow.id}
              inputBody={prepFlowInputs(json, wallet)}
            />
          ) : (
            <Button disabled>Please connect wallet</Button>
          )}
        </div>
      </div>
    )
  );
};
