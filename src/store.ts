import { create } from "zustand";

const useStore = create((set) => ({
  currentModal: null,
  setModal: (newModal: any) =>
    set((state: any) => ({ ...state, currentModal: newModal })),
}));

export default useStore;
