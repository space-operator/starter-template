import { encode as base58Encode } from 'bs58';

export const submitSignature = async (
  instance: string,
  id: number,
  s: Uint8Array,
  localhost = false
) => {
  const signature = base58Encode(s);
  const response = await fetch(`${instance}/signature/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, signature }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || 'Unknown error');
  }

  return response.json();
};
