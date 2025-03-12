## Desc

Сервис доставки еды, сделанный на микросервисах (DDD, SRP)

## Запуск всех контейнеров

```
docker compose -f docker-compose.yml -d --build

```

## Запуск без докера

```
docker compose -f docker-compose.local.yml up
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
