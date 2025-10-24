import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { register, login, changePassword } from "../controllers/auth.controller.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []   # importante: login es público, NO requiere JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@quantix.com }
 *               password: { type: string, example: Secret123 }
 *     responses:
 *       200:
 *         description: OK (devuelve token JWT)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       401:
 *         description: Credenciales inválidas
 */

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);

export default router;
