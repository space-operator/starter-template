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
import { createValue } from '@/types/value';

interface FlowInput {
  id: string;
  type: string;
  label: string;
  defaultValue: string;
  format: string;
}

export const LoadedFlow = () => {
  const { flow } = useFlowStore((state) => state);

  const [flowInputs, setFlowInputs] = useState<FlowInput[]>([]);

  useEffect(() => {
    if (!flow) return;
    console.log('flow', flow);

    // get flow input nodes
    const flowInputNodes = flow.nodes.filter(
      (node) => node.data.node_id === 'flow_input'
    );

    // get flow input targets
    const flowInputTargets = flow.edges
      ?.filter((edge) =>
        flowInputNodes.map((node) => node.id).includes(edge.source)
      )
      .map((edge) => {
        return {
          source: edge.source,
          target: edge.target,
          targetHandle: edge.targetHandle,
        };
      });

    // get targetHandles
    const targetHandles = flow.nodes
      .filter((node) =>
        flowInputTargets?.map((target) => target.target).includes(node.id)
      )
      .map((node) => node.data.targets)
      .flat()
      .filter((target) =>
        flowInputTargets
          ?.map((target) => target.targetHandle)
          .includes(target.id)
      );

    // add targetHandles to flowInputTargets
    const flowInputTypes = flowInputTargets?.map((target) => {
      const targetHandle = targetHandles.find(
        (handle) => handle.id === target.targetHandle
      );
      return {
        ...target,
        targetHandle: targetHandle,
      };
    });

    //
    const result: FlowInput[] = flowInputNodes.map((node) => {
      const defaultValue =
        node.data.targets_form?.extra?.type === 'json'
          ? JSON.stringify(
              node.data.targets_form?.form_data?.form_label,
              null,
              2
            )
          : node.data.targets_form?.form_data?.form_label;

      const type_bounds: string[] = flowInputTypes?.find(
        (target) => target.source === node.id
      )?.targetHandle?.type_bounds;

      const type = createValue(type_bounds[0]);

      const format = JSON.stringify(type, null, 2);

      const n: FlowInput = {
        id: node.id,
        type: type_bounds[0],
        label: node.data.targets_form?.form_data?.label,
        defaultValue,
        format,
      };
      return n;
    });

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
                <TableHead>Format</TableHead>
                <TableHead className='w-[100px]'>Default Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flowInputs.map((input) => (
                <TableRow key={input.id}>
                  <TableCell className='font-medium'>{input.label}</TableCell>
                  <TableCell>{input.type}</TableCell>
                  <TableCell>{input.format}</TableCell>
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
