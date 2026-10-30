#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")/.."
umask 077
if [ ! -f .demo.local.env ]; then
  node -e 'const fs=require("fs"),c=require("crypto");fs.writeFileSync(".demo.local.env",["DB_PASSWORD","AMQP_PASSWORD","JWT_SECRET"].map(k=>k+"="+c.randomBytes(32).toString("hex")).join("\n")+"\n",{flag:"wx",mode:0o600})'
fi
for attempt in $(seq 1 60); do
  if docker info >/dev/null 2>&1; then break; fi
  sleep 2
done
compose=(docker compose --env-file .demo.local.env -f docker-compose.demo.yml)
# Sequential builds keep peak memory below the small Codespaces machine budget.
"${compose[@]}" build backend
"${compose[@]}" build frontend
"${compose[@]}" up -d --wait --wait-timeout 300
"${compose[@]}" exec -T postgres psql -U delivery -d delivery -v ON_ERROR_STOP=1 < delivery-service/migrations/002-order-line-snapshots.sql
"${compose[@]}" exec -T postgres psql -U delivery -d delivery -v ON_ERROR_STOP=1 < deploy/server/demo.sql
node scripts/smoke-demo.cjs
echo 'Open port 5173 in the Ports tab, then /menu. Stop the Codespace when finished.'
