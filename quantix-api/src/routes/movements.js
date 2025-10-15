import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { listMovements } from "../controllers/movements.controller.js";

const router = Router();

// v1: sin AUTHZ/can()
router.get("/", verifyToken, listMovements);

export default router;
