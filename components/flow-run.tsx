'use client';

import { useFlowRun } from '@/stores/flow-run';
import { Message, PublicKey, Transaction } from '@solana/web3.js';
import { ed25519 } from '@noble/curves/ed25519';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SocketEventData, convertSocketData } from '@/lib/websocket';
import { submitSignature } from '@/lib/submit-signature';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const FlowRun = () => {
  const { flowResponse } = useFlowRun((state) => state);

  const ws = useRef<WebSocket | null>(null);
  const [socketData, setSocketData] = useState<
    (SocketEventData | null)[] | undefined
  >([]);

  const [flowRunId, setFlowRunId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<{ id: string; name: string }[]>([]);

  const [instance, setInstance] = useState(
    process.env.NEXT_PUBLIC_FLOW_INSTANCE!
  );

  const {
    signTransaction,
    signMessage,
    publicKey: walletPublicKey,
  } = useWallet();

  useEffect(() => {
    if (!flowResponse) return;

    setFlowRunId(flowResponse.flow_run_id);
  }, [flowResponse]);

  useEffect(() => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // TODO move into env variable
    // ws.current = new WebSocket('ws://127.0.0.1:8080/ws');
    ws.current = new WebSocket('wss://dev-api.spaceoperator.com/ws');
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!ws.current) {
      console.log('Not connected to WebSocket server');
      return;
    }
    console.log('Connected to WebSocket server');

    ws.current.onopen = () => {
      if (ws.current === null || flowRunId === null) return;
      console.log('WebSocket open', flowRunId);
      ws.current.send(
        JSON.stringify({
          Authenticate: { token: process.env.NEXT_PUBLIC_USER_API_KEY },
        })
      );
      //   ws.current.send(JSON.stringify({ SubscribeSignatureRequests: {} }));
      ws.current.send(
        JSON.stringify({
          SubscribeFlowRunEvents: { flow_run_id: flowRunId },
        })
      );
      console.log('Listening to WebSocket events', ws);
    };

    ws.current.onmessage = (event) => {
      if (ws.current === null) return;

      const data = JSON.parse(event.data);
      console.log('WebSocket data:', data);
      if (data.event?.content) {
        const convertedSocketData = convertSocketData(data, nodes);

        setSocketData((socketData) => {
          if (!socketData) return;
          return [...socketData, convertedSocketData];
        });
      }
      if (data?.event?.message) {
        console.log('data.event.message', data.event.message);
        const payload = data.event;
        handleSignatureRequest(payload);
      }
    };

    ws.current.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      // console.log('WebSocket closed');
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, [flowRunId]);

  // Subscribe to signature requests
  function decodeMessage(buffer: Buffer): { tx?: Transaction; raw?: Buffer } {
    try {
      const solanaMsg = Message.from(buffer);
      const tx = Transaction.populate(solanaMsg);
      return { tx };
    } catch {
      return { raw: buffer };
    }
  }

  const handleSignatureRequest = async (payload: any) => {
    try {
      if (signMessage == null || signTransaction == null) {
        throw 'wallet is not connected';
      }

      console.log('received signature request', payload);
      const id = payload.req_id;
      const pubkey = new PublicKey(payload.pubkey);
      const buffer = Buffer.from(payload.message, 'base64');

      if (walletPublicKey != null && !walletPublicKey.equals(pubkey)) {
        throw `different public key:\nrequested: ${pubkey}\nwallet: ${walletPublicKey}`;
      }

      const decoded = decodeMessage(buffer);

      let signature: Buffer;
      if (decoded.tx) {
        const tx = await signTransaction(decoded.tx);
        if (tx.signature === null) return;
        signature = tx.signature;
      } else if (decoded.raw) {
        signature = Buffer.from(await signMessage(decoded.raw));
      } else {
        throw 'got null, this is a bug';
      }
      if (!ed25519.verify(signature, buffer, pubkey.toBytes())) {
        // throw 'signature verification failed';
        console.warn('signature verification failed');
      }
      await submitSignature(instance, id, signature);
    } catch (reason) {
      console.error(reason);
    }
  };

  return (
    <>
      {flowResponse && (
        <div className='border max-w-[60%]'>
          <Table className='dark:text-gray-200 h-96 w-[1000px] overflow-y-scroll'>
            <TableHeader>
              <TableRow className='text-left px-3 sticky top-0 dark:bg-gray-700'>
                <TableHead>Event</TableHead>
                <TableHead>Node ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(socketData) &&
                socketData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className='truncate pr-2.5'>
                      {data?.event}
                    </TableCell>
                    <TableCell className='truncate pr-2.5'>
                      {data?.nodeId}
                    </TableCell>
                    <TableCell className='pr-2.5 py-1'>
                      {data?.nodeName}
                    </TableCell>
                    <TableCell>{JSON.stringify(data?.objectData)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};