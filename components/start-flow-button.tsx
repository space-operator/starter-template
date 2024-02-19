'use client';

import { FC, use, useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { encode as base58Encode } from 'bs58';
import { restClient, wsClient } from '../utils/client';
import { StartFlowUnverifiedOutput } from '@space-operator/client/dist/module/types/rest/start-flow-unverified';
import { convertSocketData } from '@/lib/websocket';
import { useFlowStore } from '@/stores/loaded-flow';
import { useFlowRun } from '@/stores/flow-run';
import { useSocketDataStore } from '@/stores/socket-data';
import { ed25519 } from '@noble/curves/ed25519';
import { SignatureRequest } from '@space-operator/client/dist/module/types/ws';

interface StartFlowButtonProps {
  flowId: number;
  inputBody: Record<string, any>;
}

export const StartFlowButton: FC<StartFlowButtonProps> = ({
  flowId,
  inputBody,
}: StartFlowButtonProps) => {
  const { publicKey, signTransaction } = useWallet();
  const [logs, setLogs] = useState([]);
  const { setFlowResponse } = useFlowRun((state) => state);
  const { appendSocketData } = useSocketDataStore();
  const { flow } = useFlowStore((state) => state);

  const [nodes, setNodes] = useState<{ id: string; name: string }[]>([]);

  // map flow nodes into nodes
  // only required for the socket data mapping
  useEffect(() => {
    if (!flow) return;

    const result = flow.nodes.map((node) => ({
      id: node.id,
      name: node.data.display_name,
    }));
    setNodes(result);
  }, [flow]);

  const subscribeEvents = useCallback(
    ({ flow_run_id, token }: StartFlowUnverifiedOutput) => {
      wsClient.subscribeFlowRunEvents(
        async (ev) => {
          setLogs((logs) => [...logs, ev]);
          // convert socket data for table display
          if (ev) {
            const convertedSocketData = convertSocketData(ev, nodes);
            appendSocketData([convertedSocketData]);
          }
          // handle signature request
          if (ev.event === 'SignatureRequest') {
            const req = new SignatureRequest({
              id: ev.data.id,
              message: ev.data.message,
              pubkey: ev.data.pubkey,
              signatures: ev.data.signatures,
              flow_run_id: ev.data.flow_run_id,
              time: '', // not needed
              timeout: 0, // not needed
            });

            const pk = new PublicKey(req.pubkey);
            if (!publicKey.equals(pk)) {
              throw `different public key:\nrequested: ${
                req.pubkey
              }}\nwallet: ${publicKey.toBase58()}`;
            }

            const tx = req.buildTransaction();
            console.log('signing', tx);

            // sign and check if the wallet has changed the transaction
            const signedTx = await signTransaction(tx);
            console.log('signed', signedTx);

            const signature = signedTx.signatures.find((ele) =>
              ele.publicKey.equals(pk)
            ).signature;

            let newMsg = null;
            if (
              !ed25519.verify(
                signature,
                Buffer.from(ev.data.message, 'base64'),
                pk.toBuffer()
              )
            ) {
              console.log('changing transaction');
              newMsg = signedTx.serializeMessage();
            }

            restClient.submitSignature({
              id: ev.data.id,
              signature: base58Encode(signature),
              new_msg:
                newMsg != null ? Buffer.from(newMsg).toString('base64') : null,
            });
          }
        },
        flow_run_id,
        token
      );
    },
    [setLogs, signTransaction]
  );

  const startFlow = useCallback(async () => {
    setLogs([]);
    if (!publicKey) return;
    const body = await restClient.startFlowUnverified(flowId, publicKey, {
      inputs: inputBody,
    });
    if (body.error == null) {
      subscribeEvents(body as StartFlowUnverifiedOutput);
      setFlowResponse(body as StartFlowUnverifiedOutput);
    } else {
      alert(`start failed: ${body.error}`);
    }
  }, [publicKey, setLogs, subscribeEvents, flowId, inputBody]);

  return (
    <>
      {signTransaction && <button onClick={startFlow}>Start Flow</button>}
      {/* <table>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{JSON.stringify(log)}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </>
  );
};
