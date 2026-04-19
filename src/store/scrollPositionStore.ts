import { create } from 'zustand';

export type ScrollPositionState = {
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
};

const useScrollPositionStore = create<ScrollPositionState>()(set => ({
  scrollPosition: 0,
  setScrollPosition: (position: number) => set({ scrollPosition: position }),
}));

export default useScrollPositionStore;
