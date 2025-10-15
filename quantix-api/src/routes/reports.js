import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { lowStock } from "../controllers/reports.controller.js";

const router = Router();

router.get("/low-stock", verifyToken, lowStock);

export default router;

