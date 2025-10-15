import { jest } from "@jest/globals";
import { prisma } from "./src/lib/prisma.js";

afterAll(async () => {
  try {
    await prisma.$disconnect();
    console.log("🧹 Prisma desconectado correctamente (global)");
  } catch (err) {
    console.warn("⚠️ Error al desconectar Prisma:", err.message);
  }
});

// Timeout global (ESM requiere import explícito de jest)
jest.setTimeout(15000);
