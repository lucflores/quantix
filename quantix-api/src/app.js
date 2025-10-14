import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import movementsRoutes from "./routes/movements.js";
import purchaseRoutes from "./routes/purchases.js";
import salesRoutes from "./routes/sales.js";

dotenv.config();

const app = express();

// --- Seguridad y utilidades (antes de las rutas) ---
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- Healthcheck ---
app.get("/health", async (_req, res) => {
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

// Rutas de compras y ventas
app.use("/api/v1/purchases", purchaseRoutes);
app.use("/api/v1/sales", salesRoutes);

// --- Manejador de errores simple (fallback) ---
app.use((err, _req, res, _next) => {
  console.error("❌ Uncaught error:", err);
  const status = err.status || 500;
  const payload =
    process.env.NODE_ENV === "production"
      ? { error: "Internal Server Error" }
      : { error: err.message, stack: err.stack };
  res.status(status).json(payload);
});

export default app;

