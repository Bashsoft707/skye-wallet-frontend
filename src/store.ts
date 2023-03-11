import { create } from "zustand";

const useStore = create((set) => ({
  token: "",
  user: null,
  currentModal: null,
  userDetails: {},
  setModal: (newModal: any) =>
    set((state: any) => ({ ...state, currentModal: newModal })),
  setToken: (newVal: any) => set((state: any) => ({ ...state, token: newVal })),
  setUser: (newUser: any) => set((state: any) => ({ ...state, user: newUser })),
  setUserDetails: (userDetail: any) =>
    set((state: any) => ({ ...state, userDetails: userDetail })),
}));

export default useStore;
