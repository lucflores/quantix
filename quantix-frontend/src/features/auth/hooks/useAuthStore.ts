import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "../../../core/api/client";

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

      // ✅ al guardar el token, lo aplicamos globalmente a axios
      setToken: (t: string) => {
        set({ token: t });
        setAuthToken(t);
      },

      // ✅ al cerrar sesión, lo eliminamos
      clear: () => {
        set({ token: null });
        setAuthToken();
      },

      isAuthed: () => !!get().token,
    }),
    { name: "quantix-auth" }
  )
);

// ✅ al iniciar la app, si hay un token persistido, lo aplicamos a Axios
const { token } = useAuthStore.getState();
if (token) {
  setAuthToken(token);
}
