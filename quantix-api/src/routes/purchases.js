import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { createPurchase, listPurchases } from "../controllers/purchases.controller.js";

const router = Router();

// v1: sin AUTHZ/can()
router.post("/", verifyToken, createPurchase);
router.get("/", verifyToken, listPurchases);

export default router;
