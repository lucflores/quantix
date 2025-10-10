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
