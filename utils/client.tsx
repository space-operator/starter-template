import { Client, WsClient } from '@space-operator/client';

export const restClient = new Client({
  // url: 'http://localhost:8080',
  url: 'https://dev-api.spaceoperator.com',
});

export const wsClient = new WsClient({
  // url: 'ws://localhost:8080/ws',
  url: 'wss://dev-api.spaceoperator.com/ws',
});
wsClient.setLogger(console.log);
