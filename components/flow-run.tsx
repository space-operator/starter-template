'use client';


import {  useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { useSocketDataStore } from '@/stores/socket-data';

export const FlowRun = () => {
  const { socketData, appendSocketData: setSocketData } = useSocketDataStore();

  // Add a div to bottom to create scroll to bottom effect
  const scrollToDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToDiv.current) {
      scrollToDiv.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [socketData]);
  return (
    <>
      {socketData.length > 0 && (
        <div className='border-2 max-w-[80%] h-96 overflow-scroll'>
          <Table className='dark:text-gray-200'>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(socketData) &&
                socketData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className='truncate pr-2.5'>
                      {formatDateTime(data?.time)}
                    </TableCell>
                    <TableCell className='truncate pr-2.5'>
                      {data?.event}
                    </TableCell>
                    <TableCell className='pr-2.5 py-1'>
                      {data?.nodeName}
                    </TableCell>
                    <TableCell
                      style={{
                        maxWidth: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {typeof data?.content === 'object'
                        ? JSON.stringify(data?.content, null, 2)
                        : data?.content}
                    </TableCell>
                    <TableCell className='truncate pr-2.5'>
                      {data?.id}
                    </TableCell>
                    <div ref={scrollToDiv} className=''></div>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
