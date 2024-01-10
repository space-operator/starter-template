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

export const StartFlow = () => {
  const { flow } = useFlowStore((state) => state);
  const { flowPrep, setFlowPrep } = useFlowPrep((state) => state);
  const { json } = useJsonForm((state) => state);
  const { setFlowResponse } = useFlowRun((state) => state);
  const wallet = useWallet();

  async function handleStartFlow() {
    if (!wallet.publicKey || flow === null || flow.id === null) return;

    const prep: FlowPrep = {
      flowId: flow.id,
      // network: network,
      inputs: json,
      authorization: wallet.publicKey!.toBase58(),
    };
    console.log(prep);
    setFlowPrep(prep);

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
        <SelectNetwork />
        <div className='flex justify-end'>
          {flow.id && <Button onClick={handleStartFlow}>Start</Button>}
        </div>
      </div>
    )
  );
};
