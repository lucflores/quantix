import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, role: role || "EMPLEADO" },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    return res.json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
  return res.json({ token });
});

// Cambiar contraseña
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: "Contraseña actual incorrecta" });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

    res.json({ ok: true, message: "Contraseña actualizada" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 1) Solicitar reseteo
/*router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const user = await prisma.user.findUnique({ where: { email } });
  // Responder SIEMPRE 200 para no filtrar emails existentes
  if (!user) return res.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  await prisma.passwordReset.create({
    data: { userId: user.id, token, expiresAt }
  });

  // DEV: mostrar token en logs (en prod enviar por email)
  console.log(`[RESET TOKEN] ${email} -> ${token}`);

  return res.json({ ok: true });
});

// 2) Confirmar reseteo
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const pr = await prisma.passwordReset.findUnique({ where: { token } });
  if (!pr || pr.used) return res.status(400).json({ error: "Token inválido" });
  if (new Date(pr.expiresAt) < new Date()) {
    return res.status(400).json({ error: "Token expirado" });
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: pr.userId }, data: { password: hash } });
    await tx.passwordReset.update({ where: { token }, data: { used: true } });
    //invalidar otros tokens previos del mismo user
    await tx.passwordReset.updateMany({
      where: { userId: pr.userId, used: false, token: { not: token } },
      data: { used: true }
    });
  });

  return res.json({ ok: true, message: "Contraseña restablecida" });
}); */

export default router;
