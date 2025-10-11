# Quantix API

Backend: Node.js + Express + Prisma + PostgreSQL

## Requisitos
- Docker (PostgreSQL) o Postgres local
- Node 18+

## Setup rápido
```bash
docker run --name quantix-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=quantix -e POSTGRES_DB=quantix -p 5432:5432 -v quantix_pg:/var/lib/postgresql/data -d postgres:16
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev

## Endpoints (v1)
Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login

Productos (JWT)
- GET    /api/v1/products?q=&page=&limit=&includeInactive=1
- POST   /api/v1/products
- PUT    /api/v1/products/:id
- PATCH  /api/v1/products/:id/status   { "active": true|false }  # Regla: no desactivar con stock > 0

Movimientos (si aplica)
- POST   /api/v1/movements  { productId, kind: IN|OUT, quantity }
- GET    /api/v1/movements  (últimos 50)

Infra
- GET /health → { ok, uptime }
- Seguridad: helmet + rate-limit en /api/v1/auth
- Logs: morgan

DB
- PostgreSQL 16 (Docker)
- Decimal(12,2) en dinero/stock
- Product.active (soft delete)