import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  resetCount: () => void;
}

interface InputState {
  text: string;
  setText: (text: string) => void;
  resetText: () => void;
}

interface StoreState extends CounterState, InputState {}

export const useStore = create<StoreState>((set) => ({
  // Counter Slice
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  resetCount: () => set({ count: 0 }),

  // Input Slice
  text: '',
  setText: (text) => set({ text }),
  resetText: () => set({ text: '' }),
}));
