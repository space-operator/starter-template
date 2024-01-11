'use client';

import { useFlowStore } from '@/stores/loaded-flow';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useEffect, useState } from 'react';

interface FlowInput {
  id: string;
  type: string;
  label: string;
  defaultValue: string;
}

export const LoadedFlow = () => {
  const { flow } = useFlowStore((state) => state);

  const [flowInputs, setFlowInputs] = useState<FlowInput[]>([]);

  useEffect(() => {
    if (!flow) return;

    const result = flow
      .nodes!.filter((node) => node!.data.node_id === 'flow_input')
      .map((node) => ({
        id: node.id,
        type: node.data.targets_form?.extra?.type,
        label: node.data.targets_form?.form_data?.label,
        defaultValue:
          node.data.targets_form?.extra?.type === 'json'
            ? JSON.stringify(
                node.data.targets_form?.form_data?.form_label,
                null,
                2
              )
            : node.data.targets_form?.form_data?.form_label,
      }));

    setFlowInputs(result);
  }, [flow]);

  return (
    flow && (
      <Card>
        <CardHeader>
          <CardTitle>{flow?.name}</CardTitle>
          <CardDescription>{flow?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Required Inputs</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flowInputs.map((input) => (
                <TableRow key={input.id}>
                  <TableCell className='font-medium'>{input.label}</TableCell>
                  <TableCell>{input.type}</TableCell>
                  <TableCell>{input.defaultValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p>
            Start unverified: <strong>{`${flow?.start_unverified}`}</strong>
          </p>
        </CardFooter>
      </Card>
    )
  );
};
