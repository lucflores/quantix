// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// helpers
const D = (v) => new prisma.$extends({}).Decimal(v ?? 0); // no usado, solo por si
const DEFAULT_STEP = { UNIT: '1.000', KG: '0.001', LT: '0.001', M: '0.001' };

async function main() {
  // -------- Admin user --------
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@quantix.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin1234';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Administrador',
      passwordHash,
      role: 'ADMIN', // ajustá si tu enum/valor es distinto
      active: true,
    },
  });

  console.log(`👤 Admin listo: ${admin.email} / ${password}`);

  // -------- Productos demo --------
  const products = [
    { sku: 'UNIT-001', name: 'Lapicera', unit: 'UNIT', step: DEFAULT_STEP.UNIT,  price: 500,  cost: 300,  stock: 0,    minStock: 10 },
    { sku: 'KG-001',   name: 'Carne Molida', unit: 'KG', step: DEFAULT_STEP.KG,  price: 5200, cost: 3800, stock: 1.250, minStock: 0.500 },
    { sku: 'LT-001',   name: 'Detergente',   unit: 'LT', step: DEFAULT_STEP.LT,  price: 900,  cost: 650,  stock: 2.000, minStock: 1.000 },
    { sku: 'M-001',    name: 'Cable Eléctrico', unit: 'M', step: DEFAULT_STEP.M, price: 450,  cost: 300,  stock: 15.000, minStock: 5.000 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sku: p.sku,
        name: p.name,
        unit: p.unit,
        step: p.step,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        minStock: p.minStock,
        active: true,
      },
    });
  }
  console.log('📦 Productos demo listos');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seed OK');
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
