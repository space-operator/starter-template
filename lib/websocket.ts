import { convertValue } from '../types/value';

export interface SocketEventData {
  time: Date;
  id?: string;
  nodeName?: string;
  event?: string;
  objectData: any;
}

export function convertSocketData(
  rawData: any,
  nodes: { id: string; name: string }[]
): SocketEventData | null {
  if (!rawData) return null;

  const content = rawData.event?.content;
  const time = rawData.event?.time;
  const data =
    content.FlowStart ??
    content.NodeStart ??
    content.NodeFinish ??
    content.NodeOutput ??
    content.FlowLog ??
    content.FlowError;

  if (!data) return null;

  if (content.FlowStart) {
    return {
      time: new Date(time),
      id: undefined,
      nodeName: undefined,
      event: 'Flow Start',
      objectData: undefined,
    };
  }

  if (content.FlowLog) {
    return {
      time: new Date(time),
      id: undefined,
      nodeName: content.FlowLog.level,
      event: 'Flow Log',
      objectData: content.FlowLog.module + ' - ' + content.FlowLog.content,
    };
  }

  const nodeId = data.node_id;
  const nodeName = nodes.find((node) => node.id === nodeId)?.name;

  if (data.input) {
    const objectData = convertValue(data.input);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'Node Start',
      objectData,
    };
  }

  if (data.output) {
    const objectData = convertValue(data.output);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'Node Output',
      objectData,
    };
  }

  if (data.er) {
    const objectData = convertValue(data.output);
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'Error',
      objectData,
    };
  }

  if (content.NodeFinish) {
    // const nodeId = content.NodeFinish.node_id;
    // const nodeName = nodes.find((node) => node.id === nodeId)?.name;
    // if (!nodeName) return null;
    return {
      time: new Date(time),
      id: nodeId,
      nodeName,
      event: 'Node Finish',
      objectData: undefined,
    };
  }

  return null;
}
