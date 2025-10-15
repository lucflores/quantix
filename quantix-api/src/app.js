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
import customerRoutes from "./routes/customers.js";
import reportRoutes from "./routes/reports.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// -------- Middlewares base --------
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

// -------- Health & raíz --------
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});
app.get("/", (_req, res) => res.json({ ok: true, name: "Quantix API v1" }));

// -------- Rate limit solo /auth --------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/v1/auth", authLimiter);

// -------- Rutas --------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/movements", movementsRoutes);
app.use("/api/v1/purchases", purchaseRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/customers", customerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

export default app;
