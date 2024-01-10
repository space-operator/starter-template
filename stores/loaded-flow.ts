import { Flow } from '@/types/flows';
import { create } from 'zustand';

interface FlowState {
  flow: Flow | null;
  setFlow: (flow: Flow) => void;
  getFlow: () => Flow | null;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  flow: null,
  setFlow: (flow) => set({ flow }),
  getFlow: () => get().flow,
}));
