import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectNetwork() {
  return (
    <Select>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select network' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='localhost'>Localhost</SelectItem>
          <SelectItem value='remote'>Remote</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
