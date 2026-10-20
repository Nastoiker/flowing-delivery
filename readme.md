# Flowing Delivery

Сервис доставки еды на React и NestJS с обменом сообщениями через RabbitMQ.

## Senior review и Kubernetes-лаборатория

- [Ревью: задумка, приоритеты, критерии исправления и план развития](docs/SENIOR_REVIEW.md)
- [Локальный Kubernetes: запуск, диагностика и упражнения](k8s/README.md)
- [Проверки и ограничения ветки senior](docs/SENIOR_VALIDATION.md)

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
