import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const flowId = body.flowId;

  if (!flowId) {
    return Response.json({
      status: 400,
      body: { message: 'Missing flowId' },
    });
  }

  const { data, error } = await supabase
    .from('flows')
    .select('*')
    .eq('id', flowId)
    .single();

  if (error) return Response.json({ status: 400, error: 'Invalid request' });

  return Response.json({ status: 200, data });
}
