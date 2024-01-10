import { create } from 'zustand';

export interface FlowPrep {
  flowId: number;
  authorization?: string;
  inputs?: any;
  network?: string;
}

interface FlowPrepState {
  flowPrep: FlowPrep | null;
  setFlowPrep: (flowPrep: FlowPrep) => void;
  getFlowPrep: () => FlowPrep | null;
}

export const useFlowPrep = create<FlowPrepState>((set, get) => ({
  flowPrep: null,
  setFlowPrep: (flowPrep) => set({ flowPrep }),
  getFlowPrep: () => get().flowPrep,
}));
