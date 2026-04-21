import { create } from "zustand";

export const useChaosStore = create((set) => ({
  forceTimeout: false,
  force404: false,
  force500: false,
  badUrl: false,
  setMode: (key) =>
    set((state) => {
      const active = !state[key];
      return {
        forceTimeout: false,
        force404: false,
        force500: false,
        badUrl: false,
        [key]: active,
      };
    }),
  clearChaos: () =>
    set({ forceTimeout: false, force404: false, force500: false, badUrl: false }),
}));