#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
# The SSH account owns a kubeconfig for this dedicated demo cluster.
namespace=flowing-delivery-lab
kubectl get namespace "$namespace" >/dev/null
kubectl -n "$namespace" get secret delivery-secrets ghcr-pull >/dev/null
kubectl apply -f manifests.yaml
for resource in statefulset/postgres statefulset/rabbitmq deployment/account deployment/banner deployment/event deployment/payment deployment/api deployment/frontend; do
  kubectl -n "$namespace" rollout status "$resource" --timeout=300s
done

# Worker readiness is only TCP; wait for an actual RPC response before touching data.
kubectl -n "$namespace" port-forward svc/api 18081:3444 > api-forward.log 2>&1 &
api_pid=$!
kubectl -n "$namespace" port-forward svc/frontend 18080:5173 > frontend-forward.log 2>&1 &
frontend_pid=$!
trap 'kill "$api_pid" "$frontend_pid" 2>/dev/null || true' EXIT
ready=false
for attempt in $(seq 1 60); do
  if curl --fail --silent --max-time 10 http://127.0.0.1:18081/api/categories > categories.json; then
    ready=true
    break
  fi
  sleep 2
done
if [ "$ready" != true ]; then echo 'API/RabbitMQ/account smoke check failed'; exit 1; fi

# Additive migration and repeatable data import; never restore the historical dump.
kubectl -n "$namespace" exec -i postgres-0 -- psql -U delivery -d delivery -v ON_ERROR_STOP=1 < snapshots.sql
kubectl -n "$namespace" exec -i postgres-0 -- psql -U delivery -d delivery -v ON_ERROR_STOP=1 < demo.sql
curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 2 --max-time 10 http://127.0.0.1:18080/menu > frontend.html
grep -q '<html' frontend.html
curl --fail --silent --show-error --max-time 15 http://127.0.0.1:18081/api/categories > categories.json
grep -q 'demo-menu-v1' categories.json
echo 'Deployment and demo data smoke checks passed.'
