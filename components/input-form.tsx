'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CodeEditor } from './editor';
import { Flow } from '@/types/flows';
import { baseUrl } from '@/lib/utils';
import { useFlowStore } from '@/stores/loaded-flow';

const FormSchema = z.object({
  flowId: z.coerce.number().int({
    message: 'Please enter a integer',
  }),
});

export function InputForm() {
  const { setFlow } = useFlowStore((state) => state);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    const res = await fetch(`${baseUrl}/api/flows`, {
      body: JSON.stringify(data),
      method: 'POST',
    }).then(async (res) => {
      const json = await res.json();
      setFlow(json.data as Flow);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-36 space-y-6'>
        <FormField
          control={form.control}
          name='flowId'
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Flow ID</FormLabel>
                <FormControl>
                  <Input placeholder='1204' type='number' {...field} />
                </FormControl>
                <FormDescription>Enter the flow ID</FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <Button type='submit'>Load</Button>
      </form>
    </Form>
  );
}
