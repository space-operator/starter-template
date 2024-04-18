import { FlowRunResponse } from '@/types/flows';
import { create } from 'zustand';

interface FlowRunState {
  flowResponse: FlowRunResponse | null;
  setFlowResponse: (flowResponse: FlowRunResponse) => void;
  getFlowResponse: () => FlowRunResponse | null;
}

export const useFlowRun = create<FlowRunState>((set, get) => ({
  flowResponse: null,
  setFlowResponse: (flowResponse) => set({ flowResponse }),
  getFlowResponse: () => get().flowResponse,
}));
