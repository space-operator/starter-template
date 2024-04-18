import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InputWithLabel() {
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='select-flow'>Flow ID</Label>
      <Input type='number' id='flow-id' placeholder='Flow ID' />
    </div>
  );
}
