import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@quantix.local';
  const plain = process.env.SEED_ADMIN_PASSWORD || '1234';
  const password = await bcrypt.hash(plain, 10); 

  // Crea (o asegura) el usuario admin
  await prisma.user.upsert({
    where: { email },
    update: {}, 
    create: {
      email,
      password,                 
      role: 'ADMIN',            
      active: true,
      mustChangePassword: false,
    },
  });
  console.log(`👤 Admin listo: ${email} / ${plain}`);

  // Productos demo
  const DEFAULT_STEP = { UNIT: '1.000', KG: '0.001', LT: '0.001', M: '0.001' };
  const products = [
    { sku: 'UNIT-001', name: 'Lapicera',        unit: 'UNIT', step: DEFAULT_STEP.UNIT, price: 500,  cost: 300,  stock: 0,      minStock: 10 },
    { sku: 'KG-001',   name: 'Carne Molida',    unit: 'KG',   step: DEFAULT_STEP.KG,   price: 5200, cost: 3800, stock: 1.250,  minStock: 0.500 },
    { sku: 'LT-001',   name: 'Detergente',      unit: 'LT',   step: DEFAULT_STEP.LT,   price: 900,  cost: 650,  stock: 2.000,  minStock: 1.000 },
    { sku: 'M-001',    name: 'Cable Eléctrico', unit: 'M',    step: DEFAULT_STEP.M,    price: 450,  cost: 300,  stock: 15.000, minStock: 5.000 },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { sku: p.sku }, update: {}, create: p });
  }
  console.log('📦 Productos demo listos');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
