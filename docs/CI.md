# GitHub Actions

Workflow: [Delivery CI](../.github/workflows/ci.yml).

При push в любую ветку и при pull request независимо запускаются:

| Проверка | Что проверяется |
| --- | --- |
| Build (backend) | Nx собирает api, account, banner, event, payment и зависимости без кеша сборки |
| Build (frontend) | TypeScript и production-сборка Vite |
| Unit tests (domain) | Деньги, инварианты заказа, переходы статусов и application layer |
| Unit tests (api) | Контроллер заказа, RabbitMQ URL и media storage |
| PostgreSQL integration tests | Транзакции, конкурентное списание остатков, rollback и восстановление саги на PostgreSQL 16 |

Используются Node.js 22 и `npm ci` с lock-файлами. Ошибка команды делает соответствующую проверку красной. Новые коммиты отменяют предыдущий запуск для той же ветки или PR. Тесты используют одноразовую БД runner; GitHub Secrets для них не нужны.

В разделе Actions → Delivery CI → конкретный запуск доступны логи каждого job, сборки `build-backend`/`build-frontend` и JSON-отчёты Jest `tests-*`. Артефакты хранятся 7 дней. Backend-артефакт содержит скомпилированный код; для запуска также нужны runtime-зависимости и конфигурация. Frontend пока не имеет отдельного набора unit-тестов: CI проверяет его типы и сборку.

## Первый запуск

Отправить ветку с workflow на GitHub:

```sh
git push -u origin feature/ddd-checkout
```

После push открыть Actions → Delivery CI. Для защиты основной ветки можно выбрать пять перечисленных проверок как required status checks в ruleset репозитория после первого запуска.

## Дополнительная проверка Kubernetes и S3

После появления workflow в default branch доступна кнопка Actions → Delivery CI → Run workflow. Выбрать нужную ветку и включить `run_kubernetes`. После успешной сборки и тестов job собирает Docker-образы, поднимает временный kind, разворачивает сервисы, проверяет API и сохранность файлов после пересоздания API/MinIO. Кластер удаляется в конце, в том числе при ошибке. Обычный push/PR эту ресурсоёмкую проверку пропускает. Публикации образов и деплоя во внешний кластер нет.

## Локальная проверка

Из `delivery-service`:

```sh
npm ci
npm run build:ci
npm run test:domain -- --ci
npm run test:api -- --ci
```

Для интеграционных тестов из корня запустить `docker compose -f docker-compose.transactions.yml up -d --wait`, затем в `delivery-service`:

```powershell
$env:TRANSACTION_TEST_DATABASE_URL = 'postgres://transaction_student:local-test-only@127.0.0.1:55432/delivery_transactions_test'
npm.cmd run test:transactions -- --ci
```

Из `frontend`: `npm ci` и `npm run build`. В Windows при блокировке `npm.ps1` использовать `npm.cmd`.

Справка GitHub: [ручной запуск и inputs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), [артефакты](https://docs.github.com/en/actions/tutorials/store-and-share-data).
