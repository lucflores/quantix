import app from "./app.js";

const PORT = process.env.PORT || 4000;

// Evitar escuchar en tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`🚀 API escuchando en http://localhost:${PORT}`)
  );
}

export default app;
