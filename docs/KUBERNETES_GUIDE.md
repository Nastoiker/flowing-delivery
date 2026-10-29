# Kubernetes на примере Flowing Delivery

Kubernetes постоянно сверяет желаемое состояние из YAML с реальным состоянием
контейнеров. Если Deployment требует одну реплику API, удаление его Pod приведёт
к появлению нового Pod. Чтобы остановить API, нужно изменить число реплик.

## Какие объекты есть в проекте

| Объект | Что означает здесь |
|---|---|
| Cluster `kind-flowing-delivery` | Локальный Kubernetes; его node работает как Docker-контейнер |
| Namespace `flowing-delivery-lab` | Область, в которой находятся ресурсы проекта |
| Pod | Запущенный экземпляр приложения с контейнером; может быть заменён |
| Deployment | Управляет API, frontend и worker-процессами, создаёт и заменяет Pod |
| StatefulSet | PostgreSQL, RabbitMQ, MinIO с постоянными именами Pod и томами |
| Service | Стабильный адрес для Pod: API обращается к `rabbitmq`, к S3 — `minio:9000` |
| ConfigMap | Несекретные настройки: адреса, имена БД и очередей |
| Secret | Пароли и ключи; base64 в Secret — кодировка, не шифрование |
| PVC | Запрос на постоянный диск; переживает замену Pod, но не является резервной копией |
| Job | Разовая задача, например создание S3 bucket |

Браузер → port-forward frontend/API → API → RabbitMQ → account → PostgreSQL.
При загрузке изображения: браузер → API → S3/MinIO → PVC MinIO.
`minio:9000` — адрес внутри кластера; браузер на Windows его не знает.

## Первые команды

Все команды ниже выполняются в PowerShell из корня `flowing-delivery`.
Сокращение задаёт кластер и namespace явно, чтобы команды не ушли в другое окружение:

```powershell
function k { & kubectl --context kind-flowing-delivery -n flowing-delivery-lab @args }
k get pods
k get deployments,statefulsets,svc,pvc,jobs
```

`READY 1/1` — контейнер готов согласно probe; `Running` без готовности недостаточно.
У текущих RMQ workers нет полноценной проверки consumer readiness, поэтому
проверяй бизнес-запрос: `node scripts/smoke.cjs` после настройки port-forward.

## Открыть приложение

В двух отдельных терминалах оставь работающими:

```powershell
kubectl --context kind-flowing-delivery -n flowing-delivery-lab port-forward service/api 3444:3444 --address 127.0.0.1
```

```powershell
kubectl --context kind-flowing-delivery -n flowing-delivery-lab port-forward service/frontend 5173:5173 --address 127.0.0.1
```

Открой http://localhost:5173/menu. `port-forward` — локальный туннель, не публикация
сайта в интернете. После замены выбранного Pod туннель нужно перезапустить.
Если порт занят уже работающим port-forward, используй его или закрой тот терминал.

## Разобраться, почему не работает

```powershell
k get pods
k logs deployment/api --tail=100
k logs deployment/account --tail=100
k get events --sort-by=.lastTimestamp
# Подставь имя Pod из get pods:
k describe pod POD_NAME
k logs POD_NAME --previous
```

| Симптом | Где искать причину |
|---|---|
| Pending | `describe pod`: ресурсы node, PVC, планировщик |
| Init:0/1 | Логи init container `wait-for-infrastructure`; доступность PostgreSQL/RabbitMQ |
| ErrImageNeverPull | Загрузить локальный Docker-образ в kind через `kind load docker-image` |
| CrashLoopBackOff | `logs --previous`: приложение падает при старте |
| Running, но не Ready | Probe не проходит; смотреть события и логи |
| 503 при загрузке | MinIO Pod/Job, bucket, настройки и доступ API к S3 |

`requests` — ресурсы для планирования, `limits` — верхняя граница потребления.
`readinessProbe` управляет допуском к трафику; `livenessProbe` может перезапустить
контейнер; `startupProbe` даёт приложению время стартовать. Они не заменяют тест API.

## Изменить конфигурацию и обновить код

YAML — исходное описание окружения. Kustomize собирает base и изменения overlay:

```powershell
kubectl kustomize deploy/s3-lab
kubectl --context kind-flowing-delivery diff -k deploy/s3-lab
kubectl --context kind-flowing-delivery apply -k deploy/s3-lab
```

`diff` показывает план; код выхода 1 означает наличие отличий. `apply` меняет
кластер. После включения S3 используй его overlay, иначе base может вернуть
локальные настройки. `apply` не собирает Docker-образ из исходников.

Для обновления backend в текущей лаборатории:

```powershell
docker build -f delivery-service/Dockerfile.k8s -t flowing-delivery-backend:senior delivery-service
kind load docker-image --name flowing-delivery flowing-delivery-backend:senior
k rollout restart deployment/api deployment/account deployment/banner deployment/event deployment/payment
k rollout status deployment/api --timeout=180s
```

Если `kind` не установлен в PATH, используй
`& "$env:TEMP/flowing-kind-v0.33.0.exe" load docker-image ...` с теми же аргументами.
В лаборатории тег `senior` переиспользуется, поэтому нужен `rollout restart`.
Для релизов давай каждому образу отдельный неизменяемый тег или digest:
только тогда `rollout undo` сможет восстановить прежний код.

## Самостоятельное упражнение

```powershell
k get pods -l app=frontend
k delete pod -l app=frontend
k get pods -l app=frontend -w
```

Появится Pod с новым именем: Deployment восстановил желаемую реплику.
Остановить наблюдение — Ctrl+C. Затем попробуй:

```powershell
k scale deployment/frontend --replicas=2
k get pods -l app=frontend
k scale deployment/frontend --replicas=1
```

Frontend stateless, две реплики допустимы. Для API сначала потребуется вынести
WebSocket-состояние; S3 решает только хранение файлов.

## Остановить без потери данных

```powershell
docker stop flowing-delivery-control-plane
# Возобновить:
docker start flowing-delivery-control-plane
```

После старта дождись готовности Pod и восстанови port-forward.
`kind delete cluster` или удаление namespace/PVC — уже сброс лаборатории с риском
потери данных, не обычная остановка. PostgreSQL, MinIO и RabbitMQ требуют отдельных
планов резервного копирования для настоящей эксплуатации.

Подробнее: [объекты Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/),
[S3 в этом проекте](S3_STORAGE.md), [развёрнутый практикум](../k8s/README.md).
