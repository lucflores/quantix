import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createSale, listSales } from "../controllers/sales.controller.js";

const router = Router();

// v1: sin AUTHZ/can()
router.post("/", verifyToken, createSale);
router.get("/", verifyToken, listSales);

export default router;
