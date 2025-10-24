#!/usr/bin/env bash
set -e

echo "🔧 Esperando a la base de datos..."
# opcional: un pequeño sleep si tu DB tarda en levantar
sleep 2

echo "🗂️  Aplicando migraciones (deploy)..."
npx prisma migrate deploy

echo "🚀 Iniciando API en modo desarrollo..."
# si tu package.json tiene "dev": "node --watch src/server.js"
npm run dev