import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";
import { can } from "../middleware/authz.js";

const router = express.Router();

// Listado simple (activos)
router.get("/", verifyToken, can("customer:list"), async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const where = q ? { AND: [{ active: true }, { name: { contains: q, mode: "insensitive" } }] } : { active: true };
  const items = await prisma.customer.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ items });
});

// Crear
router.post("/", verifyToken, can("customer:create"), async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name es obligatorio" });
  try {
    const c = await prisma.customer.create({ data: { name, email: email || null, phone: phone || null } });
    res.status(201).json(c);
  } catch (e) {
    // email único duplicado, etc.
    res.status(400).json({ error: e.message });
  }
});

// Editar
router.put("/:id", verifyToken, can("customer:update"), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, active } = req.body;
  try {
    const c = await prisma.customer.update({
      where: { id },
      data: { 
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(active !== undefined ? { active: !!active } : {}),
      },
    });
    res.json(c);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
