export const ENV = {
  API_URL: import.meta.env.VITE_API_URL as string,
  TOKEN_KEY: (import.meta.env.VITE_TOKEN_KEY as string) || "quantix.token",
};
