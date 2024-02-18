import { Client, WsClient } from '@space-operator/client';

export const restClient = new Client({
  url: 'https://dev-api.spaceoperator.com',
});

export const wsClient = new WsClient({
  url: 'wss://dev-api.spaceoperator.com/ws',
});
wsClient.setLogger(console.log);
