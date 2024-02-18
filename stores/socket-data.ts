import { SocketEventData } from '@/lib/websocket';
import { create } from 'zustand';

type SocketDataState = {
  socketData: (SocketEventData | null)[] | undefined;
  appendSocketData: (data: (SocketEventData | null)[] | undefined) => void;
};

export const useSocketDataStore = create<SocketDataState>((set) => ({
  socketData: [],
  appendSocketData: (data) =>
    set((state) => ({ socketData: [...state.socketData, ...data] })),
}));
