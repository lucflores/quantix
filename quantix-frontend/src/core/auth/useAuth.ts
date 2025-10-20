import { create } from "zustand";
import { api } from "../api/client";
import { setAuthToken } from "../api/client";

type AuthState = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthed: () => boolean;
};

export const useAuth = create<AuthState>((set, get) => ({
  token: null,

  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const token = data.token as string;
    set({ token });
    setAuthToken(data.token);
  },

  logout() {
    set({ token: null });
    setAuthToken(undefined);
  },

  isAuthed() {
    return !!get().token;
  },
}));
