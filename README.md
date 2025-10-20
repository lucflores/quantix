# Quantix (Dev stack con Docker)

Sistema de gestión (productos, stock, compras, ventas, clientes y reportes) con **API Node/Express + PostgreSQL + Prisma** y **Frontend React (Vite)**.

## Stack
- **API:** Node 20, Express, Prisma (PostgreSQL), JWT
- **DB:** PostgreSQL 16 (Docker)
- **Frontend:** React + Vite + TypeScript (Zustand/React Router listos para usar)
- **Dev con Docker:** `docker-compose.dev.yml` + `Dockerfile.dev` (API y Front)  
  - La API corre migraciones con Prisma al iniciar
  - Hot reload en API y Front

## Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y corriendo.
- Puertos libres: **3000** (API) y **5173** (Front).

## Primer arranque (dev)
```bash
# desde la raíz del repo
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up
