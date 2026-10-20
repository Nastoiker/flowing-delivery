# Проверки ветки senior

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
