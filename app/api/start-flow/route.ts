import { FlowPrep } from '@/stores/flow-prep';

export async function POST(request: Request) {
  const body = (await request.json()) as FlowPrep;

  const flowId = body.flowId;
  const inputs = body.inputs;
  const authorization = body.authorization!;

  const endpoint =
    process.env.NEXT_PUBLIC_FLOW_INSTANCE + '/flow/start_unverified/' + flowId;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      method: 'POST',
      body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }

    const data = await response.json();
    return Response.json({ status: 200, data });
  } catch (error) {
    return Response.json({ status: 400, error: 'Invalid request' });
  }
}
