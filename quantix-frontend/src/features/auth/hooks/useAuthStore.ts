import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  setToken: (t: string) => void;
  clear: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (t: string) => set({ token: t }),
      clear: () => set({ token: null }),
      isAuthed: () => !!get().token,
    }),
    { name: "quantix-auth" } 
  )
);
