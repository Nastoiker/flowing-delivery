# Flowing Delivery

Сервис доставки еды на React и NestJS с обменом сообщениями через RabbitMQ.

## Проверяемые инженерные сценарии

- [S3 storage](docs/S3_STORAGE.md): local/S3, закрытый bucket, MinIO-стенд и проверка сохранности файлов после замены Pod.
- [Как работать с Kubernetes](docs/KUBERNETES_GUIDE.md): объекты проекта, команды, обновление и диагностика.
- Транзакционное оформление и конкурентное списание остатков: `npm run test:transactions` в `delivery-service`.
- [Durable checkout saga](docs/CHECKOUT_SAGA.md): компенсации, идемпотентность, восстановление после потери ответа; пока отдельный модуль с тестовыми участниками.
- [GitHub Actions](.github/workflows/ci.yml): PostgreSQL integration tests, API tests, сборка пяти backend-сервисов и frontend, развёртывание в kind и smoke check API через RabbitMQ.
- [Kubernetes](k8s/README.md): локальный стенд с PVC, probes, лимитами ресурсов и генерируемыми секретами.

CI запускается при push/PR. Наличие workflow не означает, что он уже прошёл на GitHub.

## Senior review и Kubernetes-лаборатория

- [Ревью: задумка, приоритеты, критерии исправления и план развития](docs/SENIOR_REVIEW.md)
- [Локальный Kubernetes: запуск, диагностика и упражнения](k8s/README.md)
- [Проверки и ограничения ветки senior](docs/SENIOR_VALIDATION.md)
- [Практикум: транзакции, конкурентные заказы и восстановление после ошибок](docs/TRANSACTIONS_LAB.md)

## Запуск всех контейнеров

```
docker compose -f docker-compose.yml up -d --build

```

## Запуск без докера

```
docker compose -f docker-compose.local.yml up --build
```

### backend:

```
nx run-many --target=serve --all --parallel=2

```

### frontend:

```
yarn
yarn run dev
```
