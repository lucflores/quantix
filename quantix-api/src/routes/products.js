import express from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Listar
router.get("/", verifyToken, async (_req, res) => {
  const items = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

// Crear
router.post("/", verifyToken, async (req, res) => {
  try {
    const { sku, name, cost, price, stock = 0, minStock = 0 } = req.body;
    const p = await prisma.product.create({ data: { sku, name, cost, price, stock, minStock } });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Actualizar
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const p = await prisma.product.update({ where: { id }, data: req.body });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Eliminar
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
