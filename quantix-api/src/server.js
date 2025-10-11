import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import movementsRoutes from "./routes/movements.js";

dotenv.config();
const app = express();

// --- Seguridad y utilidades ---
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS: por ahora abierto; en prod tenemos que poner dominio
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Healthcheck ---
app.get("/health", async (_req, res) => {
  // se podría testear la DB con un ping 
  res.json({ ok: true, uptime: process.uptime() });
});

// --- Rate limit solo para /auth ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/v1/auth", authLimiter);

// --- Rutas versionadas ---
app.get("/", (_req, res) => res.json({ ok: true, name: "Quantix API v1" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
if (movementsRoutes) app.use("/api/v1/movements", movementsRoutes);

// --- Manejador de errores simple (fallback) ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));
