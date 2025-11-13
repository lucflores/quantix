export const ENV = {
  API_URL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : "http://localhost:3001"),

  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || "quantix.token",
};
