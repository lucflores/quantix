import { jest } from "@jest/globals";
jest.setTimeout(15000);

import request from "supertest";
// @ts-ignore
import { prisma } from "../src/lib/prisma.js";

const API = "http://localhost:4000";

// Helper: espera a que el server responda /health
async function waitForServerReady(retries = 10, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await request(API).get("/health");
      if (res.status === 200 && res.body.ok) return true;
    } catch {
      // espera y reintenta
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error("Server not ready after retries");
}

describe("Reports: /reports/low-stock", () => {
  let token: string;

  beforeAll(async () => {
    // esperamos que la API esté lista
    await waitForServerReady();

    // login para obtener token
    const login = await request(API)
      .post("/api/v1/auth/login")
      .send({ email: "admin@quantix.dev", password: "admin123" });

    // si el usuario no existe, lo creamos para el test
    if (login.status === 404) {
      await request(API)
        .post("/api/v1/auth/register")
        .send({ email: "admin@quantix.dev", password: "admin123" });
      const relog = await request(API)
        .post("/api/v1/auth/login")
        .send({ email: "admin@quantix.dev", password: "admin123" });
      token = relog.body.token;
    } else {
      token = login.body.token;
    }

    // limpiamos productos viejos de test
    await prisma.product.deleteMany({
      where: { name: { startsWith: "TEST-" } },
    });

    // creamos productos con distintos stocks/minStock
    await prisma.product.createMany({
      data: [
        { sku: "TEST-A", name: "TEST-A", cost: 10, price: 20, stock: 2, minStock: 5 },
        { sku: "TEST-B", name: "TEST-B", cost: 10, price: 20, stock: 5, minStock: 5 },
        { sku: "TEST-C", name: "TEST-C", cost: 10, price: 20, stock: 8, minStock: 4 },
        { sku: "TEST-D", name: "TEST-D", cost: 10, price: 20, stock: 0, minStock: 3 },
      ],
    });
  });

  afterAll(async () => {
    // limpieza
    await prisma.product.deleteMany({
      where: { name: { startsWith: "TEST-" } },
    });
    await prisma.$disconnect();
  });

  it("lista productos con stock <= minStock ordenados por faltante desc", async () => {
    const res = await request(API)
      .get("/api/v1/reports/low-stock")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);

    // debería devolver solo los productos con stock menor o igual al minStock
    const names = res.body.items.map((p: any) => p.name);
    expect(names).toContain("TEST-A");
    expect(names).toContain("TEST-D");
    expect(names).not.toContain("TEST-C");

    // y ordenados por faltante (mayor faltante primero)
    const diffs = res.body.items.map((p: any) => p.minStock - p.stock);
    const sorted = [...diffs].sort((a, b) => b - a);
    expect(diffs).toEqual(sorted);
  });
});
