'use client';

import { useFlowStore } from '@/stores/loaded-flow';
import { CodeEditor } from './editor';
import { SelectNetwork } from './select-network';
import { Button } from './ui/button';
import { baseUrl } from '@/lib/utils';
import { FlowPrep, useFlowPrep } from '@/stores/flow-prep';
import { useWallet } from '@solana/wallet-adapter-react';
import { useJsonForm } from '@/stores/json-form';
import { useFlowRun } from '@/stores/flow-run';
import { toast } from 'sonner';

export const StartFlow = () => {
  const { flow } = useFlowStore((state) => state);
  const { flowPrep, setFlowPrep } = useFlowPrep((state) => state);
  const { json } = useJsonForm((state) => state);
  const { setFlowResponse } = useFlowRun((state) => state);
  const wallet = useWallet();

  async function handleStartFlow() {
    if (!wallet.publicKey || flow === null || flow.id === null) return;

    // replace input json word 'WALLET' with wallet public key
    const walletPk = wallet.publicKey.toBase58();
    const jsonStr = JSON.stringify(json).replace(/WALLET/g, walletPk);
    const updatedJson = JSON.parse(jsonStr);

    const prep: FlowPrep = {
      flowId: flow.id,
      // network: network,
      inputs: updatedJson,
      authorization: wallet.publicKey.toBase58(),
    };

    setFlowPrep(prep);

    toast('Starting flow with following inputs:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(updatedJson, null, 2)}
          </code>
        </pre>
      ),
    });

    await fetch(`${baseUrl}/api/start-flow`, {
      body: JSON.stringify(prep),
      method: 'POST',
    }).then(async (res) => {
      const body = await res.json();
      setFlowResponse(body.data);
    });
  }

  return (
    flow && (
      <div className='border'>
        <CodeEditor />

        <div className='m-4 flex justify-end gap-4'>
          <SelectNetwork />
          {flow.id && wallet.publicKey ? (
            <Button onClick={handleStartFlow}>Start Flow</Button>
          ) : (
            <Button disabled>Please connect wallet</Button>
          )}
        </div>
      </div>
    )
  );
};
