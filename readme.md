# Flowing Delivery

Сервис доставки еды: React, NestJS, PostgreSQL, RabbitMQ. Оформление заказа с транзакциями, checkout saga и загрузка файлов в local/S3 storage.

## Локальный запуск

**Демо в браузере без банковской карты:** [запустить в GitHub Codespaces](https://codespaces.new/Nastoiker/flowing-delivery?ref=feature%2Fddd-checkout&quickstart=1) → дождаться сборки → открыть порт **5173**. [Инструкция и бесплатные лимиты](docs/CODESPACES.md).

Нужны Docker с Linux containers, kubectl, kind и PowerShell. Команды выполнять из корня репозитория. Для Docker выделить около 4 CPU и 8 ГБ RAM.

```powershell
git clone git@github.com:Nastoiker/flowing-delivery.git
cd flowing-delivery
git checkout feature/ddd-checkout

.\k8s\Build-Lab.ps1
kind create cluster --name flowing-delivery --wait 120s
kind load docker-image --name flowing-delivery flowing-delivery-backend:senior flowing-delivery-frontend:senior
.\k8s\Deploy-Lab.ps1 -Context kind-flowing-delivery
```

Если кластер уже создан, повторять `kind create cluster` не нужно. При блокировке PowerShell-скриптов запускать их через `powershell -ExecutionPolicy Bypass -File <путь>`.

Открыть два терминала и оставить команды работающими:

```sh
kubectl --context kind-flowing-delivery -n flowing-delivery-lab port-forward svc/api 3444:3444
```

```sh
kubectl --context kind-flowing-delivery -n flowing-delivery-lab port-forward svc/frontend 5173:5173
```

Приложение: **http://localhost:5173/menu**. Проверка API: http://localhost:3444/api/categories. Зарегистрируй пользователя через интерфейс. Пароли инфраструктуры создаются автоматически; данные хранятся в PVC.

## На сервере Kubernetes

**Бесплатный демостенд + GitHub Actions:** [Oracle Always Free, k3s и тестовый дамп →](docs/FREE_DEMO_DEPLOY.md)

Нужны готовый кластер с default StorageClass, доступ через kubeconfig и registry для образов. [Команды сборки, публикации и развёртывания →](docs/SERVER_KUBERNETES.md)

После развёртывания выполнить на своём компьютере с kubeconfig сервера, в двух терминалах:

```sh
kubectl --context YOUR_SERVER_CONTEXT -n flowing-delivery-lab port-forward svc/api 3444:3444
kubectl --context YOUR_SERVER_CONTEXT -n flowing-delivery-lab port-forward svc/frontend 5173:5173
```

Открыть тот же **http://localhost:5173/menu**. Это демонстрационный стенд: публичный домен/Ingress потребует настройки адреса API и CORS; текущий вариант использует port-forward.

## Тесты и документация

В `delivery-service`: `npm ci`, `npm run test:domain`, `npm run test:api`. Сборка: `npm run build:ci`. В `frontend`: `npm ci`, `npm run build`. В Windows можно использовать `npm.cmd`.

[CI и PostgreSQL-тесты](docs/CI.md) · [DDD](docs/DDD_CHECKOUT.md) · [Saga](docs/CHECKOUT_SAGA.md) · [S3](docs/S3_STORAGE.md) · [Kubernetes: диагностика и остановка](k8s/README.md)
