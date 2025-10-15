Quantix API — Backend (v1)

Backend completo de Quantix, sistema de gestión de stock, compras, ventas y cuenta corriente.

⚙️ Stack Tecnológico
Área	Tecnología / Configuración
Backend	Node.js + Express (ESM)
ORM	Prisma ORM
Base de Datos	PostgreSQL 16 (Docker quantix-db)
Auth	JWT (bcrypt para hash)
Seguridad	helmet · rate-limit · CORS (abierto en dev)
Logs	morgan (dev / combined)
Test	Jest + Supertest (E2E reales contra API)
Versionado	/api/v1/*
Feature Flag	AUTHZ=off (middleware can() pasivo)

🧱 Modelos Principales (Prisma)
Enums
enum Role { ADMIN EMPLEADO }
enum MovementKind { IN OUT }
enum PaymentMethod { EFECTIVO CTA_CTE }

Entidades

Usuarios, productos, inventario, compras, ventas, clientes y pagos:

model User {
  id                 String   @id @default(uuid())
  email              String   @unique
  password           String
  role               Role     @default(EMPLEADO)
  active             Boolean  @default(true)
  mustChangePassword Boolean  @default(false)
  createdAt          DateTime @default(now())
  passwordResets     PasswordReset[]
}

model Product {
  id        String   @id @default(uuid())
  sku       String   @unique
  name      String
  cost      Decimal  @db.Decimal(12,2)
  price     Decimal  @db.Decimal(12,2)
  stock     Decimal  @db.Decimal(12,2) @default(0)
  minStock  Decimal  @db.Decimal(12,2)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}

model InventoryMovement {
  id          String   @id @default(uuid())
  productId   String
  kind        MovementKind
  quantity    Decimal  @db.Decimal(12,2)
  createdById String
  createdAt   DateTime @default(now())
  product     Product  @relation(fields: [productId], references: [id])
}

model Purchase {
  id          String   @id @default(uuid())
  supplier    String
  createdById String
  createdAt   DateTime @default(now())
  items       PurchaseItem[]
}

model PurchaseItem {
  id         String   @id @default(uuid())
  purchaseId String
  productId  String
  quantity   Decimal  @db.Decimal(12,2)
  unitCost   Decimal  @db.Decimal(12,2)
  purchase   Purchase @relation(fields: [purchaseId], references: [id])
}

model Sale {
  id           String         @id @default(uuid())
  createdById  String
  createdAt    DateTime       @default(now())
  payment      PaymentMethod  @default(EFECTIVO)
  customerId   String?
  customerRel  Customer?      @relation("SaleCustomer", fields: [customerId], references: [id])
  customer     String?
  items        SaleItem[]
}

model SaleItem {
  id        String   @id @default(uuid())
  saleId    String
  productId String
  quantity  Decimal  @db.Decimal(12,2)
  unitPrice Decimal  @db.Decimal(12,2)
  sale      Sale     @relation(fields: [saleId], references: [id])
}

model Customer {
  id        String   @id @default(uuid())
  name      String
  email     String?  @unique
  phone     String?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  sales     Sale[]   @relation("SaleCustomer")
  payments  Payment[]
}

model Payment {
  id          String   @id @default(uuid())
  customerId  String
  amount      Decimal  @db.Decimal(12,2)
  method      String?
  reference   String?
  date        DateTime @default(now())
  createdById String
  createdAt   DateTime @default(now())
  customer    Customer @relation(fields: [customerId], references: [id])
}

model PasswordReset {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}


🧮 Todas las cantidades y montos son Decimal(12,2) para evitar errores de redondeo.

🧩 Endpoints Principales
Auth
Método	Ruta	Descripción
POST	/api/v1/auth/register	Alta de usuario
POST	/api/v1/auth/login	Devuelve { token }
Productos
Método	Ruta	Descripción
GET	/api/v1/products	Lista con búsqueda/paginación
POST	/api/v1/products	Crea producto (stock inicial 0)
PUT	/api/v1/products/:id	Editar producto
PATCH	/api/v1/products/:id/status	Activa/desactiva (no si stock > 0)
Movimientos
Método	Ruta	Descripción
POST	/api/v1/movements	Movimiento manual IN/OUT
GET	/api/v1/movements	Últimos 50
Compras / Ventas
Método	Ruta	Descripción
POST	/api/v1/purchases	Crea compra (IN stock)
POST	/api/v1/sales	Crea venta (OUT stock)
GET	/api/v1/sales	Lista últimas 50
Regla	payment = CTA_CTE → requiere customerId	
Clientes / Cuenta Corriente
Método	Ruta	Descripción
GET	/api/v1/customers	Listado (q opcional)
POST	/api/v1/customers	Alta cliente
PUT	/api/v1/customers/:id	Editar cliente
GET	/api/v1/customers/:id/balance	Suma ventas – pagos
GET	/api/v1/customers/:id/statement	Extracto detallado
POST	/api/v1/customers/:id/payments	Registrar pago

🧪 Tests E2E (Jest + Supertest)

basic.e2e.spec.ts → health + login
flow.e2e.spec.ts → CRUD productos + compra + venta
sales.payment.e2e.spec.ts → CTA_CTE requiere cliente
ar.e2e.spec.ts → Cuenta corriente: venta → saldo → pago → saldo

Todos los tests están verdes ✅
Ejecutar:
npm run start:test
npm test

🧰 Scripts (package.json)
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "start:test": "cross-env NODE_ENV=test node src/server.js",
    "test": "cross-env NODE_ENV=test jest --runInBand"
  }
}


npm run dev → modo desarrollo (hot reload)
npm run start:test → modo test estable
npm test → correr Jest (E2E)

🐘 Base de datos (Docker)
docker run --name quantix-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=quantix \
  -e POSTGRES_DB=quantix \
  -p 5432:5432 \
  -v quantix_pg:/var/lib/postgresql/data \
  -d postgres:16


Quick setup:
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev

🧮 Healthcheck
GET /health → { ok: true, uptime: ... }

🚀 Estado actual

✅ Usuarios y roles
✅ Autenticación con JWT
✅ Productos + Stock
✅ Compras / Ventas con actualización automática
✅ Movimientos de inventario
✅ Clientes y pagos (Cuenta Corriente)
✅ Balance y extracto
✅ Tests automáticos 100% verdes
✅ Infraestructura lista para deploy


Hecho con ❤️ para Quantix.