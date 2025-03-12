```
##Сервис доставки еды

##Запуск всех контейнеров

docker compose -f docker-compose.yml -d --build


##Запуск бд и rmq(необходимых)

docker compose -f docker-compose.local.yml up
```

```
##Запуск без докера

backend:
nx run-many --target=serve --all --parallel=2

frontend:
yarn
yarn run dev
```
