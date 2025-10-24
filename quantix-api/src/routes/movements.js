import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { listMovements } from "../controllers/movements.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movements
 *   description: Movimientos de inventario
 */

/**
 * @swagger
 * /movements:
 *   get:
 *     summary: Últimos 100 movimientos con datos de producto
 *     tags: [Movements]
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   kind: { type: string, enum: [IN, OUT] }
 *                   quantity:
 *                     oneOf:
 *                       - { type: string }
 *                       - { type: number }
 *                   productId: { type: string }
 *                   createdById: { type: string, nullable: true }
 *                   createdAt: { type: string, format: date-time }
 *                   product:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       sku: { type: string }
 *                       name: { type: string }
 */

router.get("/", verifyToken, listMovements);

export default router;
