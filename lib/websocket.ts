import { convertValue } from '../types/value';

export interface SocketEventData {
  nodeId: string;
  nodeName: string;
  event: string;
  objectData: any;
}

export function convertSocketData(
  rawData: any,
  nodes: { id: string; name: string }[]
): SocketEventData | null {
  if (!rawData) return null;

  const content = rawData.event?.content;
  const data =
    content.NodeStart ??
    content.NodeFinish ??
    content.NodeOutput ??
    content.FlowError;

  if (!data) return null;

  const nodeId = data.node_id;
  // const nodeName = nodes.find((node) => node.id === nodeId)?.name;
  // if (!nodeName) return null;
  const nodeName = data.node_id;

  if (data.input) {
    const objectData = convertValue(data.input);
    return {
      nodeId,
      nodeName,
      event: 'Start',
      objectData,
    };
  }

  if (data.output) {
    const objectData = convertValue(data.output);
    return {
      nodeId,
      nodeName,
      event: 'Output',
      objectData,
    };
  }

  if (data.er) {
    const objectData = convertValue(data.output);
    return {
      nodeId,
      nodeName,
      event: 'Output',
      objectData,
    };
  }

  if (content.NodeFinish) {
    const nodeId = content.NodeFinish.node_id;
    const nodeName = nodes.find((node) => node.id === nodeId)?.name;
    if (!nodeName) return null;
    return {
      nodeId,
      nodeName,
      event: 'Finish',
      objectData: {},
    };
  }

  return null;
}
