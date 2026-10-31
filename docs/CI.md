# GitHub Actions

Workflow: [Delivery CI](../.github/workflows/ci.yml).

При push в любую ветку и при pull request независимо запускаются:

| Проверка | Что проверяется |
| --- | --- |
| Build (backend) | Nx собирает api, account, banner, event, payment и зависимости без кеша сборки |
| Build (frontend) | TypeScript и production-сборка Vite |
| Unit tests (domain) | Деньги, инварианты заказа, переходы статусов и application layer |
| Unit tests (api) | Контроллер заказа, RabbitMQ URL, media storage, уведомления и health checks |
| PostgreSQL integration tests | Транзакции, конкурентное списание остатков, rollback и восстановление саги на PostgreSQL 16 |

Используются Node.js 22 и `npm ci` с lock-файлами. Ошибка команды делает соответствующую проверку красной. Новые коммиты отменяют предыдущий запуск для той же ветки или PR. Тесты используют одноразовую БД runner; GitHub Secrets для них не нужны.

В разделе Actions → Delivery CI → конкретный запуск доступны логи каждого job, сборки `build-backend`/`build-frontend` и JSON-отчёты Jest `tests-*`. Артефакты хранятся 7 дней. Backend-артефакт содержит скомпилированный код; для запуска также нужны runtime-зависимости и конфигурация. Frontend пока не имеет отдельного набора unit-тестов: CI проверяет его типы и сборку.

## Браузер и проверка работающего приложения

Workflow [Codespaces demo smoke](../.github/workflows/demo-smoke.yml) поднимает отдельный Docker Compose-стенд на runner, импортирует синтетические данные и проверяет повторный запуск. Playwright проходит регистрацию/вход, меню, категории, поиск, пустой результат и карточку товара на desktop и mobile. Отдельный сценарий проверяет корзину, обработку отказа оформления, заказ с самовывозом и историю заказов. Затем тест останавливает account: readiness должна стать 503, liveness остаться 200, после запуска account readiness возвращается в 200. При провале доступны логи контейнеров и скриншоты браузера, если они были сделаны.

[Deploy demo](../.github/workflows/deploy-demo.yml) вызывает оба workflow через `workflow_call`. Только после их успеха публикует Docker-образы с SHA коммита в GHCR и обновляет удалённый k3s по SSH. Деплой выключен до настройки `DEPLOY_ENABLED=true` и серверных secrets. Текущий публичный туннель на локальном компьютере не обновляется GitHub Actions: его обновляет локальный запуск `scripts/start-demo.sh`.

Health endpoints и ограничения: [HEALTH_CHECKS.md](HEALTH_CHECKS.md).

## Запуск на GitHub

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
