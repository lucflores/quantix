import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { listMovements } from "../controllers/movements.controller.js";

const router = Router();

// Acepta /movements y /movements/
router.get("/", verifyToken, listMovements);
router.get("", verifyToken, listMovements);

export default router;
