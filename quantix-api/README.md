Quantix API

Backend de gestión de productos, stock, compras y ventas.
Stack: Node.js + Express + Prisma + PostgreSQL.
Auth: JWT. Versionado: /api/v1/*.

Requisitos

Node 18+

Docker (PostgreSQL) o Postgres local

Setup rápido
# 1 - Base de datos (Docker)
docker run --name quantix-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=quantix \
  -e POSTGRES_DB=quantix \
  -p 5432:5432 \
  -v quantix_pg:/var/lib/postgresql/data \
  -d postgres:16

# 2 - Variables de entorno
cp .env.example .env
# (Editar .env si hace falta: DATABASE_URL / JWT_SECRET / PORT)

# 3 - Dependencias + migraciones + seed
npm install
npx prisma migrate dev
npx prisma db seed

# 4 - Levantar API
npm run dev
# Health: http://localhost:4000/health  → { ok: true, uptime }

Endpoints (v1)

Auth 
POST /api/v1/auth/register
POST /api/v1/auth/login → { token }
Usar Authorization: Bearer <token> en rutas protegidas.

Productos (JWT)
GET /api/v1/products?q=&page=&limit=&includeInactive=1
POST /api/v1/products → 201 Created
- Crea producto (stock inicial 0.00). SKU único → duplicado responde 409.
- Los decimales (cost, price, stock, minStock) se serializan con 2 dígitos, ej. "0.00".
PUT /api/v1/products/:id (edita; no toca stock)
PATCH /api/v1/products/:id/status { "active": true|false }
- Regla: no desactivar si stock > 0 → 409
DELETE /api/v1/products/:id (soft delete: desactiva; misma regla de stock)

Compras (IN) — JWT
POST /api/v1/purchases → 201 Created
{
  "supplier": "Proveedor X",
  "items": [{ "productId": "<uuid>", "quantity": 5, "unitCost": 10.5 }]
}

. Valida quantity > 0 y unitCost >= 0 (Decimal).
. Transacción: cabecera + ítems + movimientos IN + actualiza stock.
. Audita con createdById (usuario del token).

GET /api/v1/purchases (últimas 50 con ítems)

Ventas (OUT) — JWT
POST /api/v1/sales → 201 Created
{
  "customer": "Cliente Y",
  "items": [{ "productId": "<uuid>", "quantity": 2, "unitPrice": 120 }]
}

. Valida producto activo y stock suficiente.
. Transacción: cabecera + ítems + movimientos OUT + actualiza stock.
GET /api/v1/sales (últimas 50 con ítems)

Movimientos — JWT
GET /api/v1/movements (auditoría simple; últimos movimientos)

Infra
GET /health → { ok, uptime }
Seguridad: helmet + rate-limit en /api/v1/auth/*
Logs: morgan
CORS: abierto en dev (whitelist en prod)
Versionado: todas las rutas bajo /api/v1/

Testing (E2E con Jest + Supertest)
npm test
Incluye:
- tests/basic.e2e.spec.ts: health y login.
- tests/flow.e2e.spec.ts:
- crea producto (stock 0.00)
- venta sin stock → 4xx
- compra (IN) → 201
- venta (OUT) → 201
- no permite desactivar con stock > 0 → 4xx
-- Son pruebas de integración/E2E (Express + Prisma + DB real). No usan mocks.--

Troubleshooting
401: falta Authorization: Bearer <token> o JWT_SECRET incorrecto.
409 (productos): SKU duplicado.
409 (status): no se puede desactivar con stock > 0.
400 (compras/ventas): revisar body (números válidos, productId existente/activo, campos requeridos).

Hecho con ❤️ para Quantix.