// src/app.js
// Express app para Quantix (ESM)

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// (opcional) log de body en dev
import morganBody from "morgan-body";

// --- Swagger / OpenAPI ---
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// --- Middlewares propios ---
import { errorHandler } from "./middleware/error.js";   
import { verifyToken } from "./middleware/auth.js";      

// --- Rutas (ajusta paths si cambian) ---
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import movementsRoutes from "./routes/movements.js";
import purchasesRoutes from "./routes/purchases.js";
import salesRoutes from "./routes/sales.js";
import customersRoutes from "./routes/customers.js";
import reportsRoutes from "./routes/reports.js";

const app = express();

// ====== Middlewares base ======
app.use(helmet());

app.use(
  cors({
    origin: true, // en dev: permitir cualquier origen
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// Morgan (logs HTTP)
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// Log de body en dev (mask password)
if (process.env.LOG_BODY === "on" && process.env.NODE_ENV !== "production") {
  morganBody(app, {
    logResponseBody: true,
    maxBodyLength: 2000,
    filterParameters: ["password", "Authorization"],
  });
}

// ====== Rate limit sólo para /auth ======
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 20,           // 20 req/min
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/auth", authLimiter);

// ====== Healthcheck ======
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// ====== Swagger /api-docs ======
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Quantix API", version: "1.0.0" },
    servers: [{ url: "/api/v1" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    // Por default, los endpoints requieren JWT
    security: [{ bearerAuth: [] }],
  },
  // Acá Swagger busca bloques @swagger en tus archivos
  apis: [
    "./src/routes/**/*.js",
    "./src/controllers/**/*.js",
  ],
});

// Si quisieras proteger /api-docs en entornos públicos, podés envolver con verifyToken
// app.use("/api-docs", verifyToken, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====== Prefijo de API v1 ======
const api = express.Router();

// Rutas públicas
api.use("/auth", authRoutes);

// Rutas protegidas (si tu verifyToken va en cada router, podés omitir este `use`)
api.use(verifyToken);

api.use("/products", productsRoutes);
api.use("/movements", movementsRoutes);
api.use("/purchases", purchasesRoutes);
api.use("/sales", salesRoutes);
api.use("/customers", customersRoutes);
api.use("/reports", reportsRoutes);

app.use("/api/v1", api);

// ====== 404 para rutas no encontradas ======
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "") return next(); 
  res.status(404).json({ error: "Not Found" });
});

// ====== Error handler global ======
app.use(errorHandler);

export default app;
