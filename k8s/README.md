# Kubernetes-лаборатория: от запуска до диагностики

Цель: самостоятельно объяснить Pod, Deployment, Service, ConfigMap, Secret и PVC; найти причину сбоя; проверить восстановление процесса и сохранность данных.

Это локальная лаборатория существующего приложения. Реальные платежи не выполнять, наружу сервисы не публиковать: [ревью](../docs/SENIOR_REVIEW.md) содержит неисправленные P0. Проверки текущей ветки перечислены в [отчёте](../docs/SENIOR_VALIDATION.md).

## Что запускается и почему

| Ресурс | Назначение | Учебное ограничение |
|---|---|---|
| Namespace flowing-delivery-lab | Отдельная область ресурсов | Не является полноценной границей безопасности |
| Deployment api | HTTP, WebSocket, файлы | Одна реплика: сокеты локальны процессу |
| Deployments account/banner/event/payment | RabbitMQ-обработчики | Ready без probe не доказывает готовность consumer |
| Deployment frontend | Собранная React SPA через непривилегированный Nginx | Браузер обращается к localhost:3444 |
| StatefulSet postgres + PVC | Базы delivery/banner/event/payment | Один сервер и один пользователь; нет HA |
| StatefulSet rabbitmq + PVC | Брокер с устойчивым именем и данными | Один узел; не кластер |
| PVC api-uploads | Файлы API переживают пересоздание Pod | ReadWriteOnce и Recreate; не горизонтальное масштабирование |
| ConfigMap | DNS-имена, имена баз, общие параметры | Изменения env требуют новых Pod |
| Secret | Случайные пароли и JWT secret | Secret не означает шифрование at rest по умолчанию |

Фактическая цепочка: браузер → localhost port-forward → API → RabbitMQ → account → PostgreSQL. Внутри Pod имя postgres — DNS Service; localhost означает сам Pod. Service не запускает контейнер: он даёт адрес для выбранных Pod.

Chat/email/file не запускаются как отдельные приложения: в просмотренном коде часть реализации шаблонная, а загрузка файлов выполняется в API. Платёжный сервис включён для знакомства с топологией, а не для проведения платежей.

## Требования

- Windows PowerShell, Docker Desktop с Linux containers.
- Kubernetes включён в Docker Desktop; контекст docker-desktop доступен.
- Default StorageClass с динамическим созданием volume.
- Ориентир для Docker Desktop: 4 CPU и 6–8 GiB RAM.
- Свободные локальные порты 5173 и 3444.

Скрипты намеренно принимают только docker-desktop. Они не переключают текущий контекст и не применяют изменения в другом кластере. Для kind/minikube потребуется отдельная адаптация загрузки образов.

Образы приложений локальные, imagePullPolicy: Never. Если backend не может найти локальный образ, проверь видимость образов между Docker и runtime выбранного Docker Desktop кластера. ErrImageNeverPull означает проблему доступности образа, не приложения.

## 1. Проверить окружение

Из корня репозитория:

```powershell
docker info
kubectl config get-contexts
kubectl --context docker-desktop get nodes
kubectl --context docker-desktop get storageclass
```

Если движок не запущен или контекста нет, сначала включи соответствующие функции Docker Desktop. Не пытайся лечить это изменениями приложения.

## 2. Собрать образы

```powershell
.\k8s\Build-Lab.ps1
```

Backend собирает пять Nx-приложений, runtime устанавливает production dependencies и работает от node. Frontend выполняет tsc + Vite build и отдаёт dist через Nginx на 8080; Service отображает его на 5173.

Dockerignore исключает env, uploads и node_modules. Существующий dump базы не импортируется. Теги инфраструктуры выбраны для лаборатории; это не политика обновлений production. Следующий этап — проверить поддержку версий и закрепить проверенные образы по digest.

## 3. Прочитать и применить описание

```powershell
kubectl kustomize k8s
node scripts/validate-k8s.cjs
.\k8s\Deploy-Lab.ps1
```

Валидатор требует предварительного npm ci в delivery-service. Он проверяет структуру и согласованность ссылок, но не заменяет API-сервер и запуск.

Deploy создаёт namespace и случайный Secret, затем применяет ресурсы и ожидает rollout. Повторный запуск сохраняет существующий Secret: новый пароль в Secret не меняет пароль уже инициализированной БД. Не удаляй Secret отдельно от понимания того, как восстановить доступ к PVC.

Init containers ждут TCP PostgreSQL/RabbitMQ. Это не аналог гарантированного порядка depends_on и не механизм восстановления после последующих отказов. Приложения должны сами корректно переживать потерю соединения.

PostgreSQL init SQL выполняется только для пустого PVC. При изменении SQL существующая БД автоматически не мигрирует. Account пока использует synchronize и стартовый seed; миграции/seed Job — отдельное упражнение.

## 4. Открыть приложение

В двух отдельных терминалах:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab port-forward service/api 3444:3444 --address 127.0.0.1
```

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab port-forward service/frontend 5173:5173 --address 127.0.0.1
```

Открой http://localhost:5173/menu. Именно localhost, поскольку CORS и адрес API в текущем клиенте фиксированы. После перезапуска выбранного Pod port-forward может завершиться — запусти его снова.

Smoke check проходит через API, брокер и consumer:

```powershell
Invoke-RestMethod http://localhost:3444/api/categories
```

Ожидается успешный ответ с категориями стартового seed. Затем зарегистрируй тестового пользователя через UI и войди. Это более сильная проверка, чем Pod Running или открытый TCP-порт. Исторические изображения seed могут отсутствовать; лаборатория не копирует uploads из исходной машины.

