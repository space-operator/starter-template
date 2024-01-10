import { create } from 'zustand';

interface JsonFormState {
  json: Record<string, unknown>;
  setJson: (json: Record<string, unknown>) => void;
  getJson: () => Record<string, unknown>;
}

export const useJsonForm = create<JsonFormState>((set, get) => ({
  json: { amount: { F: '0.001' }, sender: { S: '' } },
  setJson: (json) => set({ json }),
  getJson: () => get().json,
}));
