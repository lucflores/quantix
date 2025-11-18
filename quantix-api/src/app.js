import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import morganBody from "morgan-body";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { errorHandler } from "./middleware/error.js";
import { verifyToken } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import movementsRoutes from "./routes/movements.js";
import purchasesRoutes from "./routes/purchases.js";
import salesRoutes from "./routes/sales.js";
import customersRoutes from "./routes/customers.js";
import suppliersRoutes from "./routes/suppliers.js"; 
import reportsRoutes from "./routes/reports.js";
import transactionsRoutes from "./routes/transactions.js";

const app = express();


app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

if (process.env.LOG_BODY === "on" && process.env.NODE_ENV !== "production") {
  morganBody(app, {
    logResponseBody: true,
    maxBodyLength: 2000,
    filterParameters: ["password", "Authorization"],
  });
}

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/v1/auth", authLimiter);
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});
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
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "./src/routes/**/*.js",
    "./src/controllers/**/*.js",
  ],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const api = express.Router();
api.use("/auth", authRoutes);
api.use(verifyToken);
api.use("/products", productsRoutes);
api.use("/movements", movementsRoutes);
api.use("/purchases", purchasesRoutes);
api.use("/sales", salesRoutes);
api.use("/customers", customersRoutes);
api.use("/suppliers", suppliersRoutes); 
api.use("/reports", reportsRoutes);
api.use("/transactions", transactionsRoutes);
app.use("/api/v1", api);
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "") return next();
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

export default app;