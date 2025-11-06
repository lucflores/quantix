import express from "express";
import { prisma } from "../lib/prisma.js"; // ajustá el path si tu cliente prisma está en otro lugar

const router = express.Router();

// 🔹 GET /api/v1/transactions → listar transacciones
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error al obtener transacciones:", err);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

// 🔹 POST /api/v1/transactions → crear nueva transacción
router.post("/", async (req, res) => {
  try {
    const { type, comprobanteUrl, comprobanteNum, partner, amount, status, date } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: { type, comprobanteUrl, comprobanteNum, partner, amount, status, date },
    });

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Error al crear transacción:", err);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

export default router;
