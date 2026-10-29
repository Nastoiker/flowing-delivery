# Проверки ветки senior

## Дополнение 2026-10-29: S3 storage

- 18 API-тестов прошли, включая 8 новых проверок storage: локальная запись,
  уникальность ключей, подмена формата, ограничение размера, конфигурация,
  S3-команды, ошибки и сохранение чтения S3 при local driver.
- Linux backend-образ собран с AWS SDK v3; образ MinIO собран из закреплённого source tag.
- Overlay `deploy/s3-lab` содержит 19 ресурсов и прошёл локальную проверку связей.
- В kind выполнены запись/чтение local и S3, затем пересозданы API и MinIO Pod.
  SHA-256 ранее загруженных изображений совпал после перезапуска.
- HTTP отвергает пустую загрузку и поддельный PNG (400), отсутствующий объект
  возвращает 404 без immutable cache headers. Анонимное чтение bucket даёт 403.
- Базовый smoke `/menu` и `/api/categories` проходит при включённом S3.
- CI дополнен теми же сценариями; удалённый GitHub Actions не запускался.
- Реальный AWS/S3-провайдер за пределами локального MinIO не проверялся.

Настройка: [S3 storage](S3_STORAGE.md). Работа со стендом: [Kubernetes](KUBERNETES_GUIDE.md).

## Проверка 2026-10-29

Локально выполнены на Docker Desktop (Linux containers) и kind v0.33.0:

| Проверка | Результат |
|---|---|
| PostgreSQL: оформление заказа и saga integration tests | 23 теста прошли |
| API: уведомления после заказа и RMQ URI всех семи приложений | 10 тестов прошли |
| Docker backend build | Успешно; пять целевых приложений и зависимости |
| Docker frontend build | TypeScript/Vite успешно; предупреждение о размере bundle остаётся |
| Kubernetes | Все 8 Pod Ready, без перезапусков после исправления конфигурации |
| `node scripts/smoke.cjs` | Frontend `/menu` и API `/api/categories` успешно; категории получены через RMQ/account |
| `node scripts/validate-k8s.cjs` | 16 ресурсов согласованы |
| GitHub Actions | Workflow добавлен, YAML разобран локально; удалённый запуск пока не выполнялся |

Первый запуск обнаружил `Invalid URL`: nestjs-rmq вставляет credentials в URI
без экранирования. Во всех семи конфигурациях login/password теперь проходят
`encodeURIComponent`; регрессионный тест использует URI-builder установленной
библиотеки. После пересборки и перезапуска smoke check прошёл с тем же Secret.

Сага — отдельный модуль с PostgreSQL-состоянием, аудитом и тестовыми адаптерами.
Она не подключена к действующему checkout и реальному провайдеру платежей.
Тест восстановления создаёт новый экземпляр оркестратора после ошибки; отдельный
OS-процесс принудительно не завершался. Подробности: [Checkout saga](CHECKOUT_SAGA.md).
Нагрузочные проверки, production deployment и полный пользовательский checkout
через браузер в этот прогон не входили.

## Историческая проверка 2026-10-20

Дата: 2026-10-20. Исходное состояние ревью: ed26e91.

## Что проверено

| Проверка | Результат |
|---|---|
| Backend npm ci --ignore-scripts --no-audit --no-fund | Успешно |
| Frontend исходный lock | npm ci отклонял рассинхронизацию package.json / lock |
| Frontend после обновления lock: npm ci --ignore-scripts --no-audit --no-fund | Успешно |
| Nx build: api, account, banner, event, payment | Все пять успешно, включая изменения shutdown/init/fs |
| Frontend npm run build | TypeScript и Vite успешно; есть предупреждение о крупном JS chunk (~1.6 MB до gzip) |
| kubectl kustomize k8s | Успешная генерация 16 ресурсов |
| node scripts/validate-k8s.cjs | Согласованы selectors, ports, mounts, ConfigMap/Secret references и очереди |
| PowerShell Parser для трёх lab-скриптов | Синтаксических ошибок нет |
| git diff --check | Успешно |

Установка зависимостей выполнена без lifecycle scripts. Dockerfile выполняет обычный npm ci; проверка сборки на Windows не доказывает сборку Linux-образа.

## Какие изменения нужны для лаборатории

- Восстановлен frontend lock: без этого npm ci в образе не воспроизводился. Изменения транзитивных зависимостей отражены в lock; package.json фронтенда не менялся.
- Sequelize 6.37.3 объявлен прямой зависимостью: код импортирует sequelize напрямую. Версия совпадает с уже установленной.
- Загрузка файлов использует встроенный node:fs/promises вместо не объявленного напрямую fs-extra.
- В account app.init выполняется до seed; добавлены shutdown hooks пяти приложений для SIGTERM.
- У payment исправлена конфигурация, скопированная с banner: env-путь, fallback queue и serviceName.
- Добавлены точечные REVIEW-комментарии. Дефекты R1–R11 не считаются исправленными этим PR.

## Что не проверено и почему

- Docker image build и запуск контейнеров: Docker Desktop Linux engine недоступен в среде проверки.
- Применение к Kubernetes API, server-side validation, rollout, PVC и probes: Kubernetes-контекст отсутствует.
- Nginx runtime, RPC smoke test, регистрация, перезапуск БД и отказ брокера: требуют работающего стенда.
- Интеграционные проверки прав/заказов/оплаты и нагрузочные тесты не выполнялись.

Offline-валидатор проверяет согласованность манифестов, но не является Kubernetes schema validator и не доказывает работоспособность приложения.

## Условия выхода из draft

1. Запустить Docker Desktop и включить Kubernetes.
2. Выполнить Build-Lab.ps1 и Deploy-Lab.ps1 из инструкции.
3. Проверить categories через API → RabbitMQ → account → PostgreSQL и регистрацию тестового пользователя.
4. Пройти упражнения A–E, записать фактические наблюдения.
5. Приложить результаты в PR; отдельно запланировать исправление P0/P1 до внешнего доступа.
