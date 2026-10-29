# Развёртывание в серверном Kubernetes

Команды ниже — Bash на машине с Docker, kubectl, openssl и доступом к registry и кластеру. Репозиторий должен быть открыт в корневой папке. Кластеру нужен default StorageClass с динамическими PVC; образы собираются под архитектуру его узлов. Текущая конфигурация — демонстрационный стенд с одной репликой API, без публичного Ingress и HA.

## 1. Собрать и отправить образы

Заменить registry и context своими значениями. Registry должен быть доступен узлам; пример рассчитан на образы, доступные для скачивания без авторизации. Для приватного registry предварительно настрой `imagePullSecrets` для ServiceAccount `default` в namespace `flowing-delivery-lab`.

```bash
set -euo pipefail
export REGISTRY=registry.example.com/your-project
export RELEASE=$(git rev-parse --short HEAD)
export KUBE_CONTEXT=your-server-context

kubectl --context "$KUBE_CONTEXT" get nodes
kubectl --context "$KUBE_CONTEXT" get storageclass
docker login "${REGISTRY%%/*}"
docker build -f delivery-service/Dockerfile.k8s -t "$REGISTRY/backend:$RELEASE" delivery-service
docker build -f frontend/Dockerfile.k8s -t "$REGISTRY/frontend:$RELEASE" frontend
docker push "$REGISTRY/backend:$RELEASE"
docker push "$REGISTRY/frontend:$RELEASE"
```

## 2. Создать namespace и Secret

Продолжить в том же терминале. Существующий Secret сохраняется: смена его значения не меняет пароль в уже созданной БД.

```bash
kubectl --context "$KUBE_CONTEXT" apply -f k8s/namespace.yaml
existing_secret=$(kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab get secret delivery-secrets --ignore-not-found -o name)
if [ -z "$existing_secret" ]; then
  kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab create secret generic delivery-secrets \
    --from-literal=DB_PASSWORD="$(openssl rand -hex 32)" \
    --from-literal=AMQP_PASSWORD="$(openssl rand -hex 32)" \
    --from-literal=JWT_SECRET="$(openssl rand -hex 32)"
fi
```

## 3. Применить манифесты

Локальные имена образов и `imagePullPolicy: Never` заменяются только в потоке вывода. Исходные файлы репозитория не меняются. `REGISTRY` и `RELEASE` должны содержать обычные символы имени образа/тега, без `&` и `|`.

```bash
kubectl kustomize k8s | sed \
  -e "s|flowing-delivery-backend:senior|$REGISTRY/backend:$RELEASE|g" \
  -e "s|flowing-delivery-frontend:senior|$REGISTRY/frontend:$RELEASE|g" \
  -e 's|imagePullPolicy: Never|imagePullPolicy: IfNotPresent|g' \
  | kubectl --context "$KUBE_CONTEXT" apply -f -

for resource in statefulset/postgres statefulset/rabbitmq deployment/account deployment/banner deployment/event deployment/payment deployment/api deployment/frontend; do
  kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab rollout status "$resource" --timeout=300s
done
```

Для новой версии повторить сборку/push с новым `RELEASE` и применение манифестов. Это не запускает миграции существующей БД: перед обновлением проверить [миграцию снимков заказа](DDD_CHECKOUT.md). Начальная инициализация PostgreSQL работает только на пустом PVC.

## 4. Открыть приложение и проверить

На своём компьютере с kubeconfig сервера, в отдельных терминалах; заменить `YOUR_SERVER_CONTEXT`:

```bash
kubectl --context YOUR_SERVER_CONTEXT -n flowing-delivery-lab port-forward svc/api 3444:3444
```

```bash
kubectl --context YOUR_SERVER_CONTEXT -n flowing-delivery-lab port-forward svc/frontend 5173:5173
```

Открыть http://localhost:5173/menu и http://localhost:3444/api/categories. Для текущих адресов frontend и CORS использовать именно `localhost`. Пересоздание Pod может завершить port-forward: в этом случае запустить его повторно.

Диагностика:

```bash
kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab get pods,pvc
kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab logs deployment/api --tail=100
kubectl --context "$KUBE_CONTEXT" -n flowing-delivery-lab logs deployment/account --tail=100
```

`Deploy-Lab.ps1` здесь не используется: он принимает только локальные контексты. S3 подключается отдельно по [инструкции](S3_STORAGE.md); по умолчанию загрузки хранятся на PVC API. Ограничения приложения перечислены в [ревью](SENIOR_REVIEW.md).