Заказ, права и оплата содержат известные дефекты. Успешный просмотр меню не является подтверждением их корректности.

## 5. Диагностировать

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab get pods,svc,pvc
kubectl --context docker-desktop -n flowing-delivery-lab get events --sort-by=.lastTimestamp
kubectl --context docker-desktop -n flowing-delivery-lab describe deployment api
kubectl --context docker-desktop -n flowing-delivery-lab logs deployment/account --tail=100
```

Для конкретного падающего Pod подставь его имя из get pods:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab describe pod <pod-name>
kubectl --context docker-desktop -n flowing-delivery-lab logs <pod-name> --previous
kubectl --context docker-desktop -n flowing-delivery-lab logs <pod-name> -c wait-for-infrastructure
```

| Симптом | Что проверить первым |
|---|---|
| Pending | Events, доступные ресурсы, Bound ли PVC, есть ли StorageClass |
| ErrImageNeverPull | Собран ли нужный тег в runtime кластера |
| Init:0/1 | Логи wait-for-infrastructure, DNS и Service зависимостей |
| CrashLoopBackOff | Текущие и previous логи; конфигурацию и доступность БД |
| API доступен, RPC не отвечает | Логи account, очередь, broker, состояние consumer |
| UI есть, API недоступен | Второй port-forward, адрес localhost и порт 3444 |
| Файл пропал | PVC api-uploads и mountPath, не только состояние Pod |

Не выводи содержимое Secret при диагностике в общий чат/лог.

## Упражнения: сначала предскажи результат

### A. Самовосстановление процесса

Запиши имя frontend Pod. Удали только Pod:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab delete pod -l app=frontend
kubectl --context docker-desktop -n flowing-delivery-lab get pods -w
```

Ожидается новый Pod с другим именем. Объясни, почему Deployment сохранился, кто создал замену и почему port-forward мог потребовать перезапуска.

### B. Сохранность данных

Создай тестового пользователя, запиши его email. Затем:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab delete pod postgres-0
kubectl --context docker-desktop -n flowing-delivery-lab rollout status statefulset/postgres --timeout=180s
```

Проверь повторный вход и прежний PVC. Данные должны сохраниться; подключение приложения может временно оборваться. Если оно не восстановилось, собери логи и объясни различие между восстановлением БД и клиента. Удалять PVC для этого опыта не нужно.

### C. Масштабирование безопасного компонента

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab scale deployment/frontend --replicas=2
kubectl --context docker-desktop -n flowing-delivery-lab get endpointslices -l kubernetes.io/service-name=frontend
kubectl --context docker-desktop -n flowing-delivery-lab scale deployment/frontend --replicas=1
```

Ожидаются два адреса после readiness. Port-forward обычно выбирает один Pod и не доказывает балансировку запросов. Почему аналогичный опыт с API пока некорректен? Найди R9 в ревью.

### D. Управляемый отказ зависимости

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab scale statefulset/rabbitmq --replicas=0
```

Повтори categories с таймаутом:

```powershell
Invoke-RestMethod http://localhost:3444/api/categories -TimeoutSec 10
```

Зафиксируй фактическую ошибку/таймаут; API может оставаться Ready, поскольку probe проверяет TCP listener. Восстанови брокер даже если запрос завершился ошибкой:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab scale statefulset/rabbitmq --replicas=1
kubectl --context docker-desktop -n flowing-delivery-lab rollout status statefulset/rabbitmq --timeout=180s
```

Проверь восстановление consumer. Если не восстановился — сохрани логи перед ручным рестартом. Сформулируй, что должна проверять настоящая readiness и почему liveness не должна перезапускать всё приложение из-за краткого сбоя брокера.

### E. Обновление и откат

Сначала запиши текущий image и историю. Можно безопасно проверить ошибку загрузки локального frontend образа:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab set image deployment/frontend frontend=flowing-delivery-frontend:missing
kubectl --context docker-desktop -n flowing-delivery-lab get pods
kubectl --context docker-desktop -n flowing-delivery-lab rollout undo deployment/frontend
kubectl --context docker-desktop -n flowing-delivery-lab rollout status deployment/frontend --timeout=180s
```

Ожидается ErrImageNeverPull у новой реплики и восстановление предыдущего template. Для реальных релизов используй разные теги: пересборка одного :senior не даёт отката содержимого образа.

Повторный Build-Lab с тем же тегом требует rollout restart приложений: apply неизменённого template не пересоздаёт Pod.

## Остановка и удаление

Остановить приложения с сохранением PVC:

```powershell
kubectl --context docker-desktop -n flowing-delivery-lab scale deployment --all --replicas=0
kubectl --context docker-desktop -n flowing-delivery-lab scale statefulset --all --replicas=0
```

Повторный Deploy-Lab вернёт replicas=1. Для полного удаления только этой лаборатории:

```powershell
kubectl --context docker-desktop delete namespace flowing-delivery-lab
```

Последняя команда удаляет Secret и PVC namespace; при стандартной Delete reclaim policy данные volume также удалятся. Это полный сброс, не обычная остановка.

## Следующий уровень

Реализовать readiness consumer; заменить synchronize миграциями; отделить seed Job; дать каждому сервису отдельного пользователя БД; исправить P0/P1; убрать локальное состояние API. Только после этого добавлять Ingress/TLS, NetworkPolicy, несколько API-реплик и нагрузочные эксперименты.

Источники: [Kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/), [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), [probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).
