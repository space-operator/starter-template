import { convertValue } from '../types/value';

export interface SocketEventData {
  time: Date;
  id?: string;
  nodeName?: string;
  event?: string;
  content?: any;
  level?: string;
}

export function convertSocketData(
  event: any,
  nodes: { id: string; name: string }[]
): SocketEventData | null {
  const data = event.data;
  const time = event.data.time;

  if (event.event === 'FlowStart') {
    return {
      time: new Date(time),
      id: undefined,
      nodeName: undefined,
      event: 'FlowStart',
      content: undefined,
    };
  }

  if (event.event === 'FlowLog') {
    return {
      time: new Date(time),
      id: undefined,
      nodeName: undefined,
      event: 'FlowLog',
      content: data.content,
    };
  }

  if (event.event === 'FlowError') {
    return {
      time: new Date(time),
      id: undefined,
      nodeName: undefined,
      event: 'FlowError',
      content: data.error,
    };
  }

  const nodeId = data.node_id;
  const nodeName = nodes.find((node) => node.id === nodeId)?.name;

  if (event.event === 'NodeStart') {
    const content = convertValue(data.input);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'NodeStart',
      content,
    };
  }

  if (event.event === 'NodeStart') {
    const content = convertValue(data.output);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'NodeOutput',
      content,
    };
  }

  if (event.event === 'NodeError') {
    const content = convertValue(data.output);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'NodeError',
      content,
    };
  }

  if (event.event === 'NodeFinish') {
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'NodeFinish',
      content: undefined,
    };
  }
}
